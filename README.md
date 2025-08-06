#  Document Management System (DMS)

This project is a **full-stack Document Management System** designed to handle **user authentication**, **workspace management**, **document uploads**, **metadata handling**, **search functionality**, and **access control** using both **relational and NoSQL databases**.

---

##  Features Implemented

###  Authentication & Authorization (MySQL/PostgreSQL)
- User registration with email, password, national ID (NID), and personal info.
- Passwords hashed with `bcrypt`.
- Login with JWT-based authentication.
- Middleware to protect private routes.

###  Workspace Management (MongoDB)
- Users can create/update/delete workspaces (e.g., School, Internship).
- Each workspace is linked to users via their NID.

###  Document Management
- Upload documents via multi-part form data.
- Store metadata (name, type, tags, owner, createdAt).
- Retrieve documents by workspace.
- Soft delete documents (marked as deleted, not removed).
- Download documents with proper authentication.
- Preview documents as base64-encoded content.
- Restore and permanently delete documents.
- Search documents by name/type.
- Filter documents by tags, type, date range, owner.

###  Metadata & Tagging
- Update document name or tags.
- Retrieve metadata for specific documents.
- Support for tagging, filtering, and sorting.

---

## Technologies Used

- **Backend:** Node.js, Express.js
- **Databases:**  
  - PostgreSQL (Authentication)  
  -  MongoDB (Workspaces & Documents)
- **Authentication:** JWT
- **Security:** bcrypt, route protection
- **File Uploads:** multer (with future integration for cloud storage like AWS S3)

---

##  Project Structure (Important Files)

