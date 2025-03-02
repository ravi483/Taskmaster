# TaskMaster - Task Management Application

TaskMaster is a full-stack task management application built with React (Vite), Node.js, and MongoDB. It features a modern, responsive UI with dark mode support .

## Features

### User Authentication
- Register/Login functionality
- JWT-based authentication with HTTP-only cookies
- Protected routes for authorized users

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete or incomplete
- Set task priorities (Low, Medium, High)
- Add due dates to tasks
- Drag and drop to reorder tasks

### UI/UX Enhancements
- Responsive design with Tailwind CSS
- Dark/Light theme toggle
- User-friendly loading states and error handling
- Task filtering options (All, Completed, Pending)

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- React Beautiful DND
- Tailwind CSS
- Lucide React (Icons)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt.js for password hashing

## Prerequisites

Ensure you have the following installed before running the project:
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Cloud Database)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/taskmaster.git
cd taskmaster
```

### 2. Install Dependencies
#### Install server dependencies:
```bash
cd backend
npm install
```
#### Install client dependencies:
```bash
cd ../frontend
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the **backend** directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/taskmaster

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### 4. Run the Application
#### Start the backend server:
```bash
cd backend
npm start
```
#### Start the frontend:
```bash
cd ../frontend
npm run dev
```
The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`.

## API Routes

### Authentication Routes
| Method | Endpoint          | Description          |
|--------|------------------|----------------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login a user        |
| GET    | /api/auth/me       | Get logged-in user  |

### Task Routes
| Method | Endpoint         | Description                   |
|--------|-----------------|-------------------------------|
| GET    | /api/tasks       | Get all tasks                 |
| POST   | /api/tasks       | Create a new task             |
| PUT    | /api/tasks/:id   | Update a task                 |
| DELETE | /api/tasks/:id   | Delete a task                 |

## Contribution
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is open-source and available under the MIT License.

---

Enjoy using TaskMaster! 🚀

