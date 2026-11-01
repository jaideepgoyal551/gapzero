import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { apiLimiter, aiLimiter } from '../middleware/rateLimiter';

import { ProfileController } from '../controllers/profileController';
import { ResumeController } from '../controllers/resumeController';
import { SkillController } from '../controllers/skillController';
import { ATSController } from '../controllers/atsController';
import { RoadmapController } from '../controllers/roadmapController';
import { JobMatchController } from '../controllers/jobMatchController';
import { LinkedInController } from '../controllers/linkedinController';
import { GitHubController } from '../controllers/githubController';
import { CoachController } from '../controllers/coachController';
import { SalaryController } from '../controllers/salaryController';

const router = Router();

// Multer memory upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const name = file.originalname.toLowerCase();

    const hasAllowedExt = allowedExtensions.some(ext => name.endsWith(ext));
    if (allowedMimes.includes(file.mimetype) || hasAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF and DOCX files are supported.'));
    }
  },
});

// Profile & Dashboard Routes
router.get('/profile', requireAuth, ProfileController.getProfile);
router.patch('/profile', requireAuth, ProfileController.updateProfile);
router.get('/dashboard/summary', requireAuth, ProfileController.getDashboardSummary);
router.delete('/profile/data', requireAuth, ProfileController.deleteAccount);

// Resume Analysis Routes
router.post(
  '/resume/analyze',
  requireAuth,
  aiLimiter,
  upload.single('resume'),
  ResumeController.analyzeResume
);
router.get('/resume/analyses', requireAuth, ResumeController.getAnalyses);
router.get('/resume/analyses/:id', requireAuth, ResumeController.getAnalysisById);
router.delete('/resume/analyses/:id', requireAuth, ResumeController.deleteAnalysis);

// Skill Gap Analysis
router.post('/skills/gap-analysis', requireAuth, aiLimiter, SkillController.getSkillGap);

// ATS Optimizer
router.post('/ats/optimize', requireAuth, aiLimiter, ATSController.optimizeATS);

// Career Roadmap Routes
router.post('/roadmap/generate', requireAuth, aiLimiter, RoadmapController.generateRoadmap);
router.get('/roadmap', requireAuth, RoadmapController.getRoadmap);
router.patch('/roadmap/tasks/:id', requireAuth, RoadmapController.updateTask);

// Job Description Matcher Routes
router.post('/jobs/analyze', requireAuth, aiLimiter, JobMatchController.analyzeJob);
router.get('/jobs/matches', requireAuth, JobMatchController.getMatches);

// LinkedIn Optimizer Routes
router.post('/linkedin/analyze', requireAuth, aiLimiter, LinkedInController.analyzeLinkedIn);
router.get('/linkedin/latest', requireAuth, LinkedInController.getLatestAnalysis);

// GitHub Portfolio Analyzer Routes
router.post('/github/analyze', requireAuth, apiLimiter, GitHubController.analyzeGitHub);
router.get('/github/latest', requireAuth, GitHubController.getLatestAnalysis);

// AI Career Coach Routes
router.post('/coach/chat', requireAuth, aiLimiter, CoachController.chatWithCoach);
router.get('/coach/conversations', requireAuth, CoachController.getConversations);
router.get('/coach/conversations/:id', requireAuth, CoachController.getConversationMessages);
router.post('/coach/conversations', requireAuth, CoachController.createConversation);

// Salary Insights Routes (Public / Authenticated)
router.get('/salary/insights', apiLimiter, SalaryController.getSalaryInsights);

export default router;
