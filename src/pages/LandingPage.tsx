// src/pages/LandingPage.tsx

import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Sparkles, Target, Award, Zap } from "lucide-react";

interface LandingPageProps {
  isDark: boolean;
}

export default function LandingPage({ isDark }: LandingPageProps) {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto text-center">
      {/* Hero */}
      <div className="space-y-6 pb-20">
        <div
          className={`inline-flex items-center gap-2  px-4 py-2 rounded-full  ${isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}
        >
          <Sparkles size={17} />
          <span className="text-sm">AI-Powered Interview Coach</span>
        </div>
        <h1
          className={`text-6xl font-bold bg-linear-to-r bg-clip-text text-transparent ${isDark ? " from-blue-400 to-purple-400" : "from-blue-800 to-purple-700"}`}
        >
          Master Frontend Interviews
        </h1>
        <p className={`text-xl ${isDark?"text-gray-400":"text-gray-800"} max-w-2xl mx-auto`}>
          Practice with AI, get instant feedback, and land your dream job
        </p>
        <Button
          className="animate-pulse cursor-pointer"
          size="lg"
          onClick={() => navigate("/setup")}
        >
          Start Free Practice →
        </Button>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Target,
            title: "Real Questions",
            desc: "Based on actual frontend interviews",
          },
          {
            icon: Zap,
            title: "Instant Feedback",
            desc: "Score & improvement tips after each answer",
          },
          {
            icon: Award,
            title: "Smart Reports",
            desc: "Strengths, weaknesses & learning path",
          },
        ].map((feat, i) => (
          <div
            key={i}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center"
          >
            <feat.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${isDark?"text-cyan-800":"text-cyan-600"}`}>
              {feat.title}
            </h3>
            <p className="text-gray-400">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
