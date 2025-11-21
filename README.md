# Frontend Developer Intern Assignment

A full-stack web application with authentication and dashboard features built with React.js and Node.js.

## 🚀 Features

- **User Authentication** (Register/Login/Logout with JWT)
- **Protected Routes** with authentication middleware
- **Task Management** (CRUD operations with search/filter)
- **User Profile** management
- **Responsive Design** with TailwindCSS
- **RESTful API** with Express.js
- **MongoDB** database integration
- **Password Hashing** with bcrypt
- **Form Validation** (client & server side)

## 🛠 Tech Stack

**Frontend:**
- React.js 18
- React Router v6
- TailwindCSS
- Context API for state management

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled
  
frontend-intern-app/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── styles/         # CSS files
│   └── package.json
├── backend/                 # Node.js/Express backend
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── middleware/         # Custom middleware
│   └── package.json
├── docs/                   # Documentation
└── README.md

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI to .env
npm start
