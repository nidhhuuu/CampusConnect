# CampusConnect

CampusConnect is split into two independent applications:

- `frontend/`: React + Vite student experience
- `backend/`: Express API with authentication and persistent development storage

## Safe migration checklist

- [x] Existing root frontend source copied into `frontend/` before cleanup.
- [x] Existing UI, routes, data, images, navigation, search, menu, and MECS-Bot preserved in `frontend/`.
- [x] Frontend build passes from `frontend/`.
- [x] Backend API structure created without overwriting frontend data.
- [x] Backend build/start validation completed from `backend/`.
- [ ] Before production, replace `backend/data/users.json` with a managed database.
- [ ] Set a strong `SESSION_SECRET` in `backend/.env`.
- [ ] Set `VITE_API_URL` in `frontend/.env` for the deployed backend.
- [ ] Review CORS origin and cookie settings for the deployment domains.

## Responsive navigation verification checklist

- Desktop `>900px`: header shows Home, Search, MECS-Bot, Profile, Student Portal, and Menu; Academics, Attendance, and Scholarships are not top-nav items.
- Laptop `901px-1200px`: the same desktop navigation remains visible and compact.
- Tablet `621px-900px`: Home, MECS-Bot, and Profile remain visible in the header, with Search, Student Portal, and Menu controls beside them.
- Mobile `<=620px`: bottom navigation shows Home, Search, MECS-Bot, and Profile.
- Explore More follows the campus composition closely at each breakpoint without the former large vertical gap.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Run the backend

In a second terminal:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

The API runs at `http://localhost:4000`; health check: `http://localhost:4000/api/health`.

## Frontend/backend communication

The frontend API client uses `VITE_API_URL` when provided and otherwise calls `/api`. The Vite development proxy forwards `/api` to `http://localhost:4000`. Authentication uses JSON API requests and an HTTP-only session cookie. Passwords are hashed on the backend and are never returned to the frontend.

## Migration summary

Frontend files are under `frontend/`: `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, `.env.example`, and the complete `src/` tree.

Backend files are under `backend/`: `package.json`, `.env.example`, `src/server.js`, `routes/authRoutes.js`, `controllers/authController.js`, `models/userModel.js`, `config/env.js`, and `data/users.json`.

No existing frontend data or functionality was intentionally deleted. The original root files remain available until the split has been reviewed; the independent applications are the copies under `frontend/` and `backend/`.
