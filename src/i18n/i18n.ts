// src/i18n/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      header: {
        readyText: "Ready for next challenge?",
      },
      sidebar: {
        title: "Kian AI Interview",
        home: "Home",
        newInterview: "New Interview",
        history: "History",
        profile: "Profile",
        lastResult: "Last Result",
        settings: "Settings",
        closeMenu: "Close Menu",
      },
      hero: {
        badge: "AI-Powered Interview Coach",
        title: "Master Frontend Interviews",
        description:
          "Practice with AI, get instant feedback, and land your dream job",
        button: "Start Free Practice →",
      },
      features: {
        f1Title: "Real Questions",
        f1Desc: "Based on actual frontend interviews",
        f2Title: "Instant Feedback",
        f2Desc: "Score & improvement tips after each answer",
        f3Title: "Smart Reports",
        f3Desc: "Strengths, weaknesses & learning path",
      },
      setup: {
        title: "Setup Your AI Interview",
        subtitle: "Configure your session parameters to begin",
        levelTitle: "1. Experience Level",
        levels: {
          junior: "Junior",
          "mid-level": "Mid-Level",
          senior: "Senior",
        },
        focusTitle: "2. Focus Area",
        focusAreas: {
          React: "React",
          Javascript: "JavaScript",
          Typescript: "TypeScript",
          CSS: "CSS",
          HTML: "HTML",
          "Frontend Architecture": "Frontend Architecture",
          Mixed: "Mixed",
          other: "Other...",
        },
        otherPlaceholder:
          "e.g. Next.js, Redux Toolkit, Webpack, Tailwind CSS...",
        countTitle: "3. Question Count",
        questionsCount: "{{count}} Questions",
        startButton: "Start Interview Now →",
      },
      interview: {
        questionLabel: "Question:",
        avgScoreLabel: "Avg Score:",
        naScore: "N/A",
        aiTyping: "AI is typing...",
        inputPlaceholder: "Type your technical answer here...",
        initialUserMessage:
          "Hello! I am ready for my {{level}} {{focusArea}} interview. Please ask question #1.",
      },
      result: {
        noResult: "No interview result found.",
        startNew: "Start New Interview",
        overallPerformance: "Overall Performance",
        strengths: "Strengths",
        weaknesses: "Areas for Improvement",
        skillBreakdown: "Dynamic Skill Breakdown",
        startAnother: "Start Another Interview",
      },
      history: {
        title: "Interview History",
        subtitle: "Review and analyze your past mock interview sessions",
        clearAll: "Clear All History",
        confirmClear: "Are you sure you want to clear all history?",
        emptyTitle: "No interview history yet",
        emptyDesc:
          "Complete your first AI mock interview to track progress here.",
        startFirst: "Start Your First Interview",
        viewReport: "View Report",
        deleteItem: "Delete",
        stats: {
          total: "Total Interviews",
          avgScore: "Average Score",
          bestScore: "Best Score",
        },
      },
    },
  },
  fa: {
    translation: {
      header: {
        readyText: "برای چالش بعدی آماده‌ای؟",
      },
      sidebar: {
        title: "کیان اینترویو",
        home: "صفحه اصلی",
        newInterview: "مصاحبه جدید",
        history: "تاریخچه",
        profile: "پروفایل",
        lastResult: "آخرین نتیجه",
        settings: "تنظیمات",
        closeMenu: "بستن منو",
      },
      hero: {
        badge: "مربی مصاحبه مبتنی بر هوش مصنوعی",
        title: "تسلط بر مصاحبه‌های فرانت‌اند",
        description:
          "با هوش مصنوعی تمرین کن، فیدبک آنی بگیر و به شغل دلخواهت برس",
        button: "شروع تمرین رایگان ←",
      },
      features: {
        f1Title: "سوالات واقعی",
        f1Desc: "برگرفته از مصاحبه‌های واقعی فرانت‌اند",
        f2Title: "بازخورد سریع",
        f2Desc: "امتیاز و نکات تحلیلی بعد از هر پاسخ",
        f3Title: "گزارش‌های هوشمند",
        f3Desc: "نقاط قوت، ضعف و مسیر یادگیری شما",
      },
      setup: {
        title: "تنظیمات مصاحبه هوش مصنوعی",
        subtitle: "پارامترهای جلسه خود را برای شروع مشخص کنید",
        levelTitle: "۱. سطح تجربه",
        levels: {
          junior: "جونیور (Junior)",
          "mid-level": "مید-لول (Mid-Level)",
          senior: "سینیور (Senior)",
        },
        focusTitle: "۲. مبحث تمرکزی",
        focusAreas: {
          React: "React",
          Javascript: "JavaScript",
          Typescript: "TypeScript",
          CSS: "CSS",
          HTML: "HTML",
          "Frontend Architecture": "معماری فرانت‌اند",
          Mixed: "ترکیبی (همه مباحث)",
          other: "سایر موارد...",
        },
        otherPlaceholder:
          "مثلاً Next.js, Redux Toolkit, Webpack, Tailwind CSS...",
        countTitle: "۳. تعداد سوالات",
        questionsCount: "{{count}} سوال",
        startButton: "شروع مصاحبه ←",
      },
      interview: {
        questionLabel: "سوال:",
        avgScoreLabel: "میانگین نمره:",
        naScore: "ثبت نشده",
        aiTyping: "هوش مصنوعی در حال نوشتن است...",
        inputPlaceholder: "پاسخ فنی خود را اینجا بنویسید...",
        initialUserMessage:
          "سلام! من برای مصاحبه سطح {{level}} در حوزه {{focusArea}} آماده‌ام. لطفاً سوال اول را بپرسید.",
      },
      result: {
        noResult: "نتیجه‌ای برای مصاحبه یافت نشد.",
        startNew: "شروع مصاحبه جدید",
        overallPerformance: "عملکرد کلی",
        strengths: "نقاط قوت",
        weaknesses: "نقاط قابل بهبود",
        skillBreakdown: "تحلیل مهارتی",
        startAnother: "شروع یک مصاحبه دیگر",
      },
      history: {
        title: "تاریخچه مصاحبه‌ها",
        subtitle: "مرور و تحلیل نتایج جلسات تمرینی گذشته",
        clearAll: "پاکسازی کل تاریخچه",
        confirmClear: "آیا از پاک کردن تمام تاریخچه مطمئن هستید؟",
        emptyTitle: "هنوز هیچ مصاحبه‌ای ثبت نشده است",
        emptyDesc:
          "اولین مصاحبه تمرینی خود را انجام دهید تا گزارش پیشرفت را در اینجا مشاهده کنید.",
        startFirst: "شروع اولین مصاحبه",
        viewReport: "مشاهده کارنامه",
        deleteItem: "حذف",
        stats: {
          total: "تعداد مصاحبه‌ها",
          avgScore: "میانگین نمرات",
          bestScore: "بهترین نمره",
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
