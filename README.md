# 📁 Document Management System (DMS)

A simple and secure Document Management System (DMS) built with **React** and **Node.js** that allows users to upload, store, manage, and share files with ease.

## 🧠 Features

- 🔐 **Authentication** – Secure login and registration system
- 📤 **File Upload** – Upload and store documents efficiently
- 🗂️ **Workspace Management** – Organize files into workspaces
- 👥 **User Roles** – Admin/user roles with different permissions
- 🔍 **Search & Filter** – Quickly find documents by name
- 🧾 **Download & Preview** – Preview documents and download them
- 🗑️ **Delete Files** – Remove unwanted files

## 🛠️ Tech Stack

### Frontend:
- React.js
- Axios
- React Router

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)

### Tools:
- JWT (Authentication)
- Multer (File upload middleware)
- Bcrypt (Password hashing)



## 📁 Folder Structure (High-Level)

Document-Management-System-DMS/
│
├── backend/ # Node.js + Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── ...
│
├── frontend/ # React frontend
│ ├── components/
│ ├── pages/
│ └── ...
│
└── README.md

shell
Copy
Edit

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/HagarOthman2002/Document-Management-System-DMS-.git
cd Document-Management-System-DMS-
2. Install Backend Dependencies
bash
Copy
Edit
cd backend
npm install
Create a .env file and add:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Run the backend:

bash
Copy
Edit
npm run dev
3. Install Frontend Dependencies
bash
Copy
Edit
cd ../frontend
npm install
Run the frontend:

bash
Copy
Edit
npm start
The app should now be running at http://localhost:3000.

🧪 Future Enhancements
Add file versioning

Role-based access control (RBAC)

Drag & drop file upload

Tagging and advanced filtering

Activity logs


