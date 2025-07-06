<h1 align="center">🚀 WorkMatch – A Labour Marketplace of Bangladesh</h1>

<p align="center" >
  <a href="https://labour-marketplace.netlify.app/"><img src="https://img.shields.io/badge/Frontend-Live-green?style=for-the-badge&logo=netlify" alt="Frontend Live Site"></a> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  <a href="https://labour-marketplace.vercel.app/"><img src="https://img.shields.io/badge/Backend-Live-blue?style=for-the-badge&logo=vercel" alt="Backend Live Site"></a>
</p>

---

## ✨ Overview

**WorkMatch** is a modern MERN stack platform connecting clients with skilled workers across Bangladesh. Clients can post jobs, review bids, and hire trusted workers. Workers can create rich profiles, bid on jobs, and build their reputation through ratings and reviews.

---

## 🏆 Features

### 👔 For Clients
- **Register/Login** as a client
- **Post jobs** with detailed requirements, categories, and deadlines
- **Review and manage bids** from workers
- **Assign jobs** to workers and track progress
- **Rate and review** workers after job completion
- **Dashboard** for managing posted jobs and incoming bids

### 🛠️ For Workers
- **Register/Login** as a worker
- **Create a professional profile card** with skills, experience, and photo
- **Browse and search jobs** by category, location, and budget
- **Bid on jobs** with custom proposals and pricing
- **Track accepted jobs** and update job status
- **Receive ratings and reviews** to build reputation
- **Dashboard** for managing submitted and accepted bids

### 🌐 General
- **Role-based access control** (client/worker)
- **Modern, responsive UI** (React, Tailwind, Mantine, MUI)
- **Secure authentication** (JWT)
- **Robust backend** (Express, MongoDB, Mongoose)
- **API proxying** for seamless frontend-backend integration
- **CORS and security best practices**
- **SPA routing and deep linking** (Netlify + Vite)
- **Error handling and user feedback throughout**

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Mantine, MUI, Redux Toolkit, Axios, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, CORS, dotenv, Nodemailer/SendGrid (for email)
- **Deployment:** Netlify (frontend), Vercel (backend)
- **Other:** ESLint, PostCSS, SPA routing, API proxy

---

## 🔄 User Flows

### 👔 Clients
1. Register and create a profile
2. Post a job with details and requirements
3. Review incoming bids and worker profiles
4. Assign job(s) to chosen worker(s)
5. Track job progress and communicate with workers
6. Rate and review workers after completion

### 🛠️ Workers
1. Register and complete a profile card
2. Browse and search for jobs
3. Submit bids with proposals and pricing
4. Get hired and update job status as work progresses
5. Receive ratings and reviews to build reputation

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB database (local or cloud, e.g., MongoDB Atlas)

### Local Development

### 1️⃣ Backend

```bash
cd server
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# SENDGRID_API_KEY=your_sendgrid_api_key (optional, for email)
# EMAIL_FROM=your_email_address (optional, for email)
npm run dev
```

### 2️⃣ Frontend

```bash
cd client
npm install
npm run dev
# The app will run at http://localhost:5173 (or similar)
```

---

## 🚀 Deployment

### Backend (Vercel)
- Import the `server/` directory as a new project on [Vercel](https://vercel.com/)
- Set environment variables in the Vercel dashboard:
  - `MONGO_URI`, `JWT_SECRET`, `SENDGRID_API_KEY`, `EMAIL_FROM`
- No build step needed; Vercel uses `vercel.json` and `index.js` as entry point

### Frontend (Netlify)
- Import the `client/` directory as a new project on [Netlify](https://netlify.com/)
- Build command: `npm run build`
- Publish directory: `dist`
- API proxy is pre-configured in `vite.config.js`
- SPA routing and API proxying handled via `netlify.toml`

---

## 📚 API Overview

- **Auth:** `/api/auth/register`, `/api/auth/login`
- **Jobs:** `/api/jobs` (CRUD, status, queries)
- **Bids:** `/api/bids` (create, update, queries)
- **Users:** `/api/user/profile`, `/api/user/workers`, `/api/user/worker/:id`
- **Reviews:** `/api/reviews` (submit, get by worker/client)

All protected routes require a Bearer JWT token.

---

## 🔒 Security & Best Practices

- JWT authentication for all protected endpoints
- Role-based access enforced in backend controllers
- CORS restricts API access to frontend domain
- Input validation and error handling throughout
- Environment variables for all secrets and sensitive config

---

## Future Improvements

- Password reset and email verification
- Real-time notifications and messaging
- Admin dashboard and moderation tools
- Payment integration and escrow
- Advanced analytics and reporting

---

## License

This project is for educational and demonstration purposes.

---

## 📢 Live Demo

- Frontend: [https://labour-marketplace.netlify.app/](https://labour-marketplace.netlify.app/)  
- Backend: [https://labour-marketplace.vercel.app/](https://labour-marketplace.vercel.app/)

---

*Built with ❤️ for the Bangladesh labor market community.*