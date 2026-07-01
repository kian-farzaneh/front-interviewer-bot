// src / components /layout / Header.tsx

import { Bell, Moon, PanelLeftOpen, Sun } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onDark: () => void;
  onClose: () => void;
}

export function Header({ isDark, onDark, onClose }: HeaderProps) {
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
        <span className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-700"}>
          Ready for next challenge?
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors5">
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
        <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 animate-spin" />
      </div>
    </header>
  );
}
