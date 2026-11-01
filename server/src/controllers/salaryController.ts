import { Request, Response } from 'express';
import { SalaryService } from '../services/salaryService';

export class SalaryController {
  static getSalaryInsights(req: Request, res: Response) {
    try {
      const jobTitle = (req.query.role as string) || 'Software Engineer';
      const country = (req.query.country as string) || 'United States';
      const industry = (req.query.industry as string) || 'Technology & SaaS';

      const data = SalaryService.getSalaryInsights(jobTitle, country, industry);

      return res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to retrieve salary benchmark information.',
      });
    }
  }
}
