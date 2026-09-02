// src/pages/InterviewPage.tsx

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import type { InterviewConfig, Message, FinalReport } from "../types/interview";
import { getSystemPrompt, getFinalReportPrompt } from "../utils/prompts";
import { getSystemPromptFa, getFinalReportPromptFa } from "../utils/prompts.fa";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Send, Loader2 } from "lucide-react";

const faFormatter = new Intl.NumberFormat("fa-IR");
interface InterviewPageProps {
  isDark?: boolean;
}
export default function InterviewPage() {
  const { isDark } = useOutletContext<InterviewPageProps>();
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  const formatNumber = (num: number | string) => {
    if (num === "N/A") return num;
    if (i18n.language.startsWith("fa")) {
      const parsed = Number(num);
      return isNaN(parsed) ? num : faFormatter.format(parsed);
    }
    return String(num);
  };

  const config = (location.state as InterviewConfig) || {
    level: "mid-level",
    focusArea: "React",
    questionCount: 5,
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [scores, setScores] = useState<number[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isFa = i18n.language.startsWith("fa");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // شروع مصاحبه و درخواست سوال اول
  useEffect(() => {
    const initInterview = async () => {
      const isFa = i18n.language.startsWith("fa");
      const systemPromptText = isFa
        ? getSystemPromptFa(config)
        : getSystemPrompt(config);
      const initialMessages: Message[] = [
        { role: "system", content: systemPromptText },
        {
          role: "user",
          content: t("interview.initialUserMessage", {
            level: config.level,
            focusArea: config.focusArea,
          }),
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: chatHistory,
        }),
      });

      if (!response.ok) throw new Error("API Request Failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let buffer = "";
      let assistantAnswer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices?.[0]?.delta?.content || "";
              assistantAnswer += text;

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantAnswer,
                };
                return updated;
              });
            } catch (e) {}
          }
        }
      }
      const scoreMatch = assistantAnswer.match(/\[SCORE:\s*(\d+)\/10\]/i);
      if (scoreMatch) {
        setScores((prev) => [...prev, parseInt(scoreMatch[1], 10)]);
      }
    } catch (err) {
      console.error("Streaming error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    const updatedHistory = [...messages, userMsg];

    setMessages(updatedHistory);
    setInput("");

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

    const isFa = i18n.language.startsWith("fa");
    const reportPrompt = isFa
      ? getFinalReportPromptFa(finalHistory)
      : getFinalReportPrompt(finalHistory);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: reportPrompt }],
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let rawContent = "";

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const data = trimmed.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                rawContent += parsed.choices?.[0]?.delta?.content || "";
              } catch (e) {}
            }
          }
        }
      }

      const cleanJson = rawContent.replace(/```json|```/g, "").trim();
      const parsedReport: FinalReport = JSON.parse(cleanJson);

      navigate("/result", { state: parsedReport });
    } catch (error) {
      console.error("Error generating final report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentAverageScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "N/A";

  const progressPercent = Math.min(
    (currentQuestionIndex / config.questionCount) * 100,
    100,
  );

  return (
    <div
      className={`max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)] rounded-2xl overflow-hidden my-4 border transition-colors ${
        isDark
          ? "bg-gray-900 border-gray-800 text-white"
          : "bg-white/65 backdrop-blur-xl border-slate-200/90 shadow-xl shadow-slate-200/60 text-slate-900"
      }`}
    >
      {/* Header Info */}
      <div
        className={`p-4 border-b flex justify-between items-center text-sm transition-colors ${
          isDark
            ? "border-gray-800 bg-gray-950/60"
            : "border-slate-100 bg-slate-50/80"
        }`}
      >
        <div className="flex gap-6 items-center">
          <div>
            <span className={isDark ? "text-gray-400" : "text-slate-500"}>
              {t("interview.questionLabel", { defaultValue: "Question:" })}{" "}
            </span>
            <span
              dir="ltr"
              className={`font-semibold ${
                isDark ? "text-white" : "text-slate-600"
              }`}
            >
              {formatNumber(currentQuestionIndex)} /{" "}
              {formatNumber(config.questionCount)}
            </span>
          </div>
          <div>
            <span className={isDark ? "text-gray-400" : "text-slate-500"}>
              {t("interview.avgScoreLabel", {
                defaultValue: "Avg Score:",
              })}{" "}
            </span>
            <span
              dir="ltr"
              className={`font-semibold ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {formatNumber(currentAverageScore)} / {formatNumber(10)}
            </span>
          </div>
        </div>
        <div
          className={`w-1/3 h-2.5 rounded-full overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-slate-300"
          }`}
        >
          <div
            className="bg-linear-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Chat Container */}
      <div
        dir="ltr"
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
      >
        {messages
          .filter((m) => m.role !== "system")
          .map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                dir={isFa ? "rtl" : "ltr"}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none shadow-md"
                    : isDark
                      ? "bg-gray-800 text-gray-200 border border-gray-700/80 rounded-bl-none"
                      : "bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs"
                }`}
              >
                {msg.content || (
                  <div
                    className={`flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>{t("interview.aiTyping")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div
        dir="ltr"
        className={`p-4 border-t flex gap-3 transition-colors ${
          isDark
            ? "border-gray-800 bg-gray-950/60"
            : "border-slate-100 bg-slate-50/80"
        }`}
      >
        <textarea
          ref={textareaRef}
          dir={isFa ? "rtl" : "ltr"}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("interview.inputPlaceholder")}
          disabled={isLoading}
          className={`overflow-y-auto flex-1 max-h-36 min-h-11 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none transition-colors border ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              : "bg-gray-300 border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs focus:bg-white"
          }`}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className="cursor-pointer"
        >
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
