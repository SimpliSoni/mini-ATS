# TalentFlow | Modern Applicant Tracking System

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://mini-ats-beige.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/github-SimpliSoni%2Fmini--ATS-blue.svg)](https://github.com/SimpliSoni/mini-ATS)

A production-ready Applicant Tracking System (ATS) built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas with Mongoose**.

Manage candidate pipelines end-to-end with interactive Triage, drag-and-drop Kanban, high-density Table views, real-time search and multi-filtering, candidate scorecards, and live hiring metrics.

- 🌐 **Live Demo**: [https://mini-ats-beige.vercel.app/](https://mini-ats-beige.vercel.app/)
- 🐙 **GitHub Repository**: [https://github.com/SimpliSoni/mini-ATS](https://github.com/SimpliSoni/mini-ATS)

---

## 🚀 Core ATS Features

### 1. Candidate Management
- **Complete Candidate Profiles**: Capture full candidate records including Name, Email, Phone, Target Role, Pipeline Stage, Skills tags, Resume URL, Experience in years, Rating (1–5 stars), and detailed Interview Notes.
- **Form Modal & Real-Time Validation**: Add candidates or edit existing profiles with field validation, format checks, and duplicate email safeguards (HTTP 409).
- **Candidate Slide-Over Sheet**: Clean profile drawer with contact details, resume links, skills chips, stage history, and interviewer notes.
- **Safe Candidate Deletion**: Protected deletion workflow with confirmation modal to prevent accidental data removal.

### 2. Hiring Stages Workflow
- **5 Pipeline Stages**: Seamlessly transition candidates through `Applied` → `Screening` → `Technical Interview` → `Offered` (or `Rejected`).
- **Tri-View Interface**:
  - **Triage Command Center**: Split view for rapid keyboard-driven candidate triage (`↑` / `↓` or `j` / `k`) and 1-click stage advancement.
  - **Kanban Board**: Column-based workflow with native drag-and-drop between stages.
  - **Table View**: High-density sortable list with inline stage transition dropdowns.
- **Optimistic UI Updates**: Immediate interface feedback on stage transitions with automatic rollback if network requests fail.

### 3. Multi-Criteria Search & Filtering
- **Debounced Global Search**: Instant, zero-latency searching across candidate name, email, and target role.
- **Multi-Filter Controls**: Filter simultaneously by pipeline stage and dynamic skills tags.
- **Multi-Column Sorting**: Sort candidates by application date, years of experience, interviewer rating, or alphabetical name in ascending/descending order.

### 4. Dashboard Metrics & Hiring Analytics
- **KPI Summary Cards**: Real-time totals for Total Candidates, Active Pipelines, Offers Extended, and Rejection Rate.
- **Interactive Stage Breakdown**: Visual segmented progress bar and clickable stage pills that double as instant view filters.
- **Talent Insights**: Computed metrics for Average Years of Experience and Top Open Roles by applicant volume.

### 5. Production Serverless Architecture
- **Mongoose Connection Pooling**: Serverless connection cache in `lib/db.ts` utilizing global connection reuse to prevent lambda cold-start timeouts.
- **Zero-Setup Local In-Memory Fallback**: Runs out of the box with an in-memory store if MongoDB credentials are omitted, and automatically switches to MongoDB Atlas once `MONGODB_URI` is provided.
- **Clean State**: Pure data-driven system with zero hardcoded mock or seed profiles.

---

## 🛠️ Tech Stack & Directory Blueprint

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

```
mini-ATS/
├── app/
│   ├── api/
│   │   ├── candidates/
│   │   │   ├── route.ts            # GET (search, filter, sort) & POST (create candidate)
│   │   │   └── [id]/
│   │   │       └── route.ts        # GET, PUT (update profile & stage), DELETE
│   │   └── metrics/
│   │       └── route.ts            # Aggregated pipeline metrics & KPI analytics
│   ├── globals.css                 # Color scheme, custom scrollbars & utilities
│   ├── layout.tsx                  # Root layout with fonts, metadata & notifications
│   └── page.tsx                    # Main ATS dashboard combining all views & state
├── components/
│   ├── Navbar.tsx                  # Brand header with global search & "+ Add Candidate"
│   ├── DashboardMetrics.tsx        # KPI cards, interactive stage distribution & insights
│   ├── FilterBar.tsx               # View mode switch (Triage/Kanban/Table), filters & sort
│   ├── CandidateTriage.tsx         # Fast keyboard-accessible candidate triage split view
│   ├── CandidateKanban.tsx         # Interactive drag-and-drop Kanban pipeline board
│   ├── CandidateTable.tsx          # High-density searchable table with quick stage actions
│   ├── CandidateModal.tsx          # Full-profile slide-over drawer with interview notes
│   ├── CandidateFormDialog.tsx     # Add / Edit candidate modal with validation & star rating
│   └── DeleteConfirmDialog.tsx     # Modal confirmation dialog for candidate deletion
├── lib/
│   ├── db.ts                       # Serverless Mongoose connection pooling & caching
│   ├── inMemoryStore.ts            # In-memory candidate store for local preview fallback
│   ├── types.ts                    # Candidate, metrics, and filter TypeScript interfaces
│   └── utils.ts                    # Class merging, stage color helpers & date formatters
├── models/
│   └── Candidate.ts                # Mongoose schema, model, and search indexes
├── .env.example                    # Environment variable template
└── package.json
```

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- **Node.js 18+** (recommended Node.js 20 or 22)
- **npm**, **yarn**, or **pnpm**

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/SimpliSoni/mini-ATS.git
cd mini-ATS
npm install
```

### 3. Configure Environment
Create your local environment file:
```bash
cp .env.example .env.local
```

Set your MongoDB Atlas connection string in `.env.local`:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini_ats?retryWrites=true&w=majority"
```

*(Note: If `MONGODB_URI` is omitted, the application runs in local preview mode with the in-memory store!)*

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure ATS: clean slate, manage candidates, hiring stages, search, and metrics"
   git push origin master
   ```
2. Import the project into [Vercel](https://vercel.com).
3. In **Project Settings** > **Environment Variables**, configure:
   - `MONGODB_URI`: your MongoDB Atlas connection string.
   - In MongoDB Atlas, verify **Network Access** allows `0.0.0.0/0` (any IP) so Vercel's serverless lambdas can connect.
4. Deploy! Your ATS will be live immediately.

---

## 🧪 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/candidates` | Fetch candidates with query params: `search`, `stage`, `skill`, `sortBy`, `sortOrder` |
| `POST` | `/api/candidates` | Create candidate (validates fields, prevents duplicate emails) |
| `GET` | `/api/candidates/:id` | Retrieve candidate by ID |
| `PUT` | `/api/candidates/:id` | Update candidate profile details or change pipeline stage |
| `DELETE` | `/api/candidates/:id` | Delete candidate by ID |
| `GET` | `/api/metrics` | Retrieve aggregated dashboard analytics & KPI counts |

---

## 📄 License
MIT License. Open source and available for recruitment workflows.
