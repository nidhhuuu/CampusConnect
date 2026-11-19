import { Router } from 'express'
import { env } from '../config/env.js'

export const chatRoutes = Router()

const systemPrompt = `You are CampusConnect's friendly student support assistant. Help with using the CampusConnect website, academics, admissions, campus life, scholarships, and general college questions. Use browser search to verify factual answers, especially college names, locations, addresses, courses, fees, admissions, and other details that may change. Prefer official college or government sources when available. If sources disagree, explain the discrepancy. Be concise and clear. Do not claim access to private student records or unpublished notices. If reliable sources do not answer a question, say what could not be verified instead of guessing.`

chatRoutes.post('/', async (request, response) => {
  if (!env.groqApiKey) {
    return response.status(503).json({ message: 'The AI assistant is not configured. Add GROQ_API_KEY to backend/.env and restart the backend.' })
  }

  const incoming = request.body?.messages
  if (!Array.isArray(incoming) || incoming.length === 0 || incoming.length > 20) {
    return response.status(400).json({ message: 'Send between 1 and 20 chat messages.' })
  }

  const messages = []
  for (const item of incoming) {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') {
      return response.status(400).json({ message: 'Each message must have a user or assistant role and text content.' })
    }
    const content = item.content.trim()
    if (!content || content.length > 4000) {
      return response.status(400).json({ message: 'Messages must contain 1 to 4000 characters.' })
    }
    messages.push({ role: item.role, content })
  }

  if (messages.at(-1).role !== 'user') {
    return response.status(400).json({ message: 'The latest message must be from the user.' })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.groqModel,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 1,
        max_completion_tokens: 1400,
        reasoning_effort: 'low',
        tools: [{ type: 'browser_search' }],
        // Let the model search for factual questions, but still answer if it
        // determines that no search tool call is needed for a prompt.
        tool_choice: 'auto',
      }),
      signal: controller.signal,
    })

    if (!groqResponse.ok) {
      const providerError = await groqResponse.json().catch(() => ({}))
      const providerMessage = providerError.error?.message
      if (groqResponse.status === 401 || groqResponse.status === 403) {
        return response.status(502).json({ message: 'Groq rejected the API key. Check GROQ_API_KEY in backend/.env.' })
      }
      if (groqResponse.status === 429) {
        return response.status(503).json({ message: providerMessage || 'The AI service is busy. Please wait a moment and try again.' })
      }
      console.error('Groq request failed:', groqResponse.status, providerMessage || '(no provider details)')
      return response.status(502).json({
        message: providerMessage
          ? `Groq could not answer: ${providerMessage}`
          : `The AI service returned HTTP ${groqResponse.status}. Please check the backend logs.`,
      })
    }

    const result = await groqResponse.json()
    const assistantMessage = result.choices?.[0]?.message
    const reply = assistantMessage?.content?.trim()
    if (!reply) throw new Error('Groq returned an empty response')

    const sourceMap = new Map()
    for (const tool of assistantMessage.executed_tools || []) {
      for (const source of tool.search_results?.results || []) {
        try {
          const url = new URL(source.url)
          if (!['https:', 'http:'].includes(url.protocol) || !source.title || url.hostname === 'exa.ai') continue
          sourceMap.set(url.href, { title: source.title.slice(0, 200), url: url.href })
        } catch {
          // Ignore malformed search result URLs.
        }
      }
    }

    const sources = [...sourceMap.values()].slice(0, 5)
    const cleanReply = reply.replace(/[\u3010\u3016]\d+\u2020L\d+(?:-L\d+)?[\u3011\u3017]/g, '').trim()
    return response.json({ reply: cleanReply, sources })
  } catch (error) {
    if (error.name === 'AbortError') {
      return response.status(504).json({ message: 'The AI service took too long to respond. Please try again.' })
    }
    console.error('Chat completion failed:', error.message)
    return response.status(502).json({ message: 'Could not reach the AI service. Check your connection and try again.' })
  } finally {
    clearTimeout(timeout)
  }
})
