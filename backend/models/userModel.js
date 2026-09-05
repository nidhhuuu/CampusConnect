import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const filePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'users.json')
const ensureStore = () => { if (!existsSync(filePath)) { mkdirSync(dirname(filePath), { recursive: true }); writeFileSync(filePath, '[]') } }
const readUsers = () => { ensureStore(); return JSON.parse(readFileSync(filePath, 'utf8')) }
const writeUsers = (users) => { ensureStore(); writeFileSync(filePath, JSON.stringify(users, null, 2)) }
const normalize = (value) => String(value || '').trim().toLowerCase()
const hashPassword = (password, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
const verifyPassword = (password, stored) => { const [salt, hash] = String(stored).split(':'); if (!salt || !hash) return false; const candidate = scryptSync(password, salt, 64); return timingSafeEqual(candidate, Buffer.from(hash, 'hex')) }
const publicUser = ({ passwordHash, ...user }) => user

export const userModel = {
  create: ({ name, email, phone, password, college, branch, year, semester }) => { const users = readUsers(); if (users.some((user) => normalize(user.email) === normalize(email))) throw new Error('An account with this email already exists'); const user = { id: randomBytes(12).toString('hex'), name: String(name).trim(), email: normalize(email), phone: String(phone).trim(), college: String(college || 'Matrusri Engineering College').trim(), branch: String(branch || '').trim(), year: String(year || '').trim(), semester: String(semester || '').trim(), passwordHash: hashPassword(password), createdAt: new Date().toISOString() }; users.push(user); writeUsers(users); return publicUser(user) },
  findByEmail: (email) => readUsers().find((user) => normalize(user.email) === normalize(email)),
  verify: (email, phone, password) => { const user = userModel.findByEmail(email); if (!user || (phone && user.phone !== String(phone).trim()) || !verifyPassword(password, user.passwordHash)) return null; return publicUser(user) },
  public: publicUser,
}
