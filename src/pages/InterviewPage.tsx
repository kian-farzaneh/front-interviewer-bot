// src/pages/InterviewPage.tsx

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { InterviewConfig, Message, FinalReport } from '../types/interview';
import { getSystemPrompt, getFinalReportPrompt } from '../utils/prompts';
import { Button } from '../components/ui/Button';
import { Send, Loader2 } from 'lucide-react';

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const config = (location.state as InterviewConfig) || {
    level: 'mid-level',
    focusArea: 'React',
    questionCount: 5,
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [scores, setScores] = useState<number[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // شروع مصاحبه و درخواست سوال اول
  useEffect(() => {
    const initInterview = async () => {
      const initialMessages: Message[] = [
        { role: 'system', content: getSystemPrompt(config) },
        {
          role: 'user',
          content: `Hello! I am ready for my ${config.level} ${config.focusArea} interview. Please ask question #1.`,
        },
      ];
      setMessages(initialMessages);
      await streamResponse(initialMessages);
    };

    initInterview();
  }, []);

  // تابع خواندن استریم SSE از API Backend
  const streamResponse = async (chatHistory: Message[]) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: chatHistory,
        }),
      });

      if (!response.ok) throw new Error('API Request Failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let buffer = '';
      let assistantAnswer = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices?.[0]?.delta?.content || '';
              assistantAnswer += text;

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantAnswer,
                };
                return updated;
              });
            } catch (e) {}
          }
        }
      }

      // استخراج نمره لحظه‌ای در صورت وجود الگوی [SCORE: X/10]
      const scoreMatch = assistantAnswer.match(/\[SCORE:\s*(\d+)\/10\]/i);
      if (scoreMatch) {
        setScores((prev) => [...prev, parseInt(scoreMatch[1], 10)]);
      }
    } catch (err) {
      console.error('Streaming error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const updatedHistory = [...messages, userMsg];

    setMessages(updatedHistory);
    setInput('');

    if (currentQuestionIndex < config.questionCount) {
      setCurrentQuestionIndex((prev) => prev + 1);
      await streamResponse(updatedHistory);
    } else {
      // اتمام مصاحبه و تولید گزارش نهایی
      await generateFinalReport(updatedHistory);
    }
  };

  const generateFinalReport = async (finalHistory: Message[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [{ role: 'user', content: getFinalReportPrompt(finalHistory) }],
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let rawContent = '';

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                rawContent += parsed.choices?.[0]?.delta?.content || '';
              } catch (e) {}
            }
          }
        }
      }

      const cleanJson = rawContent.replace(/```json|```/g, '').trim();
      const parsedReport: FinalReport = JSON.parse(cleanJson);

      navigate('/result', { state: parsedReport });
    } catch (error) {
      console.error('Error generating final report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentAverageScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : 'N/A';

  const progressPercent = Math.min(
    (currentQuestionIndex / config.questionCount) * 100,
    100
  );

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden my-4 text-white">
      {/* Header Info */}
      <div className="p-4 border-b border-gray-800 bg-gray-950/60 flex justify-between items-center text-sm">
        <div className="flex gap-6 items-center">
          <div>
            <span className="text-gray-400">Question: </span>
            <span className="font-semibold text-white">
              {currentQuestionIndex} / {config.questionCount}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Avg Score: </span>
            <span className="font-semibold text-blue-400">
              {currentAverageScore} / 10
            </span>
          </div>
        </div>
        <div className="w-1/3 bg-gray-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((m) => m.role !== 'system')
          .map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-gray-800 text-gray-200 border border-gray-700/80 rounded-bl-none'
                }`}
              >
                {msg.content || (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>AI is typing...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-gray-800 bg-gray-950/60 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your technical answer here..."
          disabled={isLoading}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
        />
        <Button onClick={handleSend} disabled={isLoading} className="cursor-pointer">
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}