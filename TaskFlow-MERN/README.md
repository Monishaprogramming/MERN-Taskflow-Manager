# TaskFlow — MERN Task Manager

A responsive task management application built with MongoDB, Express.js, React.js, and Node.js. Users can create, edit, delete, search, and filter tasks, while a dashboard summarizes task progress.

## Features
- Create, read, update, and delete tasks (CRUD)
- Task title, description, priority, status, and due date
- Search tasks by title or description
- Filter by status and priority
- Dashboard summary cards
- Input validation and API error handling
- Responsive layout
- MongoDB persistence using Mongoose

## Technologies
- React + Vite
- Node.js + Express
- MongoDB Atlas or local MongoDB
- Mongoose
- CSS
- Kiro (recommended for the required AI-development workflow) or Code0

## Project structure
```text
TaskFlow-MERN/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
├── server/                 # Express REST API
│   ├── models/Task.js
│   ├── routes/tasks.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites
- Node.js 20 or later (LTS recommended)
- npm
- MongoDB Atlas account or a local MongoDB server
- Git
- Kiro or Code0 for the required AI-assisted development experience

## Setup and installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/taskflow-mern.git
cd taskflow-mern
```

### 2. Configure the backend
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and set `MONGODB_URI` and `PORT`.

Example:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/taskflow?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```
Replace the placeholders with your own MongoDB Atlas connection string. Do not commit `.env`.

Start the API:
```bash
npm run dev
```
The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 3. Configure the frontend
Open a second terminal:
```bash
cd client
npm install
```
Copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start React:
```bash
npm run dev
```
Open the local URL shown by Vite, usually `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks; optional `search`, `status`, `priority` query parameters |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check |

### Example task payload
```json
{
  "title": "Prepare project demo",
  "description": "Test the task manager before the interview",
  "priority": "High",
  "status": "In Progress",
  "dueDate": "2026-10-15"
}
```

## AI Development Tool (required by StartupMeu)
**Selected tool:** Kiro (choose this only if you actually use Kiro during development; otherwise change this section to Code0).

### AI Development Experience
I used the AI development tool as a coding assistant to plan the project structure, scaffold React UI components, create Express REST endpoints, and troubleshoot integration issues. I reviewed and tested the generated code, checked API responses, and made adjustments rather than accepting generated code blindly.

### Specific AI-assisted tasks
Update these bullets to reflect the tasks you actually completed with Kiro or Code0:
1. Planned the client/server folder structure and task schema.
2. Generated and refined the reusable React task form and task list components.
3. Created CRUD REST endpoints in Express and integrated Mongoose.
4. Debugged API requests, environment variable configuration, and validation errors.
5. Reviewed edge cases and improved responsive CSS and error states.

**Important:** StartupMeu may ask you to explain your AI usage. Only claim tasks you personally performed with the selected tool. Use its chat/history as evidence of your workflow.

## Testing checklist
- [ ] Backend connects successfully to MongoDB
- [ ] Health endpoint returns `{ "status": "ok" }`
- [ ] Create a task and refresh; it remains in the database
- [ ] Edit a task and confirm the changes persist
- [ ] Delete a task and confirm it disappears
- [ ] Search and filters work together
- [ ] Empty title is rejected
- [ ] Layout works on mobile and desktop
- [ ] No secrets or `.env` files are committed

## GitHub submission
Create a **public** repository named `taskflow-mern`, then:
```bash
git init
git add .
git commit -m "Build TaskFlow MERN task manager"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/taskflow-mern.git
git push -u origin main
```
Make sure `.env` is not tracked. Share the public repository URL with StartupMeu after testing.

## Future improvements
- User authentication
- Pagination
- Automated API tests
- Deployment to a hosting provider
