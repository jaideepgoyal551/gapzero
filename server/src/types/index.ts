// Shared TypeScript definitions for GapZero Career Intelligence Platform

export type EducationLevel = 
  | 'High School'
  | 'Associate Degree'
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'Doctorate (Ph.D.)'
  | 'Self-Taught / Bootcamp'
  | 'Other';

export type WorkArrangement = 'Remote' | 'Hybrid' | 'On-site' | 'Any';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  education_level?: EducationLevel;
  current_role?: string;
  years_of_experience: number;
  current_skills: string[];
  target_role: string;
  target_companies: string[];
  preferred_country: string;
  preferred_work_arrangement: WorkArrangement;
  weekly_learning_hours: number;
  career_goals: string;
  github_url?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeExtractedData {
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field_of_study?: string;
    graduation_year?: string;
  }>;
  technical_skills: string[];
  soft_skills: string[];
  work_experience: Array<{
    title: string;
    company: string;
    duration: string;
    highlights: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: string[];
  achievements: string[];
}

export interface ResumeAnalysis {
  id: string;
  user_id: string;
  filename: string;
  file_size: number;
  parsed_text?: string;
  target_role: string;
  overall_score: number; // 0 - 100
  career_fit_score: number; // 0 - 100
  ats_score: number; // 0 - 100
  extracted_data: ResumeExtractedData;
  strongest_skills: string[];
  missing_skills: string[];
  important_weaknesses: string[];
  experience_relevance: {
    score: number;
    explanation: string;
  };
  project_relevance: {
    score: number;
    explanation: string;
  };
  recommended_improvements: string[];
  suggested_next_steps: string[];
  scoring_rationale: {
    overall_explanation: string;
    fit_explanation: string;
    ats_explanation: string;
  };
  created_at: string;
}

export type SkillCategory = 'Technical' | 'Soft Skill' | 'Domain Knowledge' | 'Tools & Frameworks';
export type SkillProficiency = 'None' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Unknown';
export type GapSeverity = 'Critical' | 'Moderate' | 'Minor';

export interface SkillGapItem {
  skill: string;
  category: SkillCategory;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  current_proficiency: SkillProficiency;
  required_proficiency: SkillProficiency;
  gap_severity: GapSeverity;
  reason: string;
  recommendation: string;
  estimated_hours: number;
  learning_resources?: Array<{
    title: string;
    url?: string;
    type: 'Course' | 'Documentation' | 'Book' | 'Practice';
    is_search_recommendation?: boolean;
  }>;
}

export interface SkillGapReport {
  overall_fit_score: number;
  skills: SkillGapItem[];
  coverage_by_category: Array<{
    category: SkillCategory;
    current_score: number;
    target_score: number;
  }>;
  top_strengths: string[];
  critical_gaps: string[];
  recommended_projects: Array<{
    title: string;
    description: string;
    skills_targeted: string[];
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
    estimated_duration_weeks: number;
  }>;
  recommended_certifications: Array<{
    name: string;
    issuer: string;
    relevance: string;
  }>;
}

export interface ATSOptimizationResult {
  estimated_match_score: number;
  target_job_title: string;
  target_keywords: Array<{
    keyword: string;
    present: boolean;
    frequency: number;
    importance: 'High' | 'Medium' | 'Low';
  }>;
  missing_keywords: string[];
  formatting_and_readability: Array<{
    check: string;
    passed: boolean;
    suggestion: string;
  }>;
  improved_summary: string;
  bullet_point_improvements: Array<{
    original: string;
    improved: string;
    rationale: string;
    skills_highlighted: string[];
  }>;
  suggested_skills_section: string[];
  actionable_checklist: Array<{
    task: string;
    impact: 'High' | 'Medium' | 'Low';
    completed: boolean;
  }>;
}

export type RoadmapPhase = '30-day' | '90-day' | '12-month';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface RoadmapTask {
  id: string;
  roadmap_id: string;
  phase: RoadmapPhase;
  title: string;
  description: string;
  priority: TaskPriority;
  estimated_duration: string;
  required_skills: string[];
  learning_resources: Array<{
    title: string;
    url?: string;
    type: string;
    is_search_recommendation?: boolean;
  }>;
  expected_outcome: string;
  completed: boolean;
  completed_at?: string;
}

export interface CareerRoadmap {
  id: string;
  user_id: string;
  target_role: string;
  tasks: RoadmapTask[];
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface LinkedInOptimization {
  id: string;
  user_id: string;
  target_role: string;
  headline_suggestions: string[];
  improved_about: string;
  experience_improvements: Array<{
    company_or_role: string;
    suggestions: string[];
  }>;
  recommended_skills: string[];
  relevant_keywords: string[];
  networking_and_content_strategy: string[];
  created_at: string;
}

export interface GitHubPortfolioAnalysis {
  id: string;
  user_id: string;
  username: string;
  profile_summary: {
    name?: string;
    bio?: string;
    public_repos: number;
    followers: number;
    avatar_url?: string;
    created_at?: string;
  };
  analyzed_repositories: Array<{
    name: string;
    description?: string;
    language?: string;
    stars: number;
    forks: number;
    has_readme: boolean;
    readme_snippet?: string;
    updated_at: string;
  }>;
  language_distribution: Record<string, number>;
  portfolio_strengths: string[];
  documentation_gaps: string[];
  project_improvement_suggestions: string[];
  recommended_next_projects: Array<{
    title: string;
    tech_stack: string[];
    description: string;
    aligns_with_role: string;
  }>;
  role_alignment_score: number; // 0 - 100
  created_at: string;
}

export interface JobMatchResult {
  id: string;
  user_id: string;
  job_title: string;
  company_name?: string;
  job_description: string;
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  matching_experience: string[];
  missing_experience: string[];
  resume_tailoring_suggestions: string[];
  recommended_prep_tasks: string[];
  created_at: string;
}

export interface SalaryDataPoint {
  level: 'Entry-Level (0-2 yrs)' | 'Mid-Level (3-5 yrs)' | 'Senior (6-8 yrs)' | 'Lead / Staff (9+ yrs)';
  min: number;
  median: number;
  max: number;
}

export interface SalaryInsightResult {
  job_title: string;
  country: string;
  currency: string;
  currency_symbol: string;
  levels: SalaryDataPoint[];
  industry_adjustments: Array<{
    industry: string;
    multiplier: number;
    notes: string;
  }>;
  data_source: string;
  source_date: string;
  confidence_rating: 'High' | 'Medium' | 'Estimated';
  limitations_disclosure: string;
}

export interface CoachConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface DashboardSummary {
  profile: UserProfile | null;
  latest_resume_analysis: ResumeAnalysis | null;
  career_fit_score: number;
  identified_skills_count: number;
  critical_gaps_count: number;
  completed_tasks_count: number;
  total_tasks_count: number;
  roadmap_progress_percentage: number;
  recent_matches_count: number;
  upcoming_tasks: RoadmapTask[];
}
