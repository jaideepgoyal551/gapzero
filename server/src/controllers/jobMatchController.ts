import { Request, Response } from 'express';
import { db } from '../db/database';
import { getAIProvider } from '../services/ai/aiService';
import { buildJobMatchPrompt } from '../services/ai/prompts';
import { JobMatchSchema } from '../services/ai/schemas';
import { JobMatchResult } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';

export class JobMatchController {
  static async analyzeJob(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { job_title, company_name, job_description } = req.body;

      if (!job_title || !job_description || job_description.trim().length < 50) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a job title and detailed job description (at least 50 characters).',
        });
      }

      const profile = await db.getProfile(userId);
      const analyses = await db.getResumeAnalyses(userId);
      const latestAnalysis = analyses[0];

      const candidateBackground = `
Role: ${profile?.current_role || 'Developer'}
Skills: ${(profile?.current_skills || []).join(', ')}
Resume Excerpt: ${latestAnalysis?.parsed_text ? latestAnalysis.parsed_text.slice(0, 5000) : 'Technical experience with React, TypeScript, Git, and web technologies.'}
`;

      const aiProvider = getAIProvider();
      const { system, user } = buildJobMatchPrompt(candidateBackground, job_title, job_description);
      const aiResult = await aiProvider.generateJSON(system, user, JobMatchSchema);

      const jobMatch: JobMatchResult = {
        id: uuidv4(),
        user_id: userId,
        job_title,
        company_name: company_name || 'Unspecified Company',
        job_description,
        match_percentage: aiResult.match_percentage,
        matching_skills: aiResult.matching_skills,
        missing_skills: aiResult.missing_skills,
        matching_experience: aiResult.matching_experience,
        missing_experience: aiResult.missing_experience,
        resume_tailoring_suggestions: aiResult.resume_tailoring_suggestions,
        recommended_prep_tasks: aiResult.recommended_prep_tasks,
        created_at: new Date().toISOString(),
      };

      await db.saveJobMatch(jobMatch);

      return res.status(201).json({
        success: true,
        data: jobMatch,
      });
    } catch (err: any) {
      console.error('Job match error:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to match job description.',
      });
    }
  }

  static async getMatches(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const matches = await db.getJobMatches(userId);
      return res.json({
        success: true,
        data: matches,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
