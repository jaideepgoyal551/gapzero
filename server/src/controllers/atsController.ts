import { Request, Response } from 'express';
import { db } from '../db/database';
import { getAIProvider } from '../services/ai/aiService';
import { buildATSOptimizerPrompt } from '../services/ai/prompts';
import { ATSOptimizationSchema } from '../services/ai/schemas';

export class ATSController {
  static async optimizeATS(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { target_job_title, job_description, custom_resume_text } = req.body;

      let resumeText = custom_resume_text;
      if (!resumeText) {
        const analyses = await db.getResumeAnalyses(userId);
        resumeText = analyses[0]?.parsed_text;
      }

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          error: 'Please upload a resume first or provide your resume text for ATS evaluation.',
        });
      }

      const targetTitle = target_job_title?.trim() || 'Software Engineer';

      const aiProvider = getAIProvider();
      const { system, user } = buildATSOptimizerPrompt(resumeText, targetTitle, job_description);
      const result = await aiProvider.generateJSON(system, user, ATSOptimizationSchema);

      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      console.error('ATS Optimization error:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to process ATS optimization.',
      });
    }
  }
}
