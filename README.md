# Employee Management System

A full-stack, responsive Employee Management web application designed for the Week 2 internship assignment. Built with **React (Vite)**, **Node.js / Express**, and **MongoDB / Mongoose**, featuring a clean, human-designed dashboard interface for managing corporate employee records.

---

## 📌 Project Overview & Features

- **Dashboard Header & Navigation:** Clean branding, responsive sidebar navigation, and quick-action controls.
- **Summary Statistics:** Real-time key metrics tracking total employee count and active departments.
- **Employee Directory Table:** Displays employee names with avatar initials, email addresses, department badges, designations, and quick action buttons.
- **Add Employee:** Modal form with strict validation for Full Name, Email, Department, and Designation.
- **Edit Employee:** Modal form allowing modifications to existing records with live database synchronization.
- **Delete Confirmation:** Protection against accidental deletions with an explicit confirmation dialog.
- **Search & Filtering:** Real-time search across names, emails, departments, and designations, alongside department and sort selectors.
- **Robust Error & State Handling:**
  - Client-side and server-side validation.
  - Duplicate email prevention (`409 Conflict` with clear user feedback).
  - Centralized Express error handler (`ValidationError`, `CastError`, `DuplicateKeyError`, `DatabaseConnectionError`).
  - Loading skeleton states and empty state views.
  - Toast notifications for success and error events.
  - Live MongoDB connection status indicator.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | JavaScript, clean modular components, fast HMR |
| **Styling** | Modern CSS | Restrained corporate palette, CSS variables, fully responsive |
| **Backend** | Node.js, Express.js | RESTful API architecture, centralized error handling |
| **Database** | MongoDB, Mongoose | Schema validation, unique indexing, timestamps |
| **API Client**| Axios | Configured with base URL and response interceptors |
| **Testing** | Node.js Test Runner, Supertest, MongoDB Memory Server | 12 automated integration tests |
| **Config** | `dotenv` | Environment variables for security |

---

## 📁 Folder Structure

```text
employee-management-system/
├── .gitignore                     # Git ignore rules (node_modules, .env, build artifacts)
├── package.json                   # Root scripts for starting and installing packages
├── README.md                      # Project documentation
├── screenshots/                   # Submission screenshots guide
│   └── README.md
├── server/                        # Backend Express & MongoDB application
│   ├── .env.example               # Template environment configuration
│   ├── .env                       # Local environment variables (ignored by git)
│   ├── package.json               # Backend dependencies and scripts
│   ├── src/
│   │   ├── app.js                 # Express app configuration & middleware
│   │   ├── server.js              # Server entry point & port listener
│   │   ├── config/
│   │   │   └── db.js              # Mongoose database connection logic
│   │   ├── controllers/
│   │   │   └── employeeController.js # CRUD business logic & stats
│   │   ├── middleware/
│   │   │   └── errorHandler.js    # Centralized error handler
│   │   ├── models/
│   │   │   └── Employee.js        # Mongoose Employee model schema & indices
│   │   ├── routes/
│   │   │   └── employeeRoutes.js  # REST API route definitions
│   │   └── scripts/
│   │       └── seed.js            # Optional database seed script
│   └── tests/
│       └── employee.test.js       # 12 automated API integration tests
└── client/                        # Frontend React + Vite application
    ├── index.html                 # HTML template with Google Fonts
    ├── package.json               # Frontend dependencies and scripts
    ├── vite.config.js             # Vite configuration with API proxy
    └── src/
        ├── main.jsx               # React DOM entry point
        ├── App.jsx                # Main application state & orchestration
        ├── index.css              # Custom responsive stylesheet & design system
        ├── components/
        │   ├── Header.jsx         # Header bar with refresh & Add Employee button
        │   ├── Sidebar.jsx        # Navigation sidebar & DB status indicator
        │   ├── StatsCards.jsx     # Summary cards for total employees & departments
        │   ├── SearchBar.jsx      # Search input, department dropdown & sorting
        │   ├── EmployeeTable.jsx  # Employee table, loading skeleton & empty states
        │   ├── EmployeeModal.jsx  # Add / Edit employee modal with validation
        │   ├── DeleteConfirmModal.jsx # Deletion confirmation dialog
        │   ├── Toast.jsx          # Success and error notifications
        │   └── DatabaseNotice.jsx # Banner guidance when MongoDB is disconnected
        └── services/
            └── api.js             # Axios API client & error formatter
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or higher (tested on Node.js v24)
- **npm**: v9.0.0 or higher
- **MongoDB**: Either a local MongoDB instance (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster

---

## 🚀 Installation & Setup Instructions

### 1. Clone or Open Project Folder
```bash
cd employee-management-system
```

### 2. Install Dependencies
You can install dependencies for both client and server at once using the root command:
```bash
npm run install:all
```
*Or install separately:*
```bash
cd server && npm install
cd ../client && npm install
```

---

## 🔐 Environment Variable Setup

The backend requires a `server/.env` file. A template is provided in `server/.env.example`.

Create or edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/employee_management
```

> **Security Note:** Never commit `server/.env` to source control. The provided `.gitignore` automatically prevents `.env` and `node_modules` from being committed.

### MongoDB Configuration Options:

#### Option A: Local MongoDB
1. Ensure the MongoDB service is running locally on port 27017:
   ```bash
   mongod
   ```
2. Set in `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/employee_management
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a Database User and allow network access (e.g. `0.0.0.0/0` for development).
3. Copy the connection string and paste it into `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/employee_management?retryWrites=true&w=majority
   ```

---

## 💻 How to Run the Application

Open two terminal windows:

### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```
*The Express API starts at `http://localhost:5000`.*

### Terminal 2: Start Frontend Application
```bash
cd client
npm run dev
```
*The React app starts at `http://localhost:3000` (or `http://localhost:5173`).*

Open `http://localhost:3000` in your web browser.

---

## 🧪 Optional: Seed Sample Employees

To quickly test the dashboard with realistic sample data across various departments (Engineering, Marketing, HR, Finance, Design, Operations):
```bash
cd server
npm run seed
```

---

## 📡 REST API Endpoint Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query / Body Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Check API health & MongoDB status | None | `200 OK`, `503 Service Unavailable` |
| `GET` | `/employees` | Retrieve all employees | `search`, `department`, `sort` (`newest`, `oldest`, `name_asc`, `name_desc`) | `200 OK`, `503` |
| `GET` | `/employees/:id` | Retrieve single employee by ID | `:id` (MongoDB ObjectId) | `200 OK`, `404 Not Found` |
| `POST` | `/employees` | Create a new employee record | JSON: `{ "name", "email", "department", "designation" }` | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PUT` | `/employees/:id` | Update an existing employee | JSON: `{ "name", "email", "department", "designation" }` | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/employees/:id` | Delete an employee record | `:id` (MongoDB ObjectId) | `200 OK`, `404 Not Found` |
| `GET` | `/employees/stats/summary`| Get counts & department distribution | None | `200 OK` |

### Sample JSON Request Body (POST / PUT):
```json
{
  "name": "Sarah Connor",
  "email": "sarah.connor@company.com",
  "department": "Engineering",
  "designation": "Senior Full Stack Engineer"
}
```

---

## 🧪 Testing Instructions

An automated test suite using `supertest` and an in-memory MongoDB server is included to verify all endpoints, database constraints, input validations, and error handling without affecting your local database.

Run the test suite:
```bash
cd server
npm test
```

### Verified Test Cases (12/12 Passing):
1. `GET /api/health` — returns server status and MongoDB readiness.
2. `GET /api/employees` — returns empty list initially.
3. `POST /api/employees` — creates employee with correct schema and timestamps.
4. `POST /api/employees` — validates required fields (name, email, department, designation).
5. `POST /api/employees` — validates email format against regular expression.
6. `POST /api/employees` — rejects duplicate emails with HTTP `409 Conflict`.
7. `GET /api/employees/:id` — returns single employee by ObjectId.
8. `GET /api/employees/:id` — returns `404 Not Found` for nonexistent ObjectId.
9. `PUT /api/employees/:id` — updates employee record and validates changes.
10. `DELETE /api/employees/:id` — deletes employee and verifies removal.
11. `GET /api/employees?search=xxx` — filters records across name and department fields.
12. `GET /api/employees/stats/summary` — calculates total employee and department metrics.

---

## 📷 Submission Screenshots

Refer to the [screenshots/README.md](screenshots/README.md) file for the list of required screenshots to capture for your assignment submission.
