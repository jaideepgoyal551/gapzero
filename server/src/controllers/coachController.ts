import { Request, Response } from 'express';
import { db } from '../db/database';
import { getAIProvider } from '../services/ai/aiService';
import { buildCareerCoachSystemPrompt } from '../services/ai/prompts';

export class CoachController {
  static async chatWithCoach(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { message, conversation_id } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a non-empty message for the career coach.',
        });
      }

      let convId = conversation_id;
      if (!convId) {
        const convo = await db.createCoachConversation(userId, message.slice(0, 35) + '...');
        convId = convo.id;
      }

      // Save user message
      await db.addCoachMessage(convId, 'user', message);

      // Load conversation history
      const history = await db.getCoachMessages(convId);
      const conversationHistory = history.slice(-8, -1).map(m => ({
        role: m.sender as 'user' | 'assistant',
        content: m.content,
      }));

      // Gather profile context safely
      const profile = await db.getProfile(userId);
      const analyses = await db.getResumeAnalyses(userId);
      const latestAnalysis = analyses[0];
      const roadmap = await db.getRoadmap(userId);

      const profileSummary = `
Candidate Name: ${profile?.full_name || 'Candidate'}
Current Role: ${profile?.current_role || 'Software Engineer'}
Years of Experience: ${profile?.years_of_experience || 1}
Target Role: ${profile?.target_role || 'Full-Stack Software Engineer'}
Target Companies: ${(profile?.target_companies || []).join(', ')}
Key Current Skills: ${(profile?.current_skills || []).join(', ')}
Critical Missing Gaps: ${latestAnalysis ? latestAnalysis.missing_skills.join(', ') : 'Not yet assessed'}
Roadmap Progress: ${roadmap ? `${roadmap.progress_percentage}% completed` : '0%'}
Career Goals: ${profile?.career_goals || 'Land a competitive engineering position'}
`;

      const systemPrompt = buildCareerCoachSystemPrompt(profileSummary);
      const aiProvider = getAIProvider();

      const coachResponse = await aiProvider.generateText(systemPrompt, message, conversationHistory);

      // Save assistant message
      const savedReply = await db.addCoachMessage(convId, 'assistant', coachResponse);

      return res.json({
        success: true,
        data: {
          conversation_id: convId,
          message: savedReply,
        },
      });
    } catch (err: any) {
      console.error('Career Coach error:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'The AI Career Coach encountered an error.',
      });
    }
  }

  static async getConversations(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const convos = await db.getCoachConversations(userId);
      return res.json({
        success: true,
        data: convos,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getConversationMessages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const messages = await db.getCoachMessages(id);
      return res.json({
        success: true,
        data: messages,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createConversation(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { title } = req.body;
      const convo = await db.createCoachConversation(userId, title || 'New Strategy Session');
      return res.status(201).json({
        success: true,
        data: convo,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
