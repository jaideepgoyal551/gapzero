import { Request, Response } from 'express';
import { db } from '../db/database';
import { getAIProvider } from '../services/ai/aiService';
import { buildLinkedInOptimizerPrompt } from '../services/ai/prompts';
import { LinkedInOptimizationSchema } from '../services/ai/schemas';
import { LinkedInOptimization } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';

export class LinkedInController {
  static async analyzeLinkedIn(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await db.getProfile(userId);
      const analyses = await db.getResumeAnalyses(userId);
      const latestAnalysis = analyses[0];

      const targetRole = req.body.target_role || profile?.target_role || 'Full-Stack Software Engineer';
      const profileText = `
Name: ${profile?.full_name || 'Candidate'}
Current Role: ${profile?.current_role || 'Software Engineer'}
Skills: ${(profile?.current_skills || []).join(', ')}
Summary: ${latestAnalysis?.extracted_data?.summary || profile?.career_goals || 'Dedicated engineer seeking to build scalable applications.'}
`;

      const aiProvider = getAIProvider();
      const { system, user } = buildLinkedInOptimizerPrompt(profileText, targetRole);
      const aiResult = await aiProvider.generateJSON(system, user, LinkedInOptimizationSchema);

      const optimization: LinkedInOptimization = {
        id: uuidv4(),
        user_id: userId,
        target_role: targetRole,
        headline_suggestions: aiResult.headline_suggestions,
        improved_about: aiResult.improved_about,
        experience_improvements: aiResult.experience_improvements,
        recommended_skills: aiResult.recommended_skills,
        relevant_keywords: aiResult.relevant_keywords,
        networking_and_content_strategy: aiResult.networking_and_content_strategy,
        created_at: new Date().toISOString(),
      };

      await db.saveLinkedInAnalysis(optimization);

      return res.json({
        success: true,
        data: optimization,
      });
    } catch (err: any) {
      console.error('LinkedIn optimization error:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate LinkedIn profile optimization.',
      });
    }
  }

  static async getLatestAnalysis(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const latest = await db.getLatestLinkedInAnalysis(userId);
      return res.json({
        success: true,
        data: latest,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
