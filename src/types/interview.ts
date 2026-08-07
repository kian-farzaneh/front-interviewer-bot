// src/types/interview.ts

export type Level = 'junior' | 'mid-level' | 'senior';

export type FocusArea = string;

export interface InterviewConfig {
  level: Level;
  focusArea: FocusArea;
  questionCount: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface FinalReport {
  overallScore: string; 
  strengths: string[];
  weaknesses: string[];
  skillBreakdown: Record<string, number>; 
  summary: string;
}