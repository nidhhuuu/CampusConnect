import { Router } from 'express'
import { authController } from '../controllers/authController.js'

export const authRoutes = Router()
authRoutes.post('/signup', authController.signup)
authRoutes.post('/login', authController.login)
authRoutes.get('/me', authController.me)
authRoutes.post('/logout', authController.logout)
