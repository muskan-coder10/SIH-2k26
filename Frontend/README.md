# ANNDISHA — Final React Project

Single React/Vite project combining the ANNDISHA landing page, farmer dashboard, farmer language system, and the existing admin/officer prototype portals.

## Routes
- `/` — Landing page
- `/farmer/login` — Farmer login
- `/farmer/dashboard` — Full Smart Kisan farmer dashboard
- `/farmer/token`
- `/farmer/schedule`
- `/farmer/centre`
- `/farmer/crop-status`
- `/farmer/payment`
- `/officer/login`, `/officer/dashboard`, `/officer/verification`, `/officer/weighing`, `/officer/procurement`, `/officer/payment`
- `/admin/login`, `/admin/dashboard`, `/admin/farmers`, `/admin/centres`, `/admin/reports`

## Run
```bash
npm install
npm run dev
```

## Team structure
- `src/pages/landing` / `src/sections` — landing page
- `src/pages/farmer/smart-kisan` — farmer dashboard source
- `src/pages/officer` — officer portal
- `src/pages/admin` — admin portal
- `src/components` — shared landing/auth shell components
- `src/styles` — shared and role styles

Do not create duplicate `package.json`, `App.jsx`, `main.jsx`, Vite, or Tailwind configs in role folders. Each member should work only inside their assigned folder and merge through Git branches.


## Latest Farmer Dashboard Integration
The latest Smart Kisan Farmer Dashboard is included in `src/pages/farmer/smart-kisan/`.
