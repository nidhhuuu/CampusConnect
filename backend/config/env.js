import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET || 'development-only-change-me',
}
