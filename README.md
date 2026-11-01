# GapZero — Your AI-Powered Career Growth Coach

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Anthropic Claude](https://img.shields.io/badge/Anthropic-Claude%203.5-purple.svg)](https://www.anthropic.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

**GapZero** is a modern, production-ready AI-powered career intelligence and growth coaching platform. Designed for students, fresh graduates, and working professionals, GapZero uncovers technical skill gaps, optimizes resumes for applicant tracking systems (ATS), analyzes GitHub portfolios, provides verified salary insights, and charts personalized 30-day, 90-day, and 12-month roadmaps to dream roles.

---

## 🚀 Key Modules & Capabilities

1. **AI Resume Analyzer**
   - High-fidelity in-memory PDF & Word (.docx) document parsing.
   - Rejects scanned image-only PDFs gracefully with actionable OCR guidance.
   - Extracts structured work history, education, certifications, and technical proficiencies.
   - Evaluates overall profile readiness, career fit percentage, and ATS format readability with evidence-backed rationales.

2. **Career Fit & Skill Gap Detection**
   - Compares candidate proficiencies against standard industry benchmarks for the target role.
   - Categorizes gaps by severity (**Critical**, **Moderate**, **Minor**) and domain (**Technical**, **Domain Knowledge**, **Tools & Frameworks**, **Soft Skills**).
   - Estimates realistic study hours required to bridge each gap and recommends verified learning resources and capstone projects.

3. **ATS Resume Optimizer**
   - Simulates applicant tracking system keyword density against target titles or pasted employer job descriptions.
   - Transforms passive bullets into high-impact **Google X-Y-Z achievement statements** (*"Accomplished [X] as measured by [Y], by doing [Z]"*).
   - Generates tailored professional summaries and formatted skills lists ready to copy to clipboard.

4. **Personalized 3-Phase Career Roadmap**
   - **30-Day Plan:** Quick wins, fundamental skill acquisition, and ATS keyword revamp.
   - **90-Day Plan:** Full-stack capstone projects, algorithmic interview preparation, and personal branding.
   - **12-Month Plan:** Advanced system architecture, scalability, networking, and targeted job application campaigns.
   - Interactive milestone checklist with celebration animations and progress tracking.

5. **AI Career Coach**
   - Dedicated conversational mentor powered by Anthropic Claude 3.5 Sonnet.
   - Maintains continuous context of the candidate's verified skills, missing gaps, target companies, and roadmap progress.
   - Assists with mock technical interview questions, architecture trade-offs, and behavioral framing.

6. **Job Description Matcher**
   - Paste any live job posting (from LinkedIn, Indeed, or career portals).
   - Evaluates requirement alignment, flags missing qualifications, and provides specific resume tailoring suggestions.
   - Saves job match history for tracking applications.

7. **GitHub Portfolio Analyzer**
   - Audits public GitHub profiles using the official GitHub REST API.
   - Observes repository diversity, primary programming languages, and README quality.
   - Flags missing documentation and suggests next capstone repositories aligned with hiring manager expectations.

8. **LinkedIn Profile Optimizer**
   - Generates three distinct headline variations (Value-driven, Role-focused, Tech-specialist).
   - Crafts a narrative, storytelling About section.
   - Highlights high-volume recruiter search keywords.

9. **Verified Salary Benchmarks**
   - Base salary distributions grounded in official data sources (**U.S. Bureau of Labor Statistics OEWS**, **UK Office for National Statistics**, and verified industry surveys).
   - Filterable across 5 countries (**United States**, **United Kingdom**, **Canada**, **India**, **Germany**) and 4 experience levels.
   - Full disclosure of survey release dates, statistical confidence levels, and industry sector multipliers.

10. **Data Privacy & Row Level Security (RLS)**
    - All user records in PostgreSQL are isolated by Supabase Row Level Security (`auth.uid() = user_id`).
    - Resumes are processed in temporary memory and never sold or used for model training.
    - One-click permanent account and data deletion from the Settings panel.

---

## 🛠️ Tech Stack Architecture

```
gapzero/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI (Buttons, Cards, ScoreGauge, etc.)
│   │   ├── context/            # AuthContext & persistent sessions
│   │   ├── lib/                # API client wrapper
│   │   ├── pages/              # 12 application pages & landing view
│   │   └── types/              # Client TypeScript interfaces
│   └── vite.config.ts          # Vite bundler with API proxy
├── server/                     # Backend REST API
│   ├── src/
│   │   ├── config/             # Environment validation
│   │   ├── controllers/        # REST route controllers
│   │   ├── db/                 # Supabase client & in-memory dev fallback
│   │   ├── middleware/         # Auth, helmet, rate limiting, error handling
│   │   ├── services/
│   │   │   ├── ai/             # Anthropic Claude & Zod structured schemas
│   │   │   ├── fileParser.ts   # PDF & DOCX text extraction
│   │   │   ├── githubService.ts# Public GitHub API client
│   │   │   └── salaryService.ts# Bureau benchmark datasets
│   │   └── index.ts            # Express server entry point
│   └── tsconfig.json
├── shared/                     # Canonical shared types
└── supabase/
    └── migrations/             # Full PostgreSQL schema with RLS policies
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install all dependencies across workspaces:
```bash
git clone https://github.com/jaideepgoyal551/gapzero.git
cd gapzero
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default / Required |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | Optional for dev (uses intelligent simulation if omitted) |
| `SUPABASE_URL` | Supabase project URL | Optional for dev (uses local isolated storage if omitted) |
| `SUPABASE_ANON_KEY` | Supabase Anon Key | Optional |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | Optional |
| `GITHUB_TOKEN` | GitHub Personal Access Token | Optional (increases rate limit for GitHub audits) |
| `JWT_SECRET` | Secret for session signing | Preconfigured for local development |

### 4. Running the Development Server
Run frontend (Vite) and backend (Express) concurrently:
```bash
npm run dev
```
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 🧪 Testing

Run the automated backend test suite (testing health, profile, resume extraction, AI schema validation, roadmaps, and salary services):
```bash
npm run test
```

Build both client and server to verify production readiness:
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase)

To link GapZero to your own Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Paste and run the migration script located at:
   `supabase/migrations/001_initial_schema.sql`
4. Copy your **Project URL** and **API Keys** into your `.env` file:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   ```
5. Row Level Security (RLS) is automatically enabled for all user tables.

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Add the environment variable `VITE_API_URL` pointing to your deployed backend URL.

### Backend (Render / Railway)
1. Deploy the `server` directory as a Node.js web service.
2. Build command: `npm run build --workspace=server`
3. Start command: `npm run start --workspace=server`
4. Set `ANTHROPIC_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` in your hosting dashboard environment settings.

---

## 📄 License
This project is licensed under the MIT License.
