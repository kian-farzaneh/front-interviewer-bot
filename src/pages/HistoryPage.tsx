// src/pages/HistoryPage.tsx

import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { HistoryItem } from "../types/interview";
import { Button } from "../components/ui/Button";
import {
  History,
  Trash2,
  ExternalLink,
  Award,
  Calendar,
  BarChart2,
  TrendingUp,
  Inbox,
} from "lucide-react";

interface HistoryPageProps {
  isDark?: boolean;
}

const faFormatter = new Intl.NumberFormat("fa-IR");

export default function HistoryPage() {
  const { isDark } = useOutletContext<HistoryPageProps>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const isFa = i18n.language.startsWith("fa");

  useEffect(() => {
    const raw = localStorage.getItem("interview_history");
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch (err) {
        console.error("Failed to parse history data", err);
      }
    }
  }, []);

  const formatNumber = (num: number | string) => {
    if (num === "N/A" || num === undefined || num === null) return num;
    if (isFa) {
      const parsed = Number(num);
      return isNaN(parsed)
        ? String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])
        : faFormatter.format(parsed);
    }
    return String(num);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isFa) {
      return new Intl.DateTimeFormat("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleDelete = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("interview_history", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm(t("history.confirmClear"))) {
      setHistory([]);
      localStorage.removeItem("interview_history");
    }
  };

  // محاسبه آمارهای تجمیعی
  const validScores = history
    .map((h) => Number(h.report?.overallScore))
    .filter((n) => !isNaN(n));

  const averageScore = validScores.length
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : "0";

  const bestScore = validScores.length ? Math.max(...validScores) : "0";

  return (
    <div
      className={`max-w-4xl mx-auto space-y-6 p-6 my-6 transition-colors ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <History
              className={`w-7 h-7 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
            <h1 className="text-2xl font-bold">{t("history.title")}</h1>
          </div>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-slate-500"
            }`}
          >
            {t("history.subtitle")}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border cursor-pointer ${
              isDark
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            <Trash2 size={14} />
            {t("history.clearAll")}
          </button>
        )}
      </div>

      {/* Overview Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`rounded-2xl p-4 border transition-colors flex items-center gap-3.5 ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-xs"
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                isDark
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <BarChart2 size={22} />
            </div>
            <div>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-slate-500"
                }`}
              >
                {t("history.stats.total")}
              </p>
              <p className="text-xl font-bold">
                {formatNumber(history.length)}
              </p>
            </div>
          </div>

          <div
            className={`rounded-2xl p-4 border transition-colors flex items-center gap-3.5 ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-xs"
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                isDark
                  ? "bg-purple-500/10 text-purple-400"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              <TrendingUp size={22} />
            </div>
            <div>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-slate-500"
                }`}
              >
                {t("history.stats.avgScore")}
              </p>
              <p className="text-xl font-bold">
                {formatNumber(averageScore)} / {formatNumber(100)}
              </p>
            </div>
          </div>

          <div
            className={`rounded-2xl p-4 border transition-colors flex items-center gap-3.5 ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-xs"
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                isDark
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <Award size={22} />
            </div>
            <div>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-slate-500"
                }`}
              >
                {t("history.stats.bestScore")}
              </p>
              <p className="text-xl font-bold">
                {formatNumber(bestScore)} / {formatNumber(100)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div
          className={`text-center py-16 px-4 rounded-2xl border space-y-4 ${
            isDark
              ? "bg-gray-900 border-gray-800 text-gray-400"
              : "bg-white/70 backdrop-blur-xl border-slate-200 text-slate-600 shadow-sm"
          }`}
        >
          <Inbox
            className={`w-14 h-14 mx-auto stroke-1 ${
              isDark ? "text-gray-600" : "text-slate-400"
            }`}
          />
          <div className="space-y-1">
            <h3 className="text-base font-semibold">
              {t("history.emptyTitle")}
            </h3>
            <p className="text-sm max-w-sm mx-auto">{t("history.emptyDesc")}</p>
          </div>
          <Button onClick={() => navigate("/setup")} className="cursor-pointer">
            {t("history.startFirst")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark
                  ? "bg-gray-900 border-gray-800 hover:border-gray-700"
                  : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-md shadow-slate-100 hover:border-slate-300"
              }`}
            >
              {/* Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-base">
                    {item.config?.focusArea || "Frontend"}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      isDark
                        ? "bg-blue-900/40 text-blue-300 border border-blue-700/50"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {item.config?.level}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs ${
                      isDark ? "text-gray-500" : "text-slate-400"
                    }`}
                  >
                    <Calendar size={13} />
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <p
                  className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${
                    isDark ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  {item.report?.summary}
                </p>
              </div>

              {/* Score & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800/40">
                <div className="text-center px-2">
                  <span
                    className={`text-2xl font-black ${
                      Number(item.report?.overallScore) >= 80
                        ? "text-emerald-500"
                        : Number(item.report?.overallScore) >= 50
                          ? "text-amber-500"
                          : "text-rose-500"
                    }`}
                  >
                    {formatNumber(item.report?.overallScore)}
                  </span>
                  <span
                    className={`text-xs block ${
                      isDark ? "text-gray-500" : "text-slate-400"
                    }`}
                  >
                    / {formatNumber(100)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => navigate("/result", { state: item.report })}
                    className="flex items-center gap-1.5 py-2 px-3 text-xs cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>{t("history.viewReport")}</span>
                  </Button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className={`p-2 rounded-xl transition-colors border cursor-pointer ${
                      isDark
                        ? "border-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                        : "border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                    }`}
                    title={t("history.deleteItem")}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
