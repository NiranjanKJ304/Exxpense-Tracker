# 💰 Expense Tracker

A full-stack Expense Tracker web application that allows users to manage their personal spending. It provides secure authentication, full CRUD functionality for expenses, and insightful filters and summaries to monitor financial habits.

---

## 🚀 Features

- 🔐 **Authentication**
  - User registration with email and password
  - Secure login/logout system
  - Access restricted to logged-in users only

- 🧾 **Expense Management (CRUD)**
  - Add, edit, delete expenses
  - Expense fields include:
    - Title
    - Amount
    - Category (e.g., Food, Travel, Tools, etc.)
    - Type (Need / Want)
    - Date

- 📊 **Filtering & Summary**
  - Filter expenses by category or date range
  - View total amount spent
  - Summary by category and Need/Want type

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- dotenv
- CORS

---

## 📁 Project Structure

Expense Traker/
├── expense/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── tailwind.config.js

├── server/ # Node.js backend
│ ├── config/ # MongoDB connection
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── .env
│ └── server.js

└── README.md

#TO RUN
 
cd server
npm install
npm run dev

cd expense
npm install
npm run dev
