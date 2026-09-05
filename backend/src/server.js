import express from 'express'
import cors from 'cors'
import { env } from '../config/env.js'
import { authRoutes } from '../routes/authRoutes.js'

const app = express()
app.use(cors({ origin: env.frontendOrigin, credentials: true }))
app.use(express.json())
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use((error, _request, response, _next) => response.status(500).json({ message: 'Internal server error' }))
app.listen(env.port, () => console.log(`CampusConnect backend listening on http://localhost:${env.port}`))
