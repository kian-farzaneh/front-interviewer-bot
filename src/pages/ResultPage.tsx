// src/pages/ResultPage.tsx

import { useLocation, useNavigate } from 'react-router-dom';
import type { FinalReport } from '../types/interview';
import { Button } from '../components/ui/Button';
import { Award, CheckCircle2, XCircle, BarChart2 } from 'lucide-react';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state as FinalReport;

  if (!report) {
    return (
      <div className="text-center p-12 text-white space-y-4">
        <p className="text-gray-400">No interview result found.</p>
        <Button onClick={() => navigate('/setup')}>Start New Interview</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white p-6 my-6">
      {/* Overall Score */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-3 relative overflow-hidden">
        <Award className="w-12 h-12 text-blue-400 mx-auto" />
        <h1 className="text-gray-400 text-lg font-medium">Overall Performance</h1>
        <p className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {report.overallScore}
        </p>
        <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed pt-2">
          {report.summary}
        </p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
            <CheckCircle2 size={20} />
            <h3>Strengths</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {report.strengths?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-bold text-lg">
            <XCircle size={20} />
            <h3>Areas for Improvement</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {report.weaknesses?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dynamic Skill Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
          <BarChart2 size={20} />
          <h3>Dynamic Skill Breakdown</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(report.skillBreakdown || {}).map(([skill, value]) => (
            <div key={skill} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-200 font-medium">{skill}</span>
                <span className="text-purple-300 font-semibold">{value}%</span>
              </div>
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => navigate('/setup')} className="w-full py-3.5 text-base cursor-pointer">
        Start Another Interview
      </Button>
    </div>
  );
}