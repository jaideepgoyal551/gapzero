import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { 
  UserProfile, 
  ResumeAnalysis, 
  SkillGapReport, 
  CareerRoadmap, 
  RoadmapTask, 
  JobMatchResult, 
  LinkedInOptimization, 
  GitHubPortfolioAnalysis, 
  CoachConversation, 
  CoachMessage 
} from '@shared/types';
import { v4 as uuidv4 } from 'uuid';

export let supabase: SupabaseClient | null = null;

if (config.supabaseUrl && (config.supabaseAnonKey || config.supabaseServiceKey)) {
  try {
    supabase = createClient(
      config.supabaseUrl, 
      config.supabaseServiceKey || config.supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );
    console.log('✅ Supabase client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Could not initialize Supabase client:', err);
  }
} else {
  console.log('ℹ️ Running in Local Storage Mode (Supabase environment variables not set).');
}

// In-Memory Database store for local development / testing / offline operation
class MemoryDatabase {
  private profiles = new Map<string, UserProfile>();
  private resumeAnalyses = new Map<string, ResumeAnalysis[]>();
  private skillAssessments = new Map<string, SkillGapReport[]>();
  private roadmaps = new Map<string, CareerRoadmap>();
  private roadmapTasks = new Map<string, RoadmapTask[]>();
  private jobMatches = new Map<string, JobMatchResult[]>();
  private linkedinAnalyses = new Map<string, LinkedInOptimization[]>();
  private githubAnalyses = new Map<string, GitHubPortfolioAnalysis[]>();
  private coachConversations = new Map<string, CoachConversation[]>();
  private coachMessages = new Map<string, CoachMessage[]>();

  constructor() {
    // Seed a default demo profile for development
    const demoId = '00000000-0000-0000-0000-000000000001';
    this.profiles.set(demoId, {
      id: demoId,
      email: 'demo@gapzero.ai',
      full_name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      education_level: "Bachelor's Degree",
      current_role: 'Junior Frontend Developer',
      years_of_experience: 1.5,
      current_skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'Tailwind CSS'],
      target_role: 'Full-Stack Software Engineer',
      target_companies: ['Stripe', 'Airbnb', 'Linear', 'Shopify'],
      preferred_country: 'United States',
      preferred_work_arrangement: 'Remote',
      weekly_learning_hours: 12,
      career_goals: 'Transition from junior frontend to a high-impact full-stack engineer building scalable web services.',
      github_url: 'https://github.com/torvalds',
      linkedin_url: 'https://linkedin.com/in/alex-rivera-dev',
      created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Profile methods
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (!error && data) return data as UserProfile;
    }
    return this.profiles.get(userId) || null;
  }

  async saveProfile(profile: Partial<UserProfile> & { id: string; email?: string }): Promise<UserProfile> {
    const existing = await this.getProfile(profile.id);
    const updated: UserProfile = {
      id: profile.id,
      email: profile.email || existing?.email || 'user@gapzero.ai',
      full_name: profile.full_name ?? existing?.full_name ?? '',
      avatar_url: profile.avatar_url ?? existing?.avatar_url,
      education_level: profile.education_level ?? existing?.education_level ?? "Bachelor's Degree",
      current_role: profile.current_role ?? existing?.current_role ?? 'Aspiring Engineer',
      years_of_experience: profile.years_of_experience ?? existing?.years_of_experience ?? 0,
      current_skills: profile.current_skills ?? existing?.current_skills ?? [],
      target_role: profile.target_role ?? existing?.target_role ?? 'Full-Stack Engineer',
      target_companies: profile.target_companies ?? existing?.target_companies ?? [],
      preferred_country: profile.preferred_country ?? existing?.preferred_country ?? 'United States',
      preferred_work_arrangement: profile.preferred_work_arrangement ?? existing?.preferred_work_arrangement ?? 'Remote',
      weekly_learning_hours: profile.weekly_learning_hours ?? existing?.weekly_learning_hours ?? 10,
      career_goals: profile.career_goals ?? existing?.career_goals ?? '',
      github_url: profile.github_url ?? existing?.github_url,
      linkedin_url: profile.linkedin_url ?? existing?.linkedin_url,
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('profiles').upsert(updated);
    }
    this.profiles.set(profile.id, updated);
    return updated;
  }

  // Resume analysis
  async saveResumeAnalysis(analysis: ResumeAnalysis): Promise<ResumeAnalysis> {
    if (supabase) {
      await supabase.from('resume_analyses').insert({
        id: analysis.id,
        user_id: analysis.user_id,
        filename: analysis.filename,
        file_size: analysis.file_size,
        parsed_text: analysis.parsed_text,
        target_role: analysis.target_role,
        overall_score: analysis.overall_score,
        career_fit_score: analysis.career_fit_score,
        ats_score: analysis.ats_score,
        extracted_data: analysis.extracted_data,
        strongest_skills: analysis.strongest_skills,
        missing_skills: analysis.missing_skills,
        important_weaknesses: analysis.important_weaknesses,
        experience_relevance: analysis.experience_relevance,
        project_relevance: analysis.project_relevance,
        recommended_improvements: analysis.recommended_improvements,
        suggested_next_steps: analysis.suggested_next_steps,
        scoring_rationale: analysis.scoring_rationale,
        created_at: analysis.created_at,
      });
    }
    const list = this.resumeAnalyses.get(analysis.user_id) || [];
    list.unshift(analysis);
    this.resumeAnalyses.set(analysis.user_id, list);
    return analysis;
  }

  async getResumeAnalyses(userId: string): Promise<ResumeAnalysis[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data as ResumeAnalysis[];
    }
    return this.resumeAnalyses.get(userId) || [];
  }

  async getResumeAnalysisById(userId: string, id: string): Promise<ResumeAnalysis | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (!error && data) return data as ResumeAnalysis;
    }
    const list = this.resumeAnalyses.get(userId) || [];
    return list.find(a => a.id === id) || null;
  }

  async deleteResumeAnalysis(userId: string, id: string): Promise<boolean> {
    if (supabase) {
      await supabase
        .from('resume_analyses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
    }
    const list = this.resumeAnalyses.get(userId) || [];
    const filtered = list.filter(a => a.id !== id);
    this.resumeAnalyses.set(userId, filtered);
    return true;
  }

  // Roadmap methods
  async saveRoadmap(roadmap: CareerRoadmap): Promise<CareerRoadmap> {
    if (supabase) {
      await supabase.from('career_roadmaps').upsert({
        id: roadmap.id,
        user_id: roadmap.user_id,
        target_role: roadmap.target_role,
        progress_percentage: roadmap.progress_percentage,
        created_at: roadmap.created_at,
        updated_at: roadmap.updated_at,
      });

      // Insert tasks
      if (roadmap.tasks.length > 0) {
        await supabase.from('roadmap_tasks').delete().eq('roadmap_id', roadmap.id);
        await supabase.from('roadmap_tasks').insert(
          roadmap.tasks.map(t => ({
            id: t.id,
            roadmap_id: roadmap.id,
            phase: t.phase,
            title: t.title,
            description: t.description,
            priority: t.priority,
            estimated_duration: t.estimated_duration,
            required_skills: t.required_skills,
            learning_resources: t.learning_resources,
            expected_outcome: t.expected_outcome,
            completed: t.completed,
            completed_at: t.completed_at,
          }))
        );
      }
    }
    this.roadmaps.set(roadmap.user_id, roadmap);
    this.roadmapTasks.set(roadmap.id, roadmap.tasks);
    return roadmap;
  }

  async getRoadmap(userId: string): Promise<CareerRoadmap | null> {
    if (supabase) {
      const { data: rmData, error: rmError } = await supabase
        .from('career_roadmaps')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!rmError && rmData) {
        const { data: tasksData } = await supabase
          .from('roadmap_tasks')
          .select('*')
          .eq('roadmap_id', rmData.id);

        return {
          ...rmData,
          tasks: (tasksData || []) as RoadmapTask[],
        } as CareerRoadmap;
      }
    }
    return this.roadmaps.get(userId) || null;
  }

  async updateRoadmapTask(userId: string, taskId: string, completed: boolean): Promise<RoadmapTask | null> {
    let updatedTask: RoadmapTask | null = null;
    const roadmap = await this.getRoadmap(userId);
    if (!roadmap) return null;

    const taskIndex = roadmap.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      roadmap.tasks[taskIndex].completed = completed;
      roadmap.tasks[taskIndex].completed_at = completed ? new Date().toISOString() : undefined;
      updatedTask = roadmap.tasks[taskIndex];

      const completedCount = roadmap.tasks.filter(t => t.completed).length;
      roadmap.progress_percentage = Math.round((completedCount / roadmap.tasks.length) * 100);
      roadmap.updated_at = new Date().toISOString();

      await this.saveRoadmap(roadmap);
    }
    return updatedTask;
  }

  // Job Matches
  async saveJobMatch(match: JobMatchResult): Promise<JobMatchResult> {
    if (supabase) {
      await supabase.from('job_matches').insert({
        id: match.id,
        user_id: match.user_id,
        job_title: match.job_title,
        company_name: match.company_name,
        job_description: match.job_description,
        match_percentage: match.match_percentage,
        matching_skills: match.matching_skills,
        missing_skills: match.missing_skills,
        matching_experience: match.matching_experience,
        missing_experience: match.missing_experience,
        resume_tailoring_suggestions: match.resume_tailoring_suggestions,
        recommended_prep_tasks: match.recommended_prep_tasks,
        created_at: match.created_at,
      });
    }
    const list = this.jobMatches.get(match.user_id) || [];
    list.unshift(match);
    this.jobMatches.set(match.user_id, list);
    return match;
  }

  async getJobMatches(userId: string): Promise<JobMatchResult[]> {
    if (supabase) {
      const { data } = await supabase
        .from('job_matches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) return data as JobMatchResult[];
    }
    return this.jobMatches.get(userId) || [];
  }

  // LinkedIn Analyses
  async saveLinkedInAnalysis(analysis: LinkedInOptimization): Promise<LinkedInOptimization> {
    if (supabase) {
      await supabase.from('linkedin_analyses').insert(analysis);
    }
    const list = this.linkedinAnalyses.get(analysis.user_id) || [];
    list.unshift(analysis);
    this.linkedinAnalyses.set(analysis.user_id, list);
    return analysis;
  }

  async getLatestLinkedInAnalysis(userId: string): Promise<LinkedInOptimization | null> {
    const list = this.linkedinAnalyses.get(userId) || [];
    return list[0] || null;
  }

  // GitHub Analyses
  async saveGitHubAnalysis(analysis: GitHubPortfolioAnalysis): Promise<GitHubPortfolioAnalysis> {
    if (supabase) {
      await supabase.from('github_analyses').insert(analysis);
    }
    const list = this.githubAnalyses.get(analysis.user_id) || [];
    list.unshift(analysis);
    this.githubAnalyses.set(analysis.user_id, list);
    return analysis;
  }

  async getLatestGitHubAnalysis(userId: string): Promise<GitHubPortfolioAnalysis | null> {
    const list = this.githubAnalyses.get(userId) || [];
    return list[0] || null;
  }

  // AI Career Coach
  async getCoachConversations(userId: string): Promise<CoachConversation[]> {
    if (supabase) {
      const { data } = await supabase
        .from('coach_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (data) return data as CoachConversation[];
    }
    return this.coachConversations.get(userId) || [];
  }

  async createCoachConversation(userId: string, title: string = 'Career Strategy Session'): Promise<CoachConversation> {
    const convo: CoachConversation = {
      id: uuidv4(),
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (supabase) {
      await supabase.from('coach_conversations').insert(convo);
    }
    const list = this.coachConversations.get(userId) || [];
    list.unshift(convo);
    this.coachConversations.set(userId, list);
    return convo;
  }

  async getCoachMessages(conversationId: string): Promise<CoachMessage[]> {
    if (supabase) {
      const { data } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (data) return data as CoachMessage[];
    }
    return this.coachMessages.get(conversationId) || [];
  }

  async addCoachMessage(conversationId: string, sender: 'user' | 'assistant', content: string): Promise<CoachMessage> {
    const msg: CoachMessage = {
      id: uuidv4(),
      conversation_id: conversationId,
      sender,
      content,
      created_at: new Date().toISOString(),
    };
    if (supabase) {
      await supabase.from('coach_messages').insert(msg);
      await supabase.from('coach_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    }
    const list = this.coachMessages.get(conversationId) || [];
    list.push(msg);
    this.coachMessages.set(conversationId, list);
    return msg;
  }

  // Account data deletion (Privacy requirement)
  async deleteUserData(userId: string): Promise<void> {
    if (supabase) {
      await supabase.from('profiles').delete().eq('id', userId);
    }
    this.profiles.delete(userId);
    this.resumeAnalyses.delete(userId);
    this.skillAssessments.delete(userId);
    this.roadmaps.delete(userId);
    this.jobMatches.delete(userId);
    this.linkedinAnalyses.delete(userId);
    this.githubAnalyses.delete(userId);
    this.coachConversations.delete(userId);
  }
}

export const db = new MemoryDatabase();
