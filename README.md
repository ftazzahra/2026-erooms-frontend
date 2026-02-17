# E-Rooms Frontend

Frontend application for the E-Rooms Room Booking System built using React, TypeScript, and Vite.

---

## Project Overview

E-Rooms is a web-based room booking management system that allows:

- Users to browse available rooms and make reservations
- Users to view booking history
- Admins to manage rooms and bookings
- Role-based dashboard access (Admin & User)

This frontend application connects to the E-Rooms Backend API.

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Axios

---

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/ftazzahra/2026-erooms-frontend.git
cd 2026-erooms-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables:

```bash
cp .env.example .env
```

4. Run development server:

```bash
npm run dev
```

Application runs on:

```
http://localhost:5173
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Backend API base URL |
| VITE_API_TIMEOUT | API request timeout |
| VITE_APP_ENV | Application environment |
| VITE_AUTH_TOKEN_KEY | Key for storing authentication token |

---

## Project Structure

```
2026-EROOMS-FRONTEND
│
├── public/
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── layouts/
│   │   └── ProtectedRoute.tsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   ├── user/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   └── Register.tsx
│   │
│   ├── services/
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   └── index.css
│
├── .env.example
├── CHANGELOG.md
├── LICENSE
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Features

- Authentication (Login & Register)
- Role-based access control (Admin & User)
- Admin Room Management
- Admin Booking Management
- User Room Browsing
- User Booking History
- Profile Page
- Protected Routes

---

## License

This project is licensed under the MIT License.  
See the [MIT License](./LICENSE) for more details.

---

## Changelog

All notable changes are documented in the [CHANGELOG](./CHANGELOG.md).
