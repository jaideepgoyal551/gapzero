import { Request, Response } from 'express';
import { db } from '../db/database';
import { getAIProvider } from '../services/ai/aiService';
import { buildRoadmapPrompt } from '../services/ai/prompts';
import { CareerRoadmapSchema } from '../services/ai/schemas';
import { CareerRoadmap, RoadmapTask } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';

export class RoadmapController {
  static async generateRoadmap(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await db.getProfile(userId);
      const analyses = await db.getResumeAnalyses(userId);
      const latestAnalysis = analyses[0];

      const targetRole = req.body.target_role || profile?.target_role || 'Full-Stack Software Engineer';
      const weeklyHours = req.body.weekly_hours || profile?.weekly_learning_hours || 10;
      const criticalGaps = req.body.critical_gaps || latestAnalysis?.missing_skills || ['Relational Databases', 'System Architecture', 'Automated Testing'];

      const backgroundSummary = `
Candidate Current Role: ${profile?.current_role || 'Junior Developer'}
Years of Experience: ${profile?.years_of_experience || 1}
Existing Skills: ${(profile?.current_skills || []).join(', ')}
Target Companies: ${(profile?.target_companies || []).join(', ')}
Career Goals: ${profile?.career_goals || 'Land a competitive mid-level engineering role'}
Latest Resume Highlights: ${latestAnalysis ? latestAnalysis.strongest_skills.join(', ') : 'Solid frontend and programming basics'}
`;

      const aiProvider = getAIProvider();
      const { system, user } = buildRoadmapPrompt(backgroundSummary, targetRole, criticalGaps, weeklyHours);
      const aiResult = await aiProvider.generateJSON(system, user, CareerRoadmapSchema);

      const roadmapId = uuidv4();
      const tasks: RoadmapTask[] = aiResult.tasks.map(t => ({
        id: uuidv4(),
        roadmap_id: roadmapId,
        phase: t.phase,
        title: t.title,
        description: t.description,
        priority: t.priority,
        estimated_duration: t.estimated_duration,
        required_skills: t.required_skills,
        learning_resources: t.learning_resources,
        expected_outcome: t.expected_outcome,
        completed: false,
      }));

      const roadmap: CareerRoadmap = {
        id: roadmapId,
        user_id: userId,
        target_role: targetRole,
        tasks,
        progress_percentage: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.saveRoadmap(roadmap);

      return res.status(201).json({
        success: true,
        data: roadmap,
      });
    } catch (err: any) {
      console.error('Roadmap generation error:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate career roadmap.',
      });
    }
  }

  static async getRoadmap(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      let roadmap = await db.getRoadmap(userId);

      // If user doesn't have a roadmap yet, generate an initial one automatically
      if (!roadmap) {
        const profile = await db.getProfile(userId);
        const targetRole = profile?.target_role || 'Full-Stack Software Engineer';
        const aiProvider = getAIProvider();
        const { system, user } = buildRoadmapPrompt('New candidate profile initialized.', targetRole, ['Database Design', 'System Architecture'], 10);
        const aiResult = await aiProvider.generateJSON(system, user, CareerRoadmapSchema);

        const roadmapId = uuidv4();
        const tasks: RoadmapTask[] = aiResult.tasks.map(t => ({
          id: uuidv4(),
          roadmap_id: roadmapId,
          phase: t.phase,
          title: t.title,
          description: t.description,
          priority: t.priority,
          estimated_duration: t.estimated_duration,
          required_skills: t.required_skills,
          learning_resources: t.learning_resources,
          expected_outcome: t.expected_outcome,
          completed: false,
        }));

        roadmap = {
          id: roadmapId,
          user_id: userId,
          target_role: targetRole,
          tasks,
          progress_percentage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await db.saveRoadmap(roadmap);
      }

      return res.json({
        success: true,
        data: roadmap,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { completed } = req.body;

      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Please specify boolean "completed" status.',
        });
      }

      const task = await db.updateRoadmapTask(userId, id, completed);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Roadmap task not found.',
        });
      }

      const updatedRoadmap = await db.getRoadmap(userId);

      return res.json({
        success: true,
        data: {
          task,
          progress_percentage: updatedRoadmap?.progress_percentage || 0,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
