import { Request, Response } from 'express';
import { db } from '../db/database';
import { getAIProvider } from '../services/ai/aiService';
import { buildSkillGapPrompt } from '../services/ai/prompts';
import { SkillGapReportSchema } from '../services/ai/schemas';

export class SkillController {
  static async getSkillGap(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await db.getProfile(userId);
      const analyses = await db.getResumeAnalyses(userId);
      const latestAnalysis = analyses[0];

      const targetRole = req.body.target_role || profile?.target_role || 'Full-Stack Software Engineer';
      const currentSkills = req.body.skills || profile?.current_skills || latestAnalysis?.extracted_data?.technical_skills || ['JavaScript', 'HTML/CSS', 'Git'];
      const resumeText = latestAnalysis?.parsed_text || profile?.career_goals || 'Self-motivated developer aiming to advance technical engineering skills.';

      const aiProvider = getAIProvider();
      const { system, user } = buildSkillGapPrompt(currentSkills, resumeText, targetRole);
      const report = await aiProvider.generateJSON(system, user, SkillGapReportSchema);

      return res.json({
        success: true,
        data: report,
      });
    } catch (err: any) {
      console.error('Skill gap error:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to conduct skill gap evaluation.',
      });
    }
  }
}
