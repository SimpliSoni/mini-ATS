# TalentFlow | Production Applicant Tracking System

A production-ready Applicant Tracking System (ATS) application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas with Mongoose**.

Designed for high-throughput recruitment operations with drag-and-drop Kanban hiring workflows, candidate scorecards, debounced multi-filtering, analytics metrics, and serverless database pooling.

---

## 🚀 Key Features

### 1. Candidate Management
- **Full Candidate Profile**: Name, Email, Phone, Target Role, Pipeline Stage, Skills array, Resume URL, Experience in years, Rating (1-5 stars), and detailed Interview Notes.
- **Form Modal & Validation**: Add new candidates or edit existing profiles with real-time field validation and duplicate email safeguards.
- **Candidate Slide-Over Sheet**: Detailed drawer modal showing contact information, resume links, skills chips, complete interview notes, and pipeline progress stepper.
- **Safe Deletion**: Deletion with confirmation dialog to avoid accidental data loss.

### 2. Dual Pipeline Views & Instant Stage Transitions
- **Kanban Board View**: Column-based workflow (`Applied`, `Screening`, `Technical Interview`, `Offered`, `Rejected`) with HTML5 native drag-and-drop between stages.
- **Table List View**: High-density searchable table with sortable columns, rating stars, and instant stage dropdowns.
- **Quick Action Stage Selector**: Move candidates across stages with 1-click directly from cards, rows, or the candidate detail sheet with optimistic UI feedback.

### 3. Multi-Criteria Search, Filtering & Sorting
- **Debounced Global Search**: Instantly filter across candidate name, email, and target role with zero latency.
- **Multi-Filter Controls**: Filter by hiring stage and filter by dynamic skills chips.
- **Flexible Sorting**: Sort candidates by applied date, years of experience, rating, or alphabetical name.

### 4. Dashboard Metrics & Talent Insights
- **KPI Summary Cards**: Total Candidates, Active In Process, Offers Extended, and Rejection Rate benchmark.
- **Interactive Stage Breakdown**: Visual segmented progress bar and clickable stage pills that filter the view.
- **Talent Insights**: Average candidate experience and top open roles with candidate volume.

### 5. Production Serverless Architecture & Auto-Seeding
- **Vercel Cached Serverless Connection**: Mongoose connection pooling helper in `lib/db.ts` utilizing global cached connection patterns to eliminate lambda cold-start connection timeouts.
- **Auto-Seeder & Instant Reset**: Pre-seeds 18 realistic candidate profiles automatically if the collection is empty, ensuring an active dashboard immediately after deployment.
- **Zero-Setup Local Preview Mode**: Works out of the box with an in-memory fallback store if MongoDB Atlas credentials are not yet configured, and seamlessly connects to MongoDB Atlas once `MONGODB_URI` is provided.

---

## 🛠️ Tech Stack & Directory Blueprint

```
mini-ATS/
├── app/
│   ├── api/
│   │   ├── candidates/
│   │   │   ├── route.ts            # GET (search, filter, sort) & POST (create candidate)
│   │   │   └── [id]/
│   │   │       └── route.ts        # GET, PUT (update / stage change), DELETE
│   │   ├── metrics/
│   │   │   └── route.ts            # Aggregated pipeline metrics & KPI analytics
│   │   └── seed/
│   │       └── route.ts            # Re-seed & reset candidate dataset
│   ├── globals.css                 # Sleek styling, custom scrollbars & glassmorphism
│   ├── layout.tsx                  # Root layout with fonts, metadata & toast notifications
│   └── page.tsx                    # Main ATS dashboard combining all views & state
├── components/
│   ├── Navbar.tsx                  # Header with search & add candidate action
│   ├── DashboardMetrics.tsx        # KPI cards & visual stage breakdown
│   ├── CandidateKanban.tsx         # Column-based Kanban board with drag-and-drop
│   ├── CandidateTable.tsx          # Searchable, sortable list view with quick stage actions
│   ├── CandidateModal.tsx          # Full-profile slide-over drawer with notes & timeline
│   ├── CandidateFormDialog.tsx     # Creation & edit modal with validation & star rating
│   ├── DeleteConfirmDialog.tsx     # Modal confirmation dialog for candidate deletion
│   └── FilterBar.tsx               # View toggle, stage & skill filters, sorting controls
├── lib/
│   ├── db.ts                       # Serverless Mongoose connection pooling & caching
│   ├── inMemoryStore.ts            # Fallback mock store for instant local preview
│   ├── mockData.ts                 # 18 realistic pre-seeded candidate profiles
│   ├── seedHelper.ts               # Auto-seeder and database reset logic
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
- Node.js 18+ (tested on Node.js 20 & 22)
- npm or yarn

### 2. Installation
Clone or navigate to the project directory:
```bash
cd mini-ATS
npm install
```

### 3. Configure Environment (Optional)
To connect to your MongoDB Atlas cluster, create a `.env.local` file:
```bash
cp .env.example .env.local
```
Add your MongoDB Atlas connection string to `.env.local`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini_ats?retryWrites=true&w=majority
```
*(Note: If `MONGODB_URI` is omitted, the application runs in local preview mode with the pre-seeded candidates in memory!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. In **Project Settings** > **Environment Variables**, add:
   - `MONGODB_URI`: your MongoDB Atlas connection string.
   - In MongoDB Atlas, ensure **Network Access** allows `0.0.0.0/0` (any IP) so Vercel's serverless functions can connect.
4. Click **Deploy**.
5. Once deployed, the app will automatically seed the 18 candidate profiles into your MongoDB Atlas cluster on first visit!

---

## 🧪 Testing the API Endpoints

- `GET /api/candidates` — Fetch candidates with search, stage, skill, and sort query parameters
- `POST /api/candidates` — Create a new candidate (rejects duplicate emails)
- `GET /api/candidates/:id` — Retrieve candidate by ID
- `PUT /api/candidates/:id` — Update candidate fields or transition pipeline stage
- `DELETE /api/candidates/:id` — Delete candidate by ID
- `GET /api/metrics` — Retrieve aggregated dashboard analytics
- `POST /api/seed` — Reset and re-seed the candidate collection
