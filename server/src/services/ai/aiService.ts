import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { config } from '../../config/env';
import {
  ResumeAnalysisSchema,
  SkillGapReportSchema,
  ATSOptimizationSchema,
  CareerRoadmapSchema,
  LinkedInOptimizationSchema,
  JobMatchSchema,
} from './schemas';

export interface LLMProvider {
  name: string;
  generateJSON<T>(systemPrompt: string, userPrompt: string, schema: z.ZodSchema<T>): Promise<T>;
  generateText(systemPrompt: string, userPrompt: string, conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string>;
}

export class AnthropicProvider implements LLMProvider {
  name = 'Anthropic Claude';
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generateJSON<T>(systemPrompt: string, userPrompt: string, schema: z.ZodSchema<T>): Promise<T> {
    let retries = 2;
    let lastError: any = null;

    while (retries >= 0) {
      try {
        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: 4096,
          temperature: 0.2,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        });

        const textBlock = response.content.find(b => b.type === 'text');
        if (!textBlock || textBlock.type !== 'text') {
          throw new Error('No text block returned by Claude.');
        }

        const rawText = textBlock.text.trim();
        const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('Claude response did not contain a valid JSON block.');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const validated = schema.parse(parsed);
        return validated;
      } catch (err: any) {
        lastError = err;
        console.warn(`[AnthropicProvider] Attempt failed (${retries} retries left):`, err.message);
        retries--;
        if (retries >= 0) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    throw new Error(`Anthropic AI Generation Failed: ${lastError?.message || 'Unknown error'}`);
  }

  async generateText(
    systemPrompt: string, 
    userPrompt: string, 
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    try {
      const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
        ...conversationHistory,
        { role: 'user', content: userPrompt },
      ];

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1500,
        temperature: 0.7,
        system: systemPrompt,
        messages,
      });

      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock && textBlock.type === 'text' ? textBlock.text : '';
    } catch (err: any) {
      console.error('[AnthropicProvider] Text generation error:', err);
      throw new Error(`AI Coach response failed: ${err.message}`);
    }
  }
}

/**
 * High-fidelity fallback / development provider that crafts realistic, role-adaptive
 * career responses adhering strictly to schemas when an API key is not configured.
 */
export class FallbackProvider implements LLMProvider {
  name = 'GapZero Intelligent Simulation';

  async generateJSON<T>(systemPrompt: string, userPrompt: string, schema: z.ZodSchema<T>): Promise<T> {
    const isResume = (schema as any) === (ResumeAnalysisSchema as any);
    const isSkillGap = (schema as any) === (SkillGapReportSchema as any);
    const isATS = (schema as any) === (ATSOptimizationSchema as any);
    const isRoadmap = (schema as any) === (CareerRoadmapSchema as any);
    const isLinkedIn = (schema as any) === (LinkedInOptimizationSchema as any);
    const isJobMatch = (schema as any) === (JobMatchSchema as any);

    const roleMatch = userPrompt.match(/Target Role:\s*([^\n\r<]+)/i) || userPrompt.match(/Target Job Title:\s*([^\n\r<]+)/i);
    const targetRole = roleMatch ? roleMatch[1].trim() : 'Full-Stack Software Engineer';

    let mockData: any = {};

    if (isResume) {
      mockData = {
        overall_score: 78,
        career_fit_score: 74,
        ats_score: 82,
        extracted_data: {
          summary: 'Motivated software engineer with foundational experience in frontend architectures and modern JavaScript ecosystems.',
          education: [
            {
              institution: 'State University of Technology',
              degree: "Bachelor of Science in Computer Science",
              field_of_study: 'Computer Science',
              graduation_year: '2023',
            },
          ],
          technical_skills: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Git', 'REST APIs', 'Node.js Basics'],
          soft_skills: ['Problem Solving', 'Team Collaboration', 'Agile Methodologies', 'Code Review'],
          work_experience: [
            {
              title: 'Junior Frontend Developer',
              company: 'Apex Tech Solutions',
              duration: 'June 2023 - Present',
              highlights: [
                'Developed accessible React components reducing UI render latency by 18%.',
                'Integrated RESTful backend microservices for automated user telemetry.',
                'Collaborated with product designers in weekly sprint retrospectives.'
              ],
            },
          ],
          projects: [
            {
              name: 'Realtime Task Canvas',
              description: 'Collaborative task planner with drag-and-drop workspace and WebSocket sync.',
              technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Tailwind CSS'],
              link: 'https://github.com/example/task-canvas',
            },
          ],
          certifications: ['Meta Front-End Developer Professional Certificate'],
          achievements: ['Dean\'s List for Academic Excellence (2022, 2023)'],
        },
        strongest_skills: ['Modern React', 'TypeScript', 'Responsive UI Design', 'Version Control / Git'],
        missing_skills: ['Microservices Architecture', 'PostgreSQL / SQL Performance', 'Docker & Containerization', 'System Design & Scalability'],
        important_weaknesses: [
          'Limited documented experience with backend database query optimization and relational indexing.',
          'Few quantified business metrics in work experience bullet points.',
          'Absence of CI/CD pipeline automation examples in listed projects.'
        ],
        experience_relevance: {
          score: 72,
          explanation: `Demonstrates solid frontend development fundamentals for a ${targetRole}, but needs greater evidence of backend and data modeling ownership.`,
        },
        project_relevance: {
          score: 76,
          explanation: 'Projects effectively show client-side state handling and UI polish, but would benefit from full-stack deployment and integration tests.',
        },
        recommended_improvements: [
          'Add concrete metrics to your experience bullets (e.g., latency reduction, user adoption, test coverage percentages).',
          'Build and deploy a full-stack project demonstrating relational database indexing and containerized deployment.',
          'Explicitly highlight automated testing frameworks (Jest, Vitest, Cypress) in your technical skills section.',
        ],
        suggested_next_steps: [
          'Follow the GapZero 30-day roadmap to optimize your ATS resume keywords.',
          'Complete a capstone backend system design project with PostgreSQL and Docker.',
          'Practice system architecture mock interviews using the AI Career Coach.',
        ],
        scoring_rationale: {
          overall_explanation: 'Strong foundational profile with clean structure and verified core competencies. Lacks advanced distributed systems and database metrics.',
          fit_explanation: `Shows 74% alignment with standard mid-level ${targetRole} requirements. Core technical gaps center around backend architecture and deployment.`,
          ats_explanation: 'High formatting readability with clear section headers, standard typography, and clean keyword density.',
        },
      };
    } else if (isSkillGap) {
      mockData = {
        overall_fit_score: 72,
        skills: [
          {
            skill: 'TypeScript & JavaScript',
            category: 'Technical',
            importance: 'Critical',
            current_proficiency: 'Intermediate',
            required_proficiency: 'Advanced',
            gap_severity: 'Moderate',
            reason: 'Essential language requirement for modern scalable full-stack development.',
            recommendation: 'Master generic constraints, discriminated unions, and compiler tuning.',
            estimated_hours: 24,
            learning_resources: [
              { title: 'TypeScript Official Handbook: Advanced Types', url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html', type: 'Documentation' },
              { title: 'Type-Level TypeScript Practical Exercises', type: 'Practice', is_search_recommendation: true }
            ]
          },
          {
            skill: 'PostgreSQL & Database Design',
            category: 'Technical',
            importance: 'Critical',
            current_proficiency: 'Beginner',
            required_proficiency: 'Advanced',
            gap_severity: 'Critical',
            reason: 'Full-stack roles require data modeling, foreign key cascades, transactions, and indexing strategies.',
            recommendation: 'Design schema migrations with RLS policies, indexing, and EXPLAIN query analysis.',
            estimated_hours: 36,
            learning_resources: [
              { title: 'Use The Index, Luke: A Guide to Database Performance', url: 'https://use-the-index-luke.com/', type: 'Book' },
              { title: 'PostgreSQL Official Documentation: Indexes & Concurrency', type: 'Documentation', is_search_recommendation: true }
            ]
          },
          {
            skill: 'Docker & Containerization',
            category: 'Tools & Frameworks',
            importance: 'High',
            current_proficiency: 'None',
            required_proficiency: 'Intermediate',
            gap_severity: 'Critical',
            reason: 'Standard expectation for packaging microservices and running local reproducible environments.',
            recommendation: 'Create multi-stage Dockerfiles and docker-compose files for multi-service apps.',
            estimated_hours: 20,
            learning_resources: [
              { title: 'Docker Official Getting Started Tutorial', url: 'https://docs.docker.com/get-started/', type: 'Documentation' }
            ]
          },
          {
            skill: 'System Design & Scalability',
            category: 'Domain Knowledge',
            importance: 'Critical',
            current_proficiency: 'Beginner',
            required_proficiency: 'Intermediate',
            gap_severity: 'Critical',
            reason: 'Technical interviews and seniority progression hinge on caching, load balancing, and rate limiting.',
            recommendation: 'Study caching patterns (Redis), message queues, and API gateway architectures.',
            estimated_hours: 40,
            learning_resources: [
              { title: 'System Design Primer (Donne Martin)', url: 'https://github.com/donnemartin/system-design-primer', type: 'Documentation' }
            ]
          },
          {
            skill: 'Automated Testing (Unit & Integration)',
            category: 'Technical',
            importance: 'High',
            current_proficiency: 'Beginner',
            required_proficiency: 'Advanced',
            gap_severity: 'Moderate',
            reason: 'Production software teams require test-driven or regression-safe pull requests.',
            recommendation: 'Implement unit testing with Vitest and API integration testing with Supertest.',
            estimated_hours: 18,
            learning_resources: [
              { title: 'Testing JavaScript Applications', type: 'Book', is_search_recommendation: true }
            ]
          },
          {
            skill: 'Technical Communication & Mentorship',
            category: 'Soft Skill',
            importance: 'Medium',
            current_proficiency: 'Intermediate',
            required_proficiency: 'Advanced',
            gap_severity: 'Minor',
            reason: 'Crucial for cross-functional alignment with product managers and peers.',
            recommendation: 'Write RFCs (Request for Comments) and thorough pull request descriptions.',
            estimated_hours: 12,
            learning_resources: [
              { title: 'Staff Engineer: Leadership beyond the management track', type: 'Book', is_search_recommendation: true }
            ]
          }
        ],
        coverage_by_category: [
          { category: 'Technical', current_score: 68, target_score: 90 },
          { category: 'Soft Skill', current_score: 82, target_score: 85 },
          { category: 'Domain Knowledge', current_score: 55, target_score: 85 },
          { category: 'Tools & Frameworks', current_score: 60, target_score: 85 },
        ],
        top_strengths: ['Modern Frontend Frameworks (React)', 'Version Control Workflow', 'Client-side State Management'],
        critical_gaps: ['PostgreSQL & Database Design', 'Docker & Containerization', 'System Design & Scalability'],
        recommended_projects: [
          {
            title: 'High-Concurrency Event Ticketing Service',
            description: 'Build a containerized REST API with PostgreSQL transactions, Redis rate limiting, and Stripe webhook handling.',
            skills_targeted: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
            complexity: 'Advanced',
            estimated_duration_weeks: 4,
          },
          {
            title: 'Distributed Log Aggregator & Alerting Service',
            description: 'Create a lightweight telemetry receiver with query indexing and automated email alerts.',
            skills_targeted: ['TypeScript', 'Express', 'SQL Indexing', 'Testing'],
            complexity: 'Intermediate',
            estimated_duration_weeks: 3,
          }
        ],
        recommended_certifications: [
          { name: 'AWS Certified Developer - Associate', issuer: 'Amazon Web Services', relevance: 'Validates cloud deployments, serverless, and IAM security.' },
          { name: 'Meta Back-End Developer Professional Certificate', issuer: 'Meta', relevance: 'Demonstrates verified relational database design and Python/Node backend skills.' }
        ]
      };
    } else if (isATS) {
      mockData = {
        estimated_match_score: 81,
        target_job_title: targetRole,
        target_keywords: [
          { keyword: 'TypeScript', present: true, frequency: 6, importance: 'High' },
          { keyword: 'React', present: true, frequency: 8, importance: 'High' },
          { keyword: 'PostgreSQL', present: false, frequency: 0, importance: 'High' },
          { keyword: 'REST APIs', present: true, frequency: 3, importance: 'High' },
          { keyword: 'Docker', present: false, frequency: 0, importance: 'Medium' },
          { keyword: 'CI/CD Pipelines', present: false, frequency: 0, importance: 'Medium' },
          { keyword: 'Unit Testing', present: false, frequency: 0, importance: 'High' },
          { keyword: 'System Design', present: false, frequency: 0, importance: 'Medium' }
        ],
        missing_keywords: ['PostgreSQL', 'Docker', 'CI/CD Pipelines', 'Unit Testing', 'Redis', 'Microservices'],
        formatting_and_readability: [
          { check: 'Standard Reverse-Chronological Order', passed: true, suggestion: 'Clear and consistent work timeline.' },
          { check: 'Standard Machine-Readable Fonts', passed: true, suggestion: 'Sans-serif typography parses accurately without OCR.' },
          { check: 'Action-Oriented Verbs', passed: false, suggestion: 'Replace passive phrases with strong verbs like Engineered, Architected, Spearheaded.' },
          { check: 'Quantified Metrics', passed: false, suggestion: 'Add percentage increases, latency improvements, or revenue impacts to highlight ROI.' }
        ],
        improved_summary: `Results-driven ${targetRole} with hands-on experience designing performant React applications, scalable TypeScript REST APIs, and responsive architectures. Proven track record of improving web performance and shipping maintainable code in agile engineering environments.`,
        bullet_point_improvements: [
          {
            original: 'Developed accessible React components for the user dashboard.',
            improved: 'Architected 25+ reusable accessible React/TypeScript components, reducing UI render latency by 18% and ensuring WCAG 2.1 AA compliance.',
            rationale: 'Applies the Google X-Y-Z framework with specific volume, latency, and compliance standards.',
            skills_highlighted: ['React', 'TypeScript', 'Accessibility', 'Web Performance']
          },
          {
            original: 'Worked on integrating backend APIs and fixing bugs.',
            improved: 'Integrated 14 RESTful endpoints using Axios and React Query, slashing client data fetch errors by 32% across 10,000+ monthly active users.',
            rationale: 'Replaces generic phrasing with concrete technical integrations and user scale.',
            skills_highlighted: ['REST APIs', 'React Query', 'Error Handling']
          }
        ],
        suggested_skills_section: [
          'Languages: TypeScript, JavaScript (ES2024), SQL, HTML5/CSS3',
          'Frontend: React, Next.js, Tailwind CSS, Redux Toolkit, React Query',
          'Backend & Data: Node.js, Express, PostgreSQL, Prisma, Redis Basics',
          'DevOps & Tools: Git, GitHub Actions, Docker Basics, Vitest, Postman'
        ],
        actionable_checklist: [
          { task: 'Incorporate PostgreSQL and Docker keywords in your Technical Skills section', impact: 'High', completed: false },
          { task: 'Quantify at least 3 bullet points with latency, user volume, or test coverage numbers', impact: 'High', completed: false },
          { task: 'Replace passive phrasing like "responsible for" with proactive impact verbs', impact: 'Medium', completed: false },
          { task: 'Ensure file is saved as a clean single-column PDF or DOCX without tables or graphics', impact: 'High', completed: true }
        ]
      };
    } else if (isRoadmap) {
      mockData = {
        target_role: targetRole,
        tasks: [
          {
            phase: '30-day',
            title: 'ATS Resume Keyword & Bullet Point Revamp',
            description: 'Rewrite resume bullet points with quantified Google X-Y-Z statements and integrate essential missing keywords (TypeScript, PostgreSQL, RESTful APIs).',
            priority: 'High',
            estimated_duration: '1 week',
            required_skills: ['Resume Writing', 'ATS Alignment'],
            learning_resources: [
              { title: 'GapZero ATS Optimizer Tool', type: 'Tool' },
              { title: 'Google Tech Resume Guide: X-Y-Z Formula', type: 'Documentation', is_search_recommendation: true }
            ],
            expected_outcome: 'Updated, high-scoring ATS-friendly resume ready for initial recruiter screening.'
          },
          {
            phase: '30-day',
            title: 'Deepen TypeScript Advanced Typings & Generics',
            description: 'Study advanced TypeScript patterns: conditional types, mapped types, discriminated unions, and strict null checks.',
            priority: 'High',
            estimated_duration: '2 weeks',
            required_skills: ['TypeScript'],
            learning_resources: [
              { title: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html', type: 'Documentation' }
            ],
            expected_outcome: 'Ability to construct type-safe libraries and cleanly type complex API payloads.'
          },
          {
            phase: '30-day',
            title: 'Relational Database Modeling with PostgreSQL',
            description: 'Design a normalized 3NF database schema with foreign keys, compound indexes, and Row Level Security (RLS) policies.',
            priority: 'High',
            estimated_duration: '2 weeks',
            required_skills: ['PostgreSQL', 'SQL'],
            learning_resources: [
              { title: 'PostgreSQL Tutorial for Developers', url: 'https://www.postgresqltutorial.com/', type: 'Documentation' }
            ],
            expected_outcome: 'Working PostgreSQL migration scripts and query optimization knowledge.'
          },
          {
            phase: '90-day',
            title: 'Full-Stack Containerized Capstone Project',
            description: 'Build and deploy a full-stack SaaS application featuring authentication, PostgreSQL, Redis caching, and Docker containerization.',
            priority: 'High',
            estimated_duration: '4 weeks',
            required_skills: ['Docker', 'Node.js', 'PostgreSQL', 'React'],
            learning_resources: [
              { title: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started/', type: 'Documentation' }
            ],
            expected_outcome: 'A live production portfolio project with public GitHub code and automated CI/CD.'
          },
          {
            phase: '90-day',
            title: 'Data Structures & Algorithms Interview Drills',
            description: 'Practice high-frequency patterns (Two Pointers, Sliding Window, Trees, Graphs, Dynamic Programming) with timed mock sessions.',
            priority: 'Medium',
            estimated_duration: '4 weeks',
            required_skills: ['Algorithms', 'Problem Solving'],
            learning_resources: [
              { title: 'NeetCode 150 Core Practice Roadmap', url: 'https://neetcode.io/', type: 'Practice' }
            ],
            expected_outcome: 'Confidence in solving medium-level coding interview problems within 25 minutes.'
          },
          {
            phase: '90-day',
            title: 'LinkedIn & GitHub Profile Overhaul',
            description: 'Publish your capstone project, write a technical post explaining an engineering challenge you solved, and optimize your LinkedIn About section.',
            priority: 'Medium',
            estimated_duration: '1 week',
            required_skills: ['Personal Branding', 'Technical Writing'],
            learning_resources: [
              { title: 'GapZero LinkedIn Optimizer', type: 'Tool' }
            ],
            expected_outcome: 'Inbound recruiter profile visibility boost.'
          },
          {
            phase: '12-month',
            title: 'System Design & High-Scalability Architectures',
            description: 'Master rate limiting, message brokers (Kafka/RabbitMQ), database sharding, and CDN caching strategies.',
            priority: 'High',
            estimated_duration: '8 weeks',
            required_skills: ['System Design', 'Microservices', 'Distributed Systems'],
            learning_resources: [
              { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Documentation' }
            ],
            expected_outcome: 'Readiness for mid-to-senior technical architectural interviews.'
          },
          {
            phase: '12-month',
            title: 'Targeted Job Application Campaign & Referrals',
            description: 'Apply to 30 curated high-growth companies with tailored resumes and reach out to engineering peers for warm referrals.',
            priority: 'High',
            estimated_duration: '12 weeks',
            required_skills: ['Networking', 'Interviewing'],
            learning_resources: [
              { title: 'GapZero Job Description Matcher', type: 'Tool' }
            ],
            expected_outcome: 'Secured interviews and competitive job offers in your target role.'
          }
        ]
      };
    } else if (isLinkedIn) {
      mockData = {
        headline_suggestions: [
          `${targetRole} | TypeScript, React, Node.js & Distributed Systems | Building High-Performance Web Products`,
          `Full-Stack Engineer @ Apex Tech | Scaling Resilient Microservices & Cloud Architectures | Tech Writer`,
          `Software Engineer | Bridging Modern Frontend Polish with Scalable Database Backends | Open-Source Enthusiast`
        ],
        improved_about: `I am a software engineer dedicated to building reliable, high-performance web applications that solve real customer problems. With strong foundations across the entire stack—from responsive React interfaces to robust PostgreSQL databases and microservice APIs—I take pride in writing clean, type-safe, and thoroughly tested code.\n\nOver the past few years, I have worked on reducing UI latency, engineering resilient API integrations, and containerizing full-stack workflows. I love diving into distributed systems, database query optimization, and collaborating with cross-functional teams to ship impactful software.\n\nLet's connect if you're passionate about engineering excellence, scalable architectures, or modern web technologies!`,
        experience_improvements: [
          {
            company_or_role: 'Software Developer',
            suggestions: [
              'Highlight the scale of your applications (e.g. daily active users, requests per second).',
              'Mention the exact technologies and libraries used in each project (e.g. TypeScript, React Query, PostgreSQL, Docker).',
              'Include a link to the live product or a public case study if permissible.'
            ]
          }
        ],
        recommended_skills: [
          'Full-Stack Development',
          'TypeScript',
          'React.js',
          'Node.js',
          'PostgreSQL',
          'REST APIs',
          'Docker',
          'System Architecture',
          'Git'
        ],
        relevant_keywords: [
          'Software Engineer',
          'Full-Stack Developer',
          'TypeScript',
          'React',
          'Node.js',
          'PostgreSQL',
          'Scalable Web Apps',
          'Cloud Architecture',
          'Agile'
        ],
        networking_and_content_strategy: [
          'Publish a bi-weekly post dissecting an interesting technical bug or architectural pattern you learned.',
          'Comment thoughtfully on posts by engineering leaders at your target companies (Stripe, Airbnb, Linear).',
          'Engage with open-source repositories in your niche and showcase your pull requests.'
        ]
      };
    } else if (isJobMatch) {
      mockData = {
        match_percentage: 82,
        matching_skills: ['JavaScript / TypeScript', 'React', 'RESTful APIs', 'Git', 'Agile / Scrum'],
        missing_skills: ['PostgreSQL query optimization', 'Docker & Kubernetes', 'CI/CD pipeline configuration'],
        matching_experience: [
          'Demonstrated commercial experience building web applications in React and TypeScript.',
          'Experience collaborating with product managers and participating in sprint ceremonies.'
        ],
        missing_experience: [
          'Documented production ownership of distributed backend services.',
          'Direct experience monitoring application performance with APM tools (Datadog/NewRelic).'
        ],
        resume_tailoring_suggestions: [
          'Place TypeScript, REST APIs, and database technologies at the top of your skills grid.',
          'Rewrite your primary project bullet to emphasize end-to-end delivery rather than just frontend styling.',
          'Mention automated unit testing frameworks to demonstrate code reliability.'
        ],
        recommended_prep_tasks: [
          'Review database index types (B-tree vs Hash) and query explain plans.',
          'Prepare an example of a technical trade-off you made between development velocity and system scalability.',
          'Dockerize a sample Node.js application to discuss containerization during the interview.'
        ]
      };
    }

    return schema.parse(mockData);
  }

  async generateText(
    systemPrompt: string, 
    userPrompt: string, 
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    const q = userPrompt.toLowerCase();

    if (q.includes('interview') || q.includes('system design') || q.includes('prepare')) {
      return `### Technical & System Design Preparation Strategy\n\nWhen preparing for interviews, top tech companies look for three core dimensions:\n\n1. **Technical Problem Solving:** Focus on pattern recognition rather than memorizing individual problems. Master **Two Pointers, Sliding Window, Tree Traversals, and Dynamic Programming** on platforms like NeetCode.\n2. **System Architecture:** Practice designing end-to-end services. Be prepared to explain:\n   - How you handle database transactions and concurrency\n   - How caching (Redis) reduces database load\n   - How you secure endpoints with JWT and rate limiting\n3. **Behavioral Impact (The STAR Method):** Have 3-4 deep stories ready about resolving technical disagreements, handling production incidents, and mentoring teammates.\n\n*What specific interview format or company are you preparing for next? Let's drill down into mock questions.*`;
    }

    if (q.includes('resume') || q.includes('bullet') || q.includes('ats')) {
      return `### Elevating Your Resume for High ATS Scores\n\nTo pass initial recruiter screenings, your resume should directly prove business ROI. Here is the formula:\n\n> **Accomplished [X] as measured by [Y], by doing [Z]**\n\nInstead of: *"Built API endpoints for the dashboard."*\n\nUse: *"Engineered 12 RESTful microservices in Node.js/TypeScript, reducing client latency by 24% across 15,000 active sessions."*\n\n**Next Steps:**\n- Ensure technical keywords match your target role (PostgreSQL, Docker, TypeScript).\n- Run your resume through GapZero's **ATS Resume Optimizer** to see missing keywords highlighted in real time!`;
    }

    return `Hello! I'm your **GapZero Career Coach**. Based on your current profile and career trajectory, I'm here to help you bridge your skill gaps, polish your resume, prepare for rigorous technical interviews, and execute your career roadmap.\n\nHere are some high-impact areas we can explore today:\n- **Gap Prioritization:** Which technical gap should you tackle first to maximize hiring probability?\n- **Project Architecture:** Reviewing the system design of your next capstone project.\n- **Mock Technical Interview:** Simulating a live coding or architecture interview.\n- **Target Company Strategy:** Tailoring your applications for competitive teams.\n\nWhat would you like to focus on right now?`;
  }
}

let aiProviderInstance: LLMProvider | null = null;

export function getAIProvider(): LLMProvider {
  if (aiProviderInstance) {
    return aiProviderInstance;
  }

  if (config.anthropicApiKey && config.anthropicApiKey.trim().length > 10) {
    console.log(`🤖 Using Anthropic Claude AI (${config.anthropicModel})`);
    aiProviderInstance = new AnthropicProvider(config.anthropicApiKey, config.anthropicModel);
  } else {
    console.log('💡 Anthropic API Key not detected. Running in GapZero Simulation Mode.');
    aiProviderInstance = new FallbackProvider();
  }

  return aiProviderInstance;
}
