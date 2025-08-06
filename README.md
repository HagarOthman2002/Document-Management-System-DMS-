#  Document Management System (DMS)

This project is a **full-stack Document Management System** built using **Node.js**, **Express**, **React**, **PostgreSQL**, and **MongoDB**. It provides secure user authentication, flexible workspace management, document uploads, metadata handling, soft deletion, document previews, and search/filter functionality.

---

##  Features Implemented

###  Authentication & Authorization (PostgreSQL)
- Register users with email, password, national ID (NID), and personal info.
- Secure password hashing with `bcrypt`.
- JWT-based login and token authentication.
- Protected routes using middleware.

###  Workspace Management (MongoDB)
- Users can create/update/delete workspaces (e.g., School, Internship).
- Workspaces are tied to user accounts via the National ID (NID).

###  Document Management
- Upload documents via multi-part form data.
- Store and manage metadata: name, type, tags, owner, timestamps.
- Download files securely.
- Soft delete, restore, or permanently delete documents.
- Preview files as base64 strings.
- Search by name/type and filter by tags, dates, owner.

###  Metadata & Tagging
- Update document name or tags.
- Filter and sort documents by tags, type, date range, etc.

---

##  Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** React.js, Vite
- **Databases:**
  - PostgreSQL (User authentication) – via Prisma ORM
  - MongoDB (Documents and workspaces)
- **Authentication:** JWT
- **Security:** bcrypt
- **File Uploads:** multer
- **Base64 Encoding:** File preview
- **ORM:** Prisma for PostgreSQL

---

##  Project Structure

project-root/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── middleware/
│ ├── uploads/
│ ├── config/
│ ├── app.ts
│ ├── server.ts
│ └── .env
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── public/
│ ├── vite.config.js
│ └── package.json
├── .gitignore
└── package.json

yaml
Copy
Edit

---

##  How to Install the Project

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/document-management-system.git
cd document-management-system
2. Install Dependencies
Backend
bash
Copy
Edit
cd backend
npm install
Frontend
bash
Copy
Edit
cd ../frontend
npm install
3. Environment Variables Setup
🔸 MongoDB (NoSQL)
Set up your MongoDB database:

bash
Copy
Edit
mongodb://localhost:27017/DMS
🔹 PostgreSQL (Relational DB)
Example DATABASE_URL for PostgreSQL:

bash
Copy
Edit
postgresql://postgres:root123@localhost:5432/users
.env File (inside /backend)
ini
Copy
Edit
ACCESS_TOKEN_SECRET=your_jwt_secret
PORT=8000
DataBase=mongodb://localhost:27017/DMS
DATABASE_URL=postgresql://postgres:root123@localhost:5432/users
 Note: Never expose actual credentials in public repositories. Use .env to store secrets.

 How to Run the Project
1. Run the Backend
bash
Copy
Edit
cd backend
npm start
2. Run the Frontend
bash
Copy
Edit
cd frontend
npm run dev
 Database Overview
 PostgreSQL – Users Table (via Prisma)
Column	Type	Description
id	Int	Primary Key (Auto increment)
name	String	Full name
email	String	Unique user email
password	String	Hashed password
nid	String	National ID (NID)
createdAt	DateTime	Account creation date

 MongoDB Collections
 workspaces
json
Copy
Edit
{
  _id: ObjectId,
  name: "Internship",
  description: "Summer internship docs",
  ownerNid: "29876543210123",
  createdAt: ISODate
}
 documents
json
Copy
Edit
{
  _id: ObjectId,
  name: "cv.pdf",
  type: "pdf",
  owner: "user@example.com",
  workSpaceId: ObjectId,
  tags: ["cv", "profile"],
  filePath: "uploads/cv.pdf",
  deleted: false,
  createdAt: ISODate,
  deletedAt: null
}
