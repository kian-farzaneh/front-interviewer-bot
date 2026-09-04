// src/pages/ResultPage.tsx

import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import type { FinalReport } from "../types/interview";
import { Button } from "../components/ui/Button";
import { Award, CheckCircle2, XCircle, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ResultPageProps {
  isDark?: boolean;
}

const faFormatter = new Intl.NumberFormat("fa-IR");

export default function ResultPage() {
  const { isDark } = useOutletContext<ResultPageProps>();
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state as FinalReport;
  const { t, i18n } = useTranslation();

  const formatNumber = (num: number | string) => {
    if (num === "N/A" || num === undefined || num === null) return num;
    if (i18n.language.startsWith("fa")) {
      const parsed = Number(num);
      if (!isNaN(parsed)) {
        return faFormatter.format(parsed);
      }
      return String(num).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
    }
    return String(num);
  };

  if (!report) {
    return (
      <div
        className={`text-center p-12 space-y-4 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        <p className={isDark ? "text-gray-400" : "text-slate-800"}>
          {t("result.noResult")}
        </p>
        <Button onClick={() => navigate("/setup")}>
          {t("result.startNew")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto space-y-6 p-6 my-6 transition-colors ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Overall Score */}
      <div
        className={`rounded-2xl p-8 text-center space-y-3 relative overflow-hidden border transition-colors ${
          isDark
            ? "bg-gray-900 border-gray-800"
            : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-xl shadow-slate-200/50"
        }`}
      >
        <Award
          className={`w-12 h-12 mx-auto ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}
        />
        <h1
          className={`${isDark ? "text-gray-400" : "text-slate-500"} ${
            i18n.language.startsWith("fa")
              ? "text-3xl font-bold"
              : "text-lg font-medium"
          }`}
        >
          {t("result.overallPerformance")}
        </h1>
        <p className="text-6xl font-extrabold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {formatNumber(report.overallScore)}
        </p>
        <p
          className={`text-sm max-w-xl mx-auto leading-relaxed pt-2 ${
            isDark ? "text-gray-300" : "text-slate-600"
          }`}
        >
          {report.summary}
        </p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div
          className={`rounded-2xl p-6 space-y-4 border transition-colors ${
            isDark
              ? "bg-gray-900 border-gray-800"
              : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-md shadow-slate-100"
          }`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-lg ${
              isDark ? "text-green-400" : "text-green-600"
            }`}
          >
            <CheckCircle2 size={20} />
            <h3>{t("result.strengths")}</h3>
          </div>
          <ul
            className={`space-y-2.5 text-sm ${
              isDark ? "text-gray-300" : "text-slate-600"
            }`}
          >
            {report.strengths?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span
                  className={
                    isDark
                      ? "text-green-400 font-bold"
                      : "text-green-600 font-bold"
                  }
                >
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div
          className={`rounded-2xl p-6 space-y-4 border transition-colors ${
            isDark
              ? "bg-gray-900 border-gray-800"
              : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-md shadow-slate-100"
          }`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-lg ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            <XCircle size={20} />
            <h3>{t("result.weaknesses")}</h3>
          </div>
          <ul
            className={`space-y-2.5 text-sm ${
              isDark ? "text-gray-300" : "text-slate-600"
            }`}
          >
            {report.weaknesses?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span
                  className={
                    isDark ? "text-red-400 font-bold" : "text-red-600 font-bold"
                  }
                >
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dynamic Skill Breakdown */}
      <div
        className={`rounded-2xl p-6 space-y-6 border transition-colors ${
          isDark
            ? "bg-gray-900 border-gray-800"
            : "bg-white/70 backdrop-blur-xl border-slate-200/90 shadow-md shadow-slate-100"
        }`}
      >
        <div
          className={`flex items-center gap-2 font-bold text-lg ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`}
        >
          <BarChart2 size={20} />
          <h3>{t("result.skillBreakdown")}</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(report.skillBreakdown || {}).map(([skill, value]) => (
            <div key={skill} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span
                  className={`font-medium ${
                    isDark ? "text-gray-200" : "text-slate-700"
                  }`}
                >
                  {skill}
                </span>
                <span
                  className={`font-semibold ${
                    isDark ? "text-purple-300" : "text-purple-600"
                  }`}
                >
                  {formatNumber(value)}%
                </span>
              </div>
              <div
                className={`w-full h-2.5 rounded-full overflow-hidden ${
                  isDark ? "bg-gray-800" : "bg-white/40"
                }`}
              >
                <div
                  className="bg-linear-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => navigate("/setup")}
        className="w-full py-3.5 text-base cursor-pointer"
      >
        {t("result.startAnother")}
      </Button>
    </div>
  );
}
