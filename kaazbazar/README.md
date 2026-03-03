# 🛒 KaazBazar - Full Stack Service Marketplace

Complete service worker marketplace for Bangladesh with React frontend, Node.js backend, MongoDB database, and admin panel.

## 📁 Project Structure

```
kaazbazar/
├── backend/          # Node.js + Express API
├── frontend/         # React Customer App (Port 3000)
├── admin/            # React Admin Panel (Port 3001)
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Create .env file:
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

### 3. Admin Panel Setup

```bash
cd admin
npm install
# Create .env file:
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

---

## 📦 Deployment on Vercel

### Backend (as serverless or separate service)
Deploy backend to Railway, Render, or Heroku:
- Set all environment variables from `.env.example`
- Set `FRONTEND_URL` to your Vercel frontend URL

### Frontend (Vercel)
```bash
cd frontend
# Set REACT_APP_API_URL to your backend URL
vercel deploy
```

### Admin (Vercel separate project)
```bash
cd admin
# Set REACT_APP_API_URL to your backend URL
vercel deploy
```

---

## 🔑 Environment Variables (Backend)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (MongoDB Atlas) |
| `JWT_SECRET` | Random secret for JWT tokens |
| `CLOUDINARY_*` | Cloudinary credentials for image upload |
| `EMAIL_*` | SMTP settings for email notifications |
| `FRONTEND_URL` | Frontend URL for CORS |

---

## 👤 Create Admin User

Run this in MongoDB (or use MongoDB Compass):

```javascript
// After installing bcryptjs, hash "admin123" and insert:
db.users.insertOne({
  name: "Admin",
  email: "admin@kaazbazar.com",
  password: "$2a$12...", // bcrypt hash of your password
  role: "admin",
  isActive: true,
  isVerified: true,
  createdAt: new Date()
})
```

Or use the seed script:
```bash
cd backend
node seed.js
```

---

## ✨ Features

### Customer App
- 🔍 Search workers by category & district (64 districts)
- 👤 Worker profiles with ratings & reviews
- 📋 Online booking with scheduling
- 💳 Multiple payment methods (Cash, bKash, Nagad, Rocket)
- 📊 Customer dashboard with booking management
- 🔐 JWT authentication

### Admin Panel
- 📊 Dashboard with live statistics
- 👥 User management (activate/suspend)
- 🔧 Worker management (verify, feature, remove)
- 📋 Booking management with status tracking
- 📨 Contact message inbox

### Backend API
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Rate limiting & security headers
- File upload with Cloudinary

---

## 📱 Mobile App Ready

The React frontend is fully responsive and mobile-friendly. For a native mobile app:
- Use **React Native** with the same backend API
- API endpoints are already CORS-configured

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Admin | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend/admin), Railway/Render (backend) |
