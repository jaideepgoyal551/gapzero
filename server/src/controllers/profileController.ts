import { Request, Response } from 'express';
import { db } from '../db/database';
import { DashboardSummary } from '@shared/types';

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      let profile = await db.getProfile(userId);

      if (!profile) {
        profile = await db.saveProfile({
          id: userId,
          email: req.user!.email,
          full_name: '',
          target_role: '',
          years_of_experience: 0,
          current_skills: [],
          target_companies: [],
          preferred_country: 'United States',
          preferred_work_arrangement: 'Remote',
          weekly_learning_hours: 0,
          career_goals: '',
        });
      }

      return res.json({
        success: true,
        data: profile,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const updates = req.body;

      const profile = await db.saveProfile({
        id: userId,
        email: req.user!.email,
        ...updates,
      });

      return res.json({
        success: true,
        data: profile,
        message: 'Profile updated successfully.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getDashboardSummary(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await db.getProfile(userId);
      const analyses = await db.getResumeAnalyses(userId);
      const latestAnalysis = analyses[0] || null;
      const roadmap = await db.getRoadmap(userId);
      const matches = await db.getJobMatches(userId);

      const tasks = roadmap ? roadmap.tasks : [];
      const completedTasks = tasks.filter(t => t.completed);
      const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 5);

      const summary: DashboardSummary = {
        profile,
        latest_resume_analysis: latestAnalysis,
        career_fit_score: latestAnalysis?.career_fit_score ?? 0,
        identified_skills_count: (latestAnalysis?.extracted_data?.technical_skills?.length || 0) + (profile?.current_skills.length || 0),
        critical_gaps_count: latestAnalysis?.missing_skills?.length || 0,
        completed_tasks_count: completedTasks.length,
        total_tasks_count: tasks.length,
        roadmap_progress_percentage: roadmap ? roadmap.progress_percentage : 0,
        recent_matches_count: matches.length,
        upcoming_tasks: upcomingTasks,
      };

      return res.json({
        success: true,
        data: summary,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deleteAccount(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      await db.deleteUserData(userId);
      return res.json({
        success: true,
        message: 'All personal account data, resume analyses, and conversations have been permanently deleted in accordance with data privacy commitments.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
