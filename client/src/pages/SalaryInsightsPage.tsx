import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { SalaryInsightResult } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  DollarSign,
  TrendingUp,
  Globe,
  Briefcase,
  AlertCircle,
  ShieldCheck,
  Building,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const SalaryInsightsPage: React.FC = () => {
  const [role, setRole] = useState('Software Engineer');
  const [country, setCountry] = useState('United States');
  const [industry, setIndustry] = useState('Technology & SaaS');
  const [data, setData] = useState<SalaryInsightResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<SalaryInsightResult>(
        `/salary/insights?role=${encodeURIComponent(role)}&country=${encodeURIComponent(country)}&industry=${encodeURIComponent(industry)}`
      );
      setData(res);
    } catch (err) {
      console.error('Failed to load salary insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [role, country, industry]);

  const chartData = (data?.levels || []).map(l => ({
    level: l.level.split(' ')[0], // e.g. Entry, Mid, Senior, Lead
    Min: l.min,
    Median: l.median,
    Max: l.max,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">Verified Salary Benchmarks</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Explore compensation ranges grounded in official government labor statistics (e.g. U.S. BLS, UK ONS) and verified industry compensation surveys.
        </p>
      </div>

      {/* Filter Control Bar */}
      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Job Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-navy-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-[#121814]"
            >
              <option value="Software Engineer">Software Engineer / Full-Stack</option>
              <option value="Data Scientist">Data Scientist / AI Engineer</option>
              <option value="DevOps">DevOps / Cloud Platform Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Country / Geographic Scope</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-navy-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-[#121814]"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="India">India</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Industry Sector</label>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-navy-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-[#121814]"
            >
              <option value="Technology & SaaS">Technology & SaaS (1.05x)</option>
              <option value="Fintech & Financial Services">Fintech & Financial Services (1.12x)</option>
              <option value="Consulting & Professional Services">Consulting & Services (1.02x)</option>
              <option value="Healthcare & Biotech">Healthcare & Biotech (0.98x)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Salary Overview Cards */}
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.levels.map((lvl, idx) => (
              <Card key={idx} className="p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">{lvl.level}</span>
                  <div className="text-2xl font-extrabold text-navy-950 mt-1">
                    {data.currency_symbol}{lvl.median.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-brand-700 font-medium">Median Base</span>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between text-[11px] text-navy-500">
                  <span>Range:</span>
                  <span className="font-semibold text-navy-800">
                    {data.currency_symbol}{lvl.min.toLocaleString()} – {data.currency_symbol}{lvl.max.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Bar Chart Visualization */}
          <Card className="p-6">
            <h3 className="font-bold text-navy-900 text-sm mb-1">Compensation Progression by Seniority</h3>
            <p className="text-xs text-navy-500 mb-6">Values in {data.currency} ({data.currency_symbol})</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="level" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={v => `${data.currency_symbol}${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: any) => [`${data.currency_symbol}${Number(value).toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="Min" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Median" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Max" fill="#818CF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Transparent Source Disclosures & Limitations */}
          <Card className="p-6 bg-navy-50/60 border border-navy-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verifiable Methodology & Source Disclosures</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-navy-700 pt-1">
              <div>
                <strong className="block text-navy-900">Primary Data Source:</strong>
                {data.data_source}
              </div>
              <div>
                <strong className="block text-navy-900">Survey Date:</strong>
                {data.source_date}
              </div>
              <div>
                <strong className="block text-navy-900">Statistical Confidence:</strong>
                <Badge size="sm" variant="success">{data.confidence_rating} Reliability</Badge>
              </div>
            </div>

            <p className="text-[11px] text-navy-500 pt-2 border-t border-navy-200 leading-relaxed">
              <strong>Limitations Disclosure:</strong> {data.limitations_disclosure}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
