# GapZero — Work Assignment & Development Plan

## 1. Team Responsibilities

| Team Member | Role | Responsibilities |
|---|---|---|
| Chhavi | Frontend Developer | Frontend Tasks 1–5 |
| Chetna | Frontend Developer | Frontend Tasks 6–10 |
| Jaideep | Backend Developer | Backend Tasks 1–5 |
| Naitik | Database & AI Developer | Database design, MongoDB integration, AI API integration, skill-gap analysis, roadmap generation, and interview evaluation |

Total frontend tasks: 10

Total backend tasks: 5

Database and AI work: 5 milestones

---

# 2. Frontend Tasks — Chhavi

Responsibility: Develop the user-facing interfaces using React.js, Vite, React Router, and CSS or Tailwind CSS.

## Task 1: Project Setup and Common Layout

Tasks:
- Initialize the React project using Vite.
- Configure React Router.
- Create the frontend folder structure.
- Create reusable components.
- Build a common navbar and footer.
- Create reusable buttons, input fields, and cards.
- Establish consistent styling conventions.

Deliverable: A working frontend foundation with reusable components and navigation.

## Task 2: Landing Page

Tasks:
- Create the GapZero landing page.
- Add a hero section explaining the platform.
- Display the main features.
- Add buttons for login and registration.
- Create sections explaining how GapZero works.
- Make the page responsive.

Deliverable: A responsive landing page introducing GapZero.

## Task 3: Login and Registration UI

Tasks:
- Create the login page.
- Create the registration page.
- Add input validation.
- Display loading indicators.
- Handle validation errors and API errors.
- Integrate the authentication APIs when available.

Deliverable: Functional login and registration interfaces connected to the authentication flow.

## Task 4: Career Goal Selection

Tasks:
- Create a career goal selection page.
- Add cards for:
  - First Job
  - Company Switch
  - Role Switch
  - Career Growth
  - Career Restart
- Add current role and target role fields.
- Allow users to select their target company when relevant.
- Validate required fields.

Deliverable: A working career goal selection interface.

## Task 5: User Profile Setup

Tasks:
- Create the profile setup page.
- Add education details.
- Add professional experience.
- Add current skills.
- Add the target role and target company.
- Create a resume upload component.
- Validate the profile form.
- Integrate the profile APIs.

Deliverable: A functional profile setup interface.

---

# 3. Frontend Tasks — Chetna

Responsibility: Develop the dashboard, skill-gap analysis, roadmap, mock interview, progress tracking, and job discovery interfaces.

## Task 6: Main Dashboard

Tasks:
- Create the main dashboard layout.
- Display the user's selected career goal.
- Display completed and pending tasks.
- Show roadmap completion percentage.
- Display recent assessment results.
- Add navigation to the platform's main features.
- Handle loading, empty, and error states.

Deliverable: A functional dashboard UI.

## Task 7: Skill Gap Analysis Page

Tasks:
- Display the user's current skills.
- Display the skills required for the target role.
- Highlight missing skills and weak areas.
- Categorize skills into:
  - DSA and Problem Solving
  - Development
  - Computer Science Fundamentals
  - System Design, where applicable
  - Communication and Interview Skills
- Display skill priorities.
- Show AI-generated recommendations.
- Handle loading and error states.

Deliverable: A skill-gap analysis interface displaying assessment results.

## Task 8: Personalized Roadmap Page

Tasks:
- Display the AI-generated roadmap.
- Organize tasks by day or week.
- Show task descriptions and estimated effort.
- Display task status:
  - Pending
  - In Progress
  - Completed
- Allow users to update task status.
- Display roadmap completion percentage.
- Connect the page to the roadmap APIs.

Deliverable: A personalized roadmap interface connected to the backend.

## Task 9: AI Interview Interface

Tasks:
- Create the mock interview page.
- Display interview questions.
- Provide an answer submission interface.
- Display the user's current interview progress.
- Show AI-generated feedback and scores.
- Display recommended improvements.
- Handle loading and error states.
- Connect the interface to the interview APIs.

Deliverable: An AI interview interface connected to the backend.

## Task 10: Progress Tracker and Job Pages

Tasks:

Progress Tracker:
- Display roadmap completion.
- Display completed and pending tasks.
- Show assessment history.
- Display mock interview performance.
- Add charts for progress visualization.
- Show improvements across skill categories.

Job Pages:
- Create a job listing page.
- Display job title, company, and location.
- Add filters for relevant job criteria.
- Display job details.
- Show skill-match indicators.
- Create an application tracking interface.

Deliverable: Progress tracking and job discovery interfaces.

---

# 4. Backend Tasks — Jaideep

Responsibility: Develop the Node.js and Express.js backend, REST APIs, application business logic, authentication, authorization, and integration.

## Task 1: Backend Setup and Authentication

Tasks:
- Initialize the Node.js project.
- Configure Express.js.
- Set up environment variables.
- Establish the backend folder structure.
- Configure middleware.
- Implement request validation.
- Implement centralized error handling.
- Implement authentication.
- Add protected routes and authorization middleware.
- Coordinate authentication with the database layer.

Suggested API routes:

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

Deliverable: A working backend foundation with secure authentication and protected routes.

## Task 2: User Profile and Career Goal APIs

Tasks:
- Implement profile creation.
- Implement profile retrieval.
- Implement profile updates.
- Save education, experience, and skills.
- Store current and target career goals.
- Support the five career goal types.
- Validate incoming requests.
- Enforce user-specific data access.

Suggested API routes:

GET /api/profile

PUT /api/profile

POST /api/career-goals

GET /api/career-goals

Deliverable: Functional profile and career goal APIs.

## Task 3: Skill Gap and Roadmap APIs

Tasks:
- Implement skill-gap analysis endpoints.
- Retrieve skill-gap reports.
- Implement roadmap generation endpoints.
- Retrieve personalized roadmaps.
- Support roadmap task status updates.
- Validate task ownership.
- Integrate the AI service and database layer through agreed interfaces.

Suggested API routes:

POST /api/skill-gaps/analyze

GET /api/skill-gaps

POST /api/roadmaps/generate

GET /api/roadmaps

PATCH /api/roadmaps/tasks/:taskId

Deliverable: Functional skill-gap and roadmap API layer.

Dependency: Coordinate with Naitik on database schemas, AI service interfaces, and request/response formats.

## Task 4: Interview and Assessment APIs

Tasks:
- Create interview sessions.
- Retrieve interview questions through the agreed AI service.
- Accept submitted answers.
- Store interview responses and assessment results.
- Retrieve interview history.
- Return structured feedback.
- Validate session ownership.
- Handle AI service failures.

Suggested API routes:

POST /api/interviews

POST /api/interviews/:interviewId/answers

GET /api/interviews/history

GET /api/assessments

Deliverable: Backend APIs supporting AI interviews and assessments.

Dependency: Coordinate with Naitik on question generation, answer evaluation, scoring, and feedback formats.

## Task 5: Job APIs and Full Integration

Tasks:
- Implement job listing endpoints.
- Implement job detail endpoints.
- Support filtering by role and other relevant criteria.
- Implement job recommendations based on skills.
- Implement application tracking.
- Integrate frontend, backend, database, and AI services.
- Test APIs and authorization.
- Fix integration issues.
- Prepare the backend for deployment.

Suggested API routes:

GET /api/jobs

GET /api/jobs/:jobId

GET /api/jobs/recommended

POST /api/applications

Deliverable: Integrated backend supporting job discovery and application tracking.

Dependency: Job listings require an approved external job feed, permitted API, or curated data source.

---

# 5. Database and AI Tasks — Naitik

Responsibility: Design the MongoDB database, implement Mongoose schemas, integrate the AI provider, and support AI-driven assessments, skill-gap analysis, roadmap generation, and interview evaluation.

## Task 1: Database Setup

Tasks:
- Configure MongoDB Atlas.
- Create the database connection.
- Configure Mongoose.
- Define initial schemas.
- Add schema validation.
- Create indexes where appropriate.

Initial collections:

- users
- profiles
- careerGoals
- skillAssessments
- skillGaps
- roadmaps
- interviews
- interviewAnswers
- jobs
- applications

Deliverable: A working MongoDB database with initial schemas.

## Task 2: Data Models and Validation

Tasks:
- Define the relationships between collections.
- Define user ownership for user-specific data.
- Create a consistent skill taxonomy.
- Store target-role requirements.
- Store assessment questions and answers.
- Store skill-gap reports.
- Store roadmap tasks and completion states.
- Store interview scores and feedback.
- Add appropriate validation and indexes.
- Coordinate schema contracts with Jaideep.

Deliverable: A consistent data model supporting the core application workflow.

## Task 3: AI API Integration

Tasks:
- Select and configure the LLM provider.
- Obtain and configure the API key.
- Store credentials securely in server-side environment variables.
- Create reusable AI service functions.
- Define structured prompts.
- Validate AI-generated responses.
- Handle timeouts, API errors, rate limits, and invalid responses.
- Coordinate the service interface with Jaideep.

Deliverable: A reusable AI integration layer accessible through the backend.

Security requirements:
- Never expose AI API keys in frontend code.
- Never commit API keys or `.env` files to GitHub.
- Validate AI output before using it in application logic.
- Apply appropriate request limits and error handling.

## Task 4: Skill Gap and Roadmap Generation

Tasks:
- Implement AI-assisted skill-gap analysis.
- Compare current assessment results with target-role requirements.
- Identify missing and weak skills.
- Assign priorities to skill gaps.
- Generate personalized daily and weekly roadmaps.
- Include task descriptions and estimated effort.
- Define completion criteria for roadmap tasks.
- Validate generated output against the expected schema.
- Save reports and roadmaps in MongoDB.

Deliverable: AI-powered skill-gap reports and personalized roadmaps.

## Task 5: AI Interview Evaluation and Integration

Tasks:
- Generate role-specific interview questions.
- Support DSA, technical, project-based, and behavioral interviews as appropriate.
- Evaluate user answers using a defined scoring rubric.
- Generate actionable feedback.
- Recommend areas for improvement.
- Save interview sessions, responses, and results.
- Connect AI services to Jaideep's backend APIs.
- Test AI responses with sample users and assessment data.

Deliverable: An integrated AI interview and evaluation service.

Important ownership boundary:

Naitik owns database design, database integration, and AI service implementation.

Jaideep owns Express routes, controllers, application business logic, authentication, authorization, and API integration.

Both must agree on schemas and service contracts before integrating their work.

---

# 6. Complete Application Workflow

The platform will follow this sequence:

1. User registers or logs in.
2. User selects a career goal.
3. User completes their profile.
4. User uploads a resume or provides profile information.
5. The system conducts an initial AI assessment.
6. The system identifies skill gaps.
7. The AI generates a personalized roadmap.
8. The user completes tasks and tracks progress.
9. The AI conducts mock interviews at regular stages.
10. The system updates assessments and recommends improvements.
11. The user receives a job-readiness assessment.
12. The platform recommends relevant jobs and supports application tracking.

Core workflow:

Career Goal → Profile and Resume → AI Assessment → Skill Gap Analysis → Personalized Roadmap → Progress Tracking → Mock Interviews → Job Readiness → Job Matching

---

# 7. Integration Plan

## Phase 1: Foundation

Chhavi:
- Set up React and Vite.
- Create common components and navigation.

Chetna:
- Prepare dashboard wireframes.
- Plan the component structure for roadmap and progress pages.

Jaideep:
- Initialize Express.js.
- Set up authentication and middleware.

Naitik:
- Configure MongoDB Atlas.
- Create the initial database schemas.

## Phase 2: Profile and Career Goals

Chhavi:
- Build landing, login, registration, career goal, and profile pages.

Chetna:
- Prepare the dashboard and skill-gap interfaces.

Jaideep:
- Implement profile and career goal APIs.

Naitik:
- Complete profile and career goal data models.

## Phase 3: AI and Roadmaps

Chhavi:
- Finish profile and career goal integration.

Chetna:
- Build the skill-gap and roadmap pages.

Jaideep:
- Implement skill-gap and roadmap API endpoints.

Naitik:
- Implement AI integration and roadmap generation.

## Phase 4: Interviews and Progress

Chhavi:
- Fix any remaining authentication and profile integration issues.

Chetna:
- Build the mock interview and progress tracking interfaces.

Jaideep:
- Implement interview and assessment APIs.

Naitik:
- Implement question generation, evaluation, and feedback.

## Phase 5: Jobs and Final Integration

Chhavi:
- Fix landing page, authentication, and profile issues.

Chetna:
- Complete job discovery and application tracking interfaces.

Jaideep:
- Implement job APIs and integrate all services.

Naitik:
- Verify AI service behavior and database persistence.

All members:
- Test the complete user journey.
- Fix integration bugs.
- Review code.
- Prepare for deployment.

---

# 8. Suggested Project Structure

```text
gapzero/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── app.js
│   ├── tests/
│   └── server.js
│
├── .gitignore
└── README.md
```

Folder responsibilities:

- `components/`: Reusable frontend components.
- `pages/`: Application screens.
- `services/`: Frontend API calls.
- `controllers/`: Backend request handling.
- `routes/`: Express route definitions.
- `models/`: Mongoose schemas.
- `middleware/`: Authentication, validation, and error handling.
- `services/`: AI integration and application business logic.

Keep AI provider logic in a dedicated backend service module instead of placing it directly inside controllers.

---

# 9. Git and Team Collaboration Rules

## Branch Naming

Examples:

```text
feature/chhavi-landing-page
feature/chhavi-profile-setup
feature/chetna-dashboard
feature/chetna-roadmap
feature/jaideep-auth-api
feature/jaideep-roadmap-api
feature/naitik-database
feature/naitik-ai-service
```

## Development Rules

1. Pull the latest changes before starting work.
2. Never commit directly to the main branch.
3. Keep commits small and descriptive.
4. Create pull requests for completed tasks.
5. Test changes before requesting review.
6. Do not commit `.env` files or API keys.
7. Communicate API or schema changes before implementing them.
8. Resolve merge conflicts with the team.
9. Use consistent naming conventions.
10. Test integration before marking a feature as complete.

## Suggested Commit Messages

```text
feat: add landing page
feat: implement career goal selection
feat: add profile APIs
feat: integrate AI assessment service
fix: handle roadmap API errors
test: add interview API tests
```

---

# 10. Definition of Done

A task is considered complete only when:

- The feature works as intended.
- Input validation is implemented where needed.
- Loading, empty, and error states are handled.
- API contracts match the agreed specifications.
- User-specific data is protected.
- Changes are committed to the correct branch.
- A pull request is reviewed and merged.
- The feature has been tested locally.

For AI features, also verify that model responses follow the expected structure and that failures do not corrupt saved data.

---

# 11. Final Goal

Our goal is to build a platform that helps users understand their current capabilities, identify the skills they need, follow a personalized roadmap, and improve their interview readiness.

GapZero will combine career planning, AI interviews, skill-gap analysis, personalized roadmaps, progress tracking, and job discovery into one integrated platform.

GapZero — From Skill Gaps to Career Growth.
