// src / components / layout / Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  Home,
  Settings,
  User,
  History,
  ClipboardList,
  BarChart3,
  X,
} from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const navItems = [
  { path: "/", icon: Home, key: "sidebar.home" },
  { path: "/setup", icon: ClipboardList, key: "sidebar.newInterview" },
  { path: "/history", icon: History, key: "sidebar.history" },
  { path: "/profile", icon: User, key: "sidebar.profile" },
  { path: "/result", icon: BarChart3, key: "sidebar.lastResult" },
  { path: "/settings", icon: Settings, key: "sidebar.settings" },
];

interface SidebarProps {
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isDark, isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);

  useLayoutEffect(() => {
    setIsTransitionEnabled(false);

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [i18n.language]);

  useLayoutEffect(() => {
    setIsTransitionEnabled(true);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`
          fixed inset-y-0 inset-s-0 w-72 ${
            isDark
              ? "bg-gray-900 border-e border-gray-800"
              : "bg-white border-e border-gray-200"
          } flex flex-col z-50 
        ${
          isTransitionEnabled
            ? "transition-transform duration-400 ease-in-out"
            : "transition-none"
        }
        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full pointer-events-none"
        }
      `}
      >
        <div className="flex justify-between p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t("sidebar.title")}
          </h1>
          <button
            onClick={onClose}
            className="p-2 bg-gray-800/80 cursor-pointer hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-all border border-gray-700 hover:border-red-500/30"
            aria-label="Close Menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              <span>{t(item.key)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
