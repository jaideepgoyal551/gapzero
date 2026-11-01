import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { CareerRoadmap, RoadmapTask, RoadmapPhase, TaskPriority } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import confetti from 'canvas-confetti';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Filter,
  RefreshCw,
  Target,
  Award,
} from 'lucide-react';

export const CareerRoadmapPage: React.FC = () => {
  const { profile } = useAuth();
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activePhase, setActivePhase] = useState<RoadmapPhase>('30-day');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<CareerRoadmap>('/roadmap');
      setRoadmap(data);
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const res = await apiRequest<{ task: RoadmapTask; progress_percentage: number }>(`/roadmap/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!currentStatus) {
        // Trigger celebratory confetti on completing a task!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });
      }

      if (roadmap) {
        const updatedTasks = roadmap.tasks.map(t =>
          t.id === taskId ? { ...t, completed: !currentStatus, completed_at: !currentStatus ? new Date().toISOString() : undefined } : t
        );
        setRoadmap({
          ...roadmap,
          tasks: updatedTasks,
          progress_percentage: res.progress_percentage,
        });
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleRegenerateRoadmap = async () => {
    setGenerating(true);
    try {
      const data = await apiRequest<CareerRoadmap>('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({
          target_role: profile?.target_role,
          weekly_hours: profile?.weekly_learning_hours,
        }),
      });
      setRoadmap(data);
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const phaseTasks = (roadmap?.tasks || []).filter(t => t.phase === activePhase);
  const filteredTasks = phaseTasks.filter(t => priorityFilter === 'All' || t.priority === priorityFilter);
  const completedCount = (roadmap?.tasks || []).filter(t => t.completed).length;
  const totalCount = (roadmap?.tasks || []).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">Personalized Career Roadmap</h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Structured 30-day, 90-day, and 12-month milestones calibrated for <span className="font-semibold text-brand-700">{roadmap?.target_role || profile?.target_role}</span>
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRegenerateRoadmap}
          loading={generating}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Regenerate Roadmap
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Overall Milestone Progress</span>
            <div className="text-2xl font-bold text-navy-900 mt-0.5">
              {roadmap ? `${roadmap.progress_percentage}% Completed` : 'No roadmap yet'}
            </div>
            <span className="text-xs text-navy-500">
              {roadmap ? `${completedCount} of ${totalCount} total objectives achieved` : 'Generate a roadmap to track your progress'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-navy-600 font-medium">Weekly Capacity:</span>
            <Badge variant="purple">{profile?.weekly_learning_hours ? `${profile.weekly_learning_hours} hrs / week` : 'Weekly capacity not set'}</Badge>
          </div>
        </div>

        {roadmap && <ProgressBar value={roadmap.progress_percentage} size="md" color="brand" />}
      </Card>

      {/* Phase Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-200 pb-2">
        <div className="flex gap-4">
          {[
            { phase: '30-day' as RoadmapPhase, label: '30-Day Plan', desc: 'Quick Wins & Foundations' },
            { phase: '90-day' as RoadmapPhase, label: '90-Day Plan', desc: 'Projects & Interviews' },
            { phase: '12-month' as RoadmapPhase, label: '12-Month Plan', desc: 'Scale & Job Applications' },
          ].map(p => (
            <button
              key={p.phase}
              onClick={() => setActivePhase(p.phase)}
              className={`pb-3 text-left transition-colors border-b-2 font-semibold text-xs sm:text-sm ${
                activePhase === p.phase
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-navy-500 hover:text-navy-900'
              }`}
            >
              <div>{p.label}</div>
              <div className="text-[10px] text-navy-400 font-normal">{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-navy-600">Priority:</span>
          {['All', 'High', 'Medium', 'Low'].map(prio => (
            <button
              key={prio}
              onClick={() => setPriorityFilter(prio)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                priorityFilter === prio
                  ? 'bg-navy-900 text-white font-semibold'
                  : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
              }`}
            >
              {prio}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Card
              key={task.id}
              className={`p-6 transition-all border ${
                task.completed ? 'bg-navy-50/50 border-navy-200' : 'bg-white border-navy-200 hover:shadow-subtle'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id, task.completed)}
                    className="mt-1 w-5 h-5 accent-brand-600 rounded cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3
                        className={`text-base font-bold ${
                          task.completed ? 'line-through text-navy-400' : 'text-navy-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <Badge
                        size="sm"
                        variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'}
                      >
                        {task.priority} Priority
                      </Badge>
                    </div>

                    <p className={`text-xs mt-1.5 leading-relaxed ${task.completed ? 'text-navy-400' : 'text-navy-600'}`}>
                      {task.description}
                    </p>

                    {/* Expected Outcome */}
                    <div className="mt-3 text-xs bg-navy-50/80 p-2.5 rounded-lg text-navy-800 border border-navy-100">
                      <strong className="text-navy-900">Deliverable / Expected Outcome:</strong> {task.expected_outcome}
                    </div>

                    {/* Required Skills & Learning Resources */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {task.required_skills.map((skill, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-medium">
                          {skill}
                        </span>
                      ))}

                      {task.learning_resources && task.learning_resources.length > 0 && (
                        <div className="flex items-center gap-2 ml-2">
                          {task.learning_resources.map((res, i) => (
                            <span key={i} className="text-[11px] text-brand-600 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-brand-500" />
                              {res.url ? (
                                <a href={res.url} target="_blank" rel="noreferrer" className="underline hover:text-brand-800">
                                  {res.title}
                                </a>
                              ) : (
                                <span>{res.title} (Recommended Search)</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className="text-xs text-navy-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.estimated_duration}</span>
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-xs text-navy-500">
            No tasks match the selected filter in this phase.
          </Card>
        )}
      </div>
    </div>
  );
};
