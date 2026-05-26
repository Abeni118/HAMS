<div align="center">

<img src="https://img.shields.io/badge/HAMS-Hospital%20Appointment%20Management%20System-698bf4?style=for-the-badge&logo=heart&logoColor=white" alt="HAMS Banner" />

<br/>
<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<br/>

**HAMS** is a full-stack hospital appointment and healthcare workflow management platform built on the MERN stack. It provides dedicated portals for Patients, Doctors, Nurses, and Administrators — enabling modern, efficient, and secure hospital operations.

[Live Demo](https://hams-1-1pbn.onrender.com) · [Report Bug](https://github.com/Abeni118/HAMS/issues) · [Request Feature](https://github.com/Abeni118/HAMS/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## ✨ Features

### 🔐 Authentication & Security
- Secure JWT-based authentication stored in `httpOnly` cookies
- Role-Based Access Control (RBAC) — Patient, Doctor, Nurse, Admin
- Admin-only account creation (no public admin self-registration)
- Bootstrap admin seeding from environment variables
- Protected routes on both frontend and backend

### 🧑‍⚕️ Patient Portal
- Book, reschedule, and cancel appointments
- View full appointment history with detailed modal
- Access personal medical reports uploaded by doctors
- Real-time notifications for appointment status updates
- Profile and settings management

### 👨‍⚕️ Doctor Portal
- Manage daily schedule and consultation availability
- View assigned patient queue
- Upload and manage patient medical reports
- Real-time alerts for new appointments
- Profile and specialization management

### 🩺 Nurse Portal
- Patient queue management and triage
- Record and track patient vitals
- Nurse notes and observations per patient
- Auto queue population on appointment approval

### 🏥 Admin Portal
- Full hospital analytics dashboard
- User management (create, update, deactivate users)
- Department management
- Appointment oversight and status management
- System-wide audit logs
- Admin privilege granting and creation

### 🌐 Public Landing Page
- Professional hospital marketing website
- Department overview, statistics, and feature highlights
- Links to Privacy Policy and Terms of Service
- Fully responsive with animations

### 📱 Responsive Design
- Mobile-first responsive layout
- Collapsible sidebar drawer on tablet and mobile
- Hamburger menu with smooth slide animation
- Works across all devices and screen sizes

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **State Management** | Zustand |
| **Routing** | React Router DOM v6 |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) + HTTP-only Cookies |
| **File Uploads** | Cloudinary |
| **Real-time** | Socket.IO |
| **Icons** | Lucide React |
| **Deployment** | Render (Frontend + Backend), MongoDB Atlas |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────┐
│              Browser / Client                │
│         React 18 + Vite + Tailwind          │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Patient  │  │  Doctor  │  │  Admin   │  │
│  │  Portal  │  │  Portal  │  │  Portal  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────┬─────────────────────────┘
                    │  HTTPS + JWT Cookie
                    ▼
┌─────────────────────────────────────────────┐
│           Node.js / Express API             │
│                                             │
│  Auth │ Users │ Appointments │ Reports      │
│  Notifications │ Nurse │ Admin │ Dashboard  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │         Middleware Stack             │   │
│  │  protectRoute │ isAdmin │ roleCheck  │   │
│  └──────────────────────────────────────┘   │
└───────────────────┬─────────────────────────┘
                    │  Mongoose ODM
                    ▼
┌─────────────────────────────────────────────┐
│               MongoDB Atlas                  │
│                                             │
│  Users │ Appointments │ Reports             │
│  Notifications │ AuditLogs │ Schedules      │
└─────────────────────────────────────────────┘
```

---

## 📸 Screenshots

> Screenshots from the live deployed application.

| Page | Preview |
|---|---|
| 🏠 Landing Page | *(Add screenshot)* |
| 🔐 Login Page | *(Add screenshot)* |
| 📊 Patient Dashboard | *(Add screenshot)* |
| 👨‍⚕️ Doctor Dashboard | *(Add screenshot)* |
| 🩺 Nurse Dashboard | *(Add screenshot)* |
| 🏥 Admin Dashboard | *(Add screenshot)* |
| 📅 Appointments Page | *(Add screenshot)* |
| 📱 Mobile View | *(Add screenshot)* |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/Abeni118/HAMS.git
cd HAMS
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory (see [Environment Variables](#-environment-variables)).

```bash
npm run dev
```

Backend runs on: `http://localhost:5001`

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `/frontend` directory (see [Environment Variables](#-environment-variables)).

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend — `/backend/.env`

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Bootstrap Admin (created automatically on first server start if no admin exists)
ADMIN_EMAIL=admin@hams.gov.et
ADMIN_PASSWORD=your_secure_admin_password

# Cloudinary (for profile picture uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend — `/frontend/.env`

```env
VITE_API_URL=http://localhost:5001/api
```

> ⚠️ **Important:** Do not commit `.env` files to version control. They are listed in `.gitignore`.

---

## 📡 API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register (patient, doctor, nurse only) |
| `POST` | `/api/auth/login` | Public | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | Auth | Logout and clear cookie |
| `GET` | `/api/appointments` | Auth | Get user's appointments |
| `POST` | `/api/appointments` | Patient | Book new appointment |
| `GET` | `/api/appointments/:id` | Auth | Get single appointment detail |
| `PUT` | `/api/appointments/:id/status` | Auth | Update appointment status |
| `GET` | `/api/notifications` | Auth | Get user notifications |
| `GET` | `/api/dashboard/doctor` | Doctor | Doctor dashboard stats |
| `GET` | `/api/admin/dashboard` | Admin | Admin dashboard stats |
| `POST` | `/api/admin/create-admin` | Admin | Create new admin account |
| `PUT` | `/api/admin/grant-admin/:id` | Admin | Promote user to admin |
| `GET` | `/api/admin/audit-logs` | Admin | View system audit logs |

---

## ☁️ Deployment

This project is deployed on **Render** (free tier).

| Service | Platform | URL |
|---|---|---|
| Frontend | Render Static Site | [hams-1-1pbn.onrender.com](https://hams-1-1pbn.onrender.com) |
| Backend API | Render Web Service | [hams-avd4.onrender.com](https://hams-avd4.onrender.com) |
| Database | MongoDB Atlas | Cloud (M0 Free Cluster) |

### Deploy Your Own

1. Push your code to GitHub
2. Create a new **Web Service** on Render for the backend
3. Create a new **Static Site** on Render for the frontend (build command: `npm run build`, publish dir: `dist`)
4. Add all environment variables in the Render dashboard
5. Set `VITE_API_URL` to your backend Render URL + `/api`
6. Set `CLIENT_URL` in backend to your frontend Render URL

---

## 🔮 Future Improvements

- [ ] **Email Notifications** — Appointment confirmation and reminder emails via Resend/SendGrid
- [ ] **Advanced Analytics** — Charts and graphs for patient trends, appointment volume, department performance
- [ ] **Telemedicine Support** — Video consultation integration
- [ ] **Prescription Management** — Doctor-generated digital prescriptions
- [ ] **Medical History Timeline** — Patient-facing visual health timeline
- [ ] **Mobile App** — React Native companion app
- [ ] **Multi-language Support** — Amharic and English UI
- [ ] **Advanced Reporting** — PDF export for medical reports and audit logs

---

## 📁 Project Structure

```
HAMS/
├── backend/
│   └── src/
│       ├── controllers/      # Route handlers
│       ├── middleware/        # Auth, role guards
│       ├── models/            # Mongoose schemas
│       ├── routes/            # Express routers
│       ├── lib/               # DB, socket, utils
│       └── server.js          # Entry point
│
└── frontend/
    └── src/
        ├── components/        # Reusable UI components
        │   ├── patient/       # Patient-specific components
        │   └── ...
        ├── pages/             # Route-level pages
        │   ├── patient/
        │   ├── doctor/
        │   ├── nurse/
        │   └── admin/
        ├── store/             # Zustand state stores
        ├── lib/               # Axios instance
        └── App.jsx            # Root with routes
```

---

## 👨‍💻 Author

**Abenezer**

[![GitHub](https://img.shields.io/badge/GitHub-Abeni118-181717?style=flat-square&logo=github)](https://github.com/Abeni118)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for Arba Minch General Hospital

**HAMS — Improving Healthcare, One Appointment at a Time.**

</div>
