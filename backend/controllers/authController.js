import { randomBytes } from 'node:crypto'
import { userModel } from '../models/userModel.js'

const sessions = new Map()
const cookieName = 'campusconnect_session'
const cookieOptions = 'HttpOnly; Path=/; SameSite=Lax; Max-Age=86400'
const parseCookies = (header = '') => Object.fromEntries(header.split(';').map((item) => item.trim().split('=')).filter(([key, value]) => key && value))
const setSession = (response, user) => { const token = randomBytes(32).toString('hex'); sessions.set(token, user); response.setHeader('Set-Cookie', `${cookieName}=${token}; ${cookieOptions}`) }
const getSessionUser = (request) => sessions.get(parseCookies(request.headers.cookie)[cookieName])
const required = (body, fields) => fields.find((field) => !String(body[field] || '').trim())

export const authController = {
  signup: (request, response) => { const missing = required(request.body, ['name', 'email', 'phone', 'password']); if (missing) return response.status(400).json({ message: `${missing} is required` }); try { const user = userModel.create(request.body); setSession(response, user); return response.status(201).json({ user }) } catch (error) { return response.status(409).json({ message: error.message }) } },
  login: (request, response) => { const missing = required(request.body, ['identifier', 'password']); if (missing) return response.status(400).json({ message: `${missing} is required` }); const user = userModel.verify(request.body.identifier, request.body.password); if (!user) return response.status(401).json({ message: 'Invalid email, phone number, or password' }); setSession(response, user); return response.json({ user }) },
  me: (request, response) => { const user = getSessionUser(request); return user ? response.json({ user }) : response.status(401).json({ message: 'Authentication required' }) },
  logout: (request, response) => { const cookies = parseCookies(request.headers.cookie); sessions.delete(cookies[cookieName]); response.setHeader('Set-Cookie', `${cookieName}=; ${cookieOptions}; Max-Age=0`); return response.status(204).end() },
}
