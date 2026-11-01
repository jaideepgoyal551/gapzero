import { Request, Response } from 'express';
import { db } from '../db/database';
import { GitHubService } from '../services/githubService';

export class GitHubController {
  static async analyzeGitHub(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { github_url, username: inputUsername } = req.body;

      const profile = await db.getProfile(userId);
      const targetRole = profile?.target_role || 'Full-Stack Software Engineer';
      const targetInput = inputUsername || github_url || profile?.github_url;

      if (!targetInput) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a GitHub username or profile URL.',
        });
      }

      const analysis = await GitHubService.analyzeProfile(userId, targetInput, targetRole);
      await db.saveGitHubAnalysis(analysis);

      // Save github_url in profile if not set
      if (!profile?.github_url) {
        await db.saveProfile({
          id: userId,
          github_url: `https://github.com/${analysis.username}`,
        });
      }

      return res.json({
        success: true,
        data: analysis,
      });
    } catch (err: any) {
      console.error('GitHub analysis error:', err.message);
      return res.status(400).json({
        success: false,
        error: err.message || 'Failed to inspect GitHub portfolio.',
      });
    }
  }

  static async getLatestAnalysis(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const latest = await db.getLatestGitHubAnalysis(userId);
      return res.json({
        success: true,
        data: latest,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
