// src/pages/InterviewSetup.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import type { Level, InterviewConfig } from '../types/interview';

const PREDEFINED_FOCUS_AREAS = [
  'React',
  'Javascript',
  'Typescript',
  'CSS',
  'HTML',
  'Frontend Architecture',
  'Mixed',
];

export default function InterviewSetup() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<InterviewConfig>({
    level: 'mid-level',
    focusArea: 'React',
    questionCount: 5,
  });

  const [isCustomFocus, setIsCustomFocus] = useState(false);
  const [customFocusText, setCustomFocusText] = useState('');

  const handleSelectPresetFocus = (area: string) => {
    setIsCustomFocus(false);
    setConfig((prev) => ({ ...prev, focusArea: area }));
  };

  const handleSelectOther = () => {
    setIsCustomFocus(true);
    setConfig((prev) => ({
      ...prev,
      focusArea: customFocusText.trim() || 'General Frontend',
    }));
  };

  const handleCustomTextChange = (text: string) => {
    setCustomFocusText(text);
    setConfig((prev) => ({
      ...prev,
      focusArea: text.trim() || 'General Frontend',
    }));
  };

  const handleStart = () => {
    navigate('/interview', { state: config });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 border border-gray-800 rounded-2xl text-white space-y-8 my-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-linear-to-r from-orange-800 to-purple-400 bg-clip-text text-transparent">
          Setup Your AI Interview
        </h2>
        <p className="text-gray-400 text-sm">
          Configure your session parameters to begin
        </p>
      </div>

      {/* 1. Experience Level */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          1. Experience Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['junior', 'mid-level', 'senior'] as Level[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setConfig({ ...config, level: lvl })}
              className={`p-3 rounded-xl border text-sm capitalize transition-all cursor-pointer ${
                config.level === lvl
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Focus Area */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          2. Focus Area
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PREDEFINED_FOCUS_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => handleSelectPresetFocus(area)}
              className={`p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                !isCustomFocus && config.focusArea === area
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {area}
            </button>
          ))}

          {/* کلید Other */}
          <button
            type="button"
            onClick={handleSelectOther}
            className={`p-3 rounded-xl border text-sm transition-all cursor-pointer ${
              isCustomFocus
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Other...
          </button>
        </div>

        {/* ورودی متنی برای Other */}
        {isCustomFocus && (
          <div className="mt-3">
            <input
              type="text"
              value={customFocusText}
              onChange={(e) => handleCustomTextChange(e.target.value)}
              placeholder="e.g. Next.js, Redux Toolkit, Webpack, Tailwind CSS..."
              className="w-full bg-gray-800 border border-blue-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none text-sm"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* 3. Question Count */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          3. Question Count
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[5, 10, 15].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setConfig({ ...config, questionCount: count })}
              className={`p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                config.questionCount === count
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {count} Questions
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleStart}
        className="w-full py-3.5 text-lg font-semibold cursor-pointer"
      >
        Start Interview Now →
      </Button>
    </div>
  );
}