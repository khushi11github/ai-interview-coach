# APEXCOACH

APEXCOACH is a full-stack AI interview preparation workspace. It gives candidates a focused place to manage interview practice, analyze resumes, review performance, and run live interview sessions.

## Features

- Account creation and login
- Protected candidate workspace
- Dashboard for interview activity and progress
- Resume analyzer workflow
- Configurable interview sessions
- Live interview room and peer interviewer experience
- Interview reports with performance insights
- Responsive workspace layout for desktop and mobile screens

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Development:** Docker Compose, ESLint

## Project Structure

```text
.
├── backend/                 Express API and authentication
│   ├── controllers/         Request handlers
│   ├── middleware/          API middleware
│   ├── models/              Mongoose models
│   └── routes/              API routes
├── frontend/                React and TypeScript application
│   └── src/
│       ├── components/      Workspace and interview components
│       ├── pages/           Route-level screens
│       ├── services/        API client
│       └── utils/           Shared browser utilities
└── docker-compose.yml       Local frontend and backend services
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB, MongoDB Atlas, or Docker Desktop

## Run Locally

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

The AI features require an OpenAI API key on the backend. The key is never sent to the browser. Resume analysis uploads the file to the backend, extracts text from TXT, PDF, or DOCX files, and sends the extracted text to the configured OpenAI model. Interview reports send the completed question-and-answer list to the same backend service for structured scoring and feedback.

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser.

The frontend uses `http://localhost:5000/api` by default. To override it, set:

```env
VITE_API_URL=http://localhost:5000/api
```

## AI API Routes

| Route | Purpose |
| --- | --- |
| `POST /api/ai/resume/analyze` | Extract and semantically analyze a resume with the configured OpenAI model |
| `POST /api/ai/interview/evaluate` | Score interview answers and return per-question feedback |

## Run With Docker Compose

Add `backend/.env` with the MongoDB connection string, then run:

```bash
docker compose up --build
```

The application will be available at [http://localhost:5173](http://localhost:5173), and the API at [http://localhost:5000](http://localhost:5000).

## Available Routes

| Route | Purpose |
| --- | --- |
| `/signup` | Create an account |
| `/login` | Sign in |
| `/home` | Main candidate workspace |
| `/dashboard` | Progress and interview overview |
| `/resume-analyzer` | Analyze a resume |
| `/interview` | Configure and run an interview |

Workspace routes require a signed-in user.

## Scripts

### Frontend

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

### Backend

```bash
npm run dev       # Start the API with Nodemon
npm start         # Start the API with Node.js
```

## API Health Check

With the backend running, visit [http://localhost:5000](http://localhost:5000). A healthy server returns:

```json
{"message":"APEXCOACH API is running"}
```
