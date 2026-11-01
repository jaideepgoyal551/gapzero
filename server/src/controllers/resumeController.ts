import { Request, Response } from 'express';
import { db } from '../db/database';
import { FileParserService } from '../services/fileParser';
import { getAIProvider } from '../services/ai/aiService';
import { buildResumeAnalysisPrompt } from '../services/ai/prompts';
import { ResumeAnalysisSchema } from '../services/ai/schemas';
import { ResumeAnalysis } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';

export class ResumeController {
  static async analyzeResume(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'Please upload a resume file (PDF or DOCX).',
        });
      }

      const targetRole = req.body.target_role?.trim() || 'Software Engineer';

      // Extract text safely
      const parsedDoc = await FileParserService.extractText(file);

      // AI Analysis
      const aiProvider = getAIProvider();
      const { system, user } = buildResumeAnalysisPrompt(parsedDoc.text, targetRole);
      const aiResult = await aiProvider.generateJSON(system, user, ResumeAnalysisSchema);

      const analysis: ResumeAnalysis = {
        id: uuidv4(),
        user_id: userId,
        filename: file.originalname,
        file_size: file.size,
        parsed_text: parsedDoc.text.slice(0, 15000), // retain cleaned text for context
        target_role: targetRole,
        overall_score: aiResult.overall_score,
        career_fit_score: aiResult.career_fit_score,
        ats_score: aiResult.ats_score,
        extracted_data: aiResult.extracted_data,
        strongest_skills: aiResult.strongest_skills,
        missing_skills: aiResult.missing_skills,
        important_weaknesses: aiResult.important_weaknesses,
        experience_relevance: aiResult.experience_relevance,
        project_relevance: aiResult.project_relevance,
        recommended_improvements: aiResult.recommended_improvements,
        suggested_next_steps: aiResult.suggested_next_steps,
        scoring_rationale: aiResult.scoring_rationale,
        created_at: new Date().toISOString(),
      };

      await db.saveResumeAnalysis(analysis);

      // Also sync skills into profile if empty
      const profile = await db.getProfile(userId);
      if (profile && profile.current_skills.length === 0 && aiResult.extracted_data.technical_skills.length > 0) {
        await db.saveProfile({
          id: userId,
          current_skills: aiResult.extracted_data.technical_skills.slice(0, 15),
          target_role: targetRole,
        });
      }

      return res.status(201).json({
        success: true,
        data: analysis,
        warning: parsedDoc.isScannedWarning ? 'Document contained few words; consider using a more detailed resume for higher precision.' : undefined,
      });
    } catch (err: any) {
      console.error('Resume Analysis Error:', err.message);
      return res.status(400).json({
        success: false,
        error: err.message || 'Failed to analyze resume document.',
      });
    }
  }

  static async getAnalyses(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const analyses = await db.getResumeAnalyses(userId);
      return res.json({
        success: true,
        data: analyses,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getAnalysisById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const analysis = await db.getResumeAnalysisById(userId, id);

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'Resume analysis record not found.',
        });
      }

      return res.json({
        success: true,
        data: analysis,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deleteAnalysis(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await db.deleteResumeAnalysis(userId, id);
      return res.json({
        success: true,
        message: 'Resume analysis deleted successfully.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
