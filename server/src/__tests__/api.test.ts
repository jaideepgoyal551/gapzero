import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { SalaryService } from '../services/salaryService';
import { FileParserService } from '../services/fileParser';

describe('GapZero Backend Test Suite', () => {
  it('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('GapZero API Server');
  });

  it('GET /api/profile retrieves authenticated profile', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', 'Bearer demo-token');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.target_role).toBeDefined();
  });

  it('PATCH /api/profile updates career preferences', async () => {
    const res = await request(app)
      .patch('/api/profile')
      .set('Authorization', 'Bearer demo-token')
      .send({
        target_role: 'Senior Staff Engineer',
        weekly_learning_hours: 15,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.target_role).toBe('Senior Staff Engineer');
    expect(res.body.data.weekly_learning_hours).toBe(15);
  });

  it('GET /api/dashboard/summary returns consolidated metrics', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', 'Bearer demo-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.career_fit_score).toBeDefined();
    expect(res.body.data.upcoming_tasks).toBeInstanceOf(Array);
  });

  it('POST /api/roadmap/generate creates a 3-phase career roadmap', async () => {
    const res = await request(app)
      .post('/api/roadmap/generate')
      .set('Authorization', 'Bearer demo-token')
      .send({
        target_role: 'Full-Stack Software Engineer',
        weekly_hours: 10,
        critical_gaps: ['PostgreSQL', 'Docker'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tasks.length).toBeGreaterThan(0);
    expect(res.body.data.tasks[0]).toHaveProperty('phase');
    expect(res.body.data.tasks[0]).toHaveProperty('title');
  });

  it('PATCH /api/roadmap/tasks/:id toggles completion status', async () => {
    // First get active roadmap
    const rmRes = await request(app)
      .get('/api/roadmap')
      .set('Authorization', 'Bearer demo-token');
    
    expect(rmRes.status).toBe(200);
    const taskId = rmRes.body.data.tasks[0].id;

    // Toggle task
    const patchRes = await request(app)
      .patch(`/api/roadmap/tasks/${taskId}`)
      .set('Authorization', 'Bearer demo-token')
      .send({ completed: true });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.success).toBe(true);
    expect(patchRes.body.data.task.completed).toBe(true);
  });

  it('POST /api/skills/gap-analysis evaluates role requirements', async () => {
    const res = await request(app)
      .post('/api/skills/gap-analysis')
      .set('Authorization', 'Bearer demo-token')
      .send({
        target_role: 'Full-Stack Software Engineer',
        skills: ['JavaScript', 'React', 'HTML/CSS'],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.skills.length).toBeGreaterThan(0);
    expect(res.body.data.overall_fit_score).toBeGreaterThanOrEqual(0);
  });

  it('POST /api/ats/optimize returns Google X-Y-Z bullet suggestions', async () => {
    const res = await request(app)
      .post('/api/ats/optimize')
      .set('Authorization', 'Bearer demo-token')
      .send({
        target_job_title: 'Full-Stack Engineer',
        custom_resume_text: 'Built React components and worked on backend APIs for user auth.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bullet_point_improvements.length).toBeGreaterThan(0);
    expect(res.body.data.target_keywords).toBeInstanceOf(Array);
  });

  it('POST /api/jobs/analyze compares requirements and flags gaps', async () => {
    const res = await request(app)
      .post('/api/jobs/analyze')
      .set('Authorization', 'Bearer demo-token')
      .send({
        job_title: 'Senior Frontend Developer',
        company_name: 'Stripe',
        job_description: 'We are seeking a senior frontend engineer with deep React and TypeScript expertise to build high-scale payment components and improve web performance.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.matching_skills).toBeInstanceOf(Array);
    expect(res.body.data.match_percentage).toBeGreaterThan(0);
  });

  it('POST /api/coach/chat generates career mentoring response', async () => {
    const res = await request(app)
      .post('/api/coach/chat')
      .set('Authorization', 'Bearer demo-token')
      .send({
        message: 'How should I structure my study plan for system design interviews?',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message.content.length).toBeGreaterThan(10);
    expect(res.body.data.conversation_id).toBeDefined();
  });

  it('SalaryService queries verified benchmark statistics with disclosures', () => {
    const result = SalaryService.getSalaryInsights('Software Engineer', 'United States');
    expect(result.country).toBe('United States');
    expect(result.currency).toBe('USD');
    expect(result.levels.length).toBe(4);
    expect(result.data_source).toContain('Bureau of Labor Statistics');
    expect(result.limitations_disclosure).toBeDefined();
  });

  it('FileParserService rejects empty or non-document files', async () => {
    const fakeFile = {
      buffer: Buffer.from(''),
      originalname: 'empty.pdf',
      mimetype: 'application/pdf',
    } as any;

    await expect(FileParserService.extractText(fakeFile)).rejects.toThrow('empty or corrupted');
  });
});
