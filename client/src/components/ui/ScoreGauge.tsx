import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'Fit Score',
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  let color = '#cf6b78';
  let tier = 'Needs Work';
  if (clampedScore >= 85) {
    color = '#d58a57';
    tier = 'Exceptional';
  } else if (clampedScore >= 70) {
    color = '#bd6572';
    tier = 'Strong Match';
  } else if (clampedScore >= 50) {
    color = '#f09a52';
    tier = 'Moderate Fit';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#414148"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-navy-900 tracking-tight">{clampedScore}</span>
          <span className="text-[11px] font-semibold text-navy-500 uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-sm font-semibold text-navy-800">{label}</span>
        <div className="text-xs font-medium mt-0.5" style={{ color }}>
          {sublabel || tier}
        </div>
      </div>
    </div>
  );
};
