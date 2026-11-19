const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function sendChatMessage(messages) {
  let response
  try {
    response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ messages }),
    })
  } catch {
    throw new Error('Cannot reach the CampusConnect backend. Start or restart it from the backend folder, then try again.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data.message || `Chat request failed (HTTP ${response.status}). Check that the backend is running.`
    throw new Error(message)
  }
  if (typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new Error('The AI service returned an empty response. Please try again.')
  }
  return {
    reply: data.reply.trim(),
    sources: Array.isArray(data.sources) ? data.sources : [],
  }
}
