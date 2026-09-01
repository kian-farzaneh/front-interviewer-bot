// src / components /layout / Header.tsx

import { Bell, Globe, Moon, PanelLeftOpen, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  isDark: boolean;
  onDark: () => void;
  onClose: () => void;
}

export function Header({ isDark, onDark, onClose }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("fa") ? "en" : "fa";
    i18n.changeLanguage(nextLang);
  };

  return (
    <header
      className={
        isDark
          ? "h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm px-6 flex items-center justify-between"
          : "h-16 border-b border-gray-200 bg-white/50 backdrop-blur-sm px-6 flex items-center justify-between"
      }
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full bg-blue-600 shrink-0 cursor-pointer flex justify-center items-center hover:text-white transition-colors duration-150"
          onClick={onClose}
        >
          <PanelLeftOpen />
        </div>
        <span
          className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-700"}
        >
          {t("header.readyText")}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Bell size={20} className={isDark ? "text-white" : ""} />
        </button>
        <button
          onClick={onDark}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isDark ? (
            <Sun size={20} className="text-white" />
          ) : (
            <Moon size={20} />
          )}
        </button>
        {isLandingPage && (
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
            }`}
          >
            <Globe size={15} />
            <span>{i18n.language.startsWith("fa") ? "EN" : "فا"}</span>
          </button>
        )}
      </div>
    </header>
  );
}
