import { z } from 'zod';

export const ResumeAnalysisSchema = z.object({
  overall_score: z.number().min(0).max(100),
  career_fit_score: z.number().min(0).max(100),
  ats_score: z.number().min(0).max(100),
  extracted_data: z.object({
    summary: z.string(),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
      field_of_study: z.string().optional(),
      graduation_year: z.string().optional(),
    })),
    technical_skills: z.array(z.string()),
    soft_skills: z.array(z.string()),
    work_experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      duration: z.string(),
      highlights: z.array(z.string()),
    })),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      link: z.string().optional(),
    })),
    certifications: z.array(z.string()),
    achievements: z.array(z.string()),
  }),
  strongest_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  important_weaknesses: z.array(z.string()),
  experience_relevance: z.object({
    score: z.number().min(0).max(100),
    explanation: z.string(),
  }),
  project_relevance: z.object({
    score: z.number().min(0).max(100),
    explanation: z.string(),
  }),
  recommended_improvements: z.array(z.string()),
  suggested_next_steps: z.array(z.string()),
  scoring_rationale: z.object({
    overall_explanation: z.string(),
    fit_explanation: z.string(),
    ats_explanation: z.string(),
  }),
});

export const SkillGapReportSchema = z.object({
  overall_fit_score: z.number().min(0).max(100),
  skills: z.array(z.object({
    skill: z.string(),
    category: z.enum(['Technical', 'Soft Skill', 'Domain Knowledge', 'Tools & Frameworks']),
    importance: z.enum(['Critical', 'High', 'Medium', 'Low']),
    current_proficiency: z.enum(['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Unknown']),
    required_proficiency: z.enum(['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Unknown']),
    gap_severity: z.enum(['Critical', 'Moderate', 'Minor']),
    reason: z.string(),
    recommendation: z.string(),
    estimated_hours: z.number().min(1),
    learning_resources: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      type: z.enum(['Course', 'Documentation', 'Book', 'Practice']),
      is_search_recommendation: z.boolean().optional(),
    })).optional(),
  })),
  coverage_by_category: z.array(z.object({
    category: z.enum(['Technical', 'Soft Skill', 'Domain Knowledge', 'Tools & Frameworks']),
    current_score: z.number().min(0).max(100),
    target_score: z.number().min(0).max(100),
  })),
  top_strengths: z.array(z.string()),
  critical_gaps: z.array(z.string()),
  recommended_projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    skills_targeted: z.array(z.string()),
    complexity: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    estimated_duration_weeks: z.number().min(1),
  })),
  recommended_certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    relevance: z.string(),
  })),
});

export const ATSOptimizationSchema = z.object({
  estimated_match_score: z.number().min(0).max(100),
  target_job_title: z.string(),
  target_keywords: z.array(z.object({
    keyword: z.string(),
    present: z.boolean(),
    frequency: z.number(),
    importance: z.enum(['High', 'Medium', 'Low']),
  })),
  missing_keywords: z.array(z.string()),
  formatting_and_readability: z.array(z.object({
    check: z.string(),
    passed: z.boolean(),
    suggestion: z.string(),
  })),
  improved_summary: z.string(),
  bullet_point_improvements: z.array(z.object({
    original: z.string(),
    improved: z.string(),
    rationale: z.string(),
    skills_highlighted: z.array(z.string()),
  })),
  suggested_skills_section: z.array(z.string()),
  actionable_checklist: z.array(z.object({
    task: z.string(),
    impact: z.enum(['High', 'Medium', 'Low']),
    completed: z.boolean(),
  })),
});

export const RoadmapTaskSchema = z.object({
  phase: z.enum(['30-day', '90-day', '12-month']),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  estimated_duration: z.string(),
  required_skills: z.array(z.string()),
  learning_resources: z.array(z.object({
    title: z.string(),
    url: z.string().optional(),
    type: z.string(),
    is_search_recommendation: z.boolean().optional(),
  })),
  expected_outcome: z.string(),
});

export const CareerRoadmapSchema = z.object({
  target_role: z.string(),
  tasks: z.array(RoadmapTaskSchema),
});

export const LinkedInOptimizationSchema = z.object({
  headline_suggestions: z.array(z.string()).min(2),
  improved_about: z.string(),
  experience_improvements: z.array(z.object({
    company_or_role: z.string(),
    suggestions: z.array(z.string()),
  })),
  recommended_skills: z.array(z.string()),
  relevant_keywords: z.array(z.string()),
  networking_and_content_strategy: z.array(z.string()),
});

export const JobMatchSchema = z.object({
  match_percentage: z.number().min(0).max(100),
  matching_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  matching_experience: z.array(z.string()),
  missing_experience: z.array(z.string()),
  resume_tailoring_suggestions: z.array(z.string()),
  recommended_prep_tasks: z.array(z.string()),
});
