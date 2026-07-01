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

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/setup", icon: ClipboardList, label: "New Interview" },
  { path: "/history", icon: History, label: "History" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/result", icon: BarChart3, label: "Last Result" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isDark, isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`
        fixed inset-y-0 left-0 w-72 ${isDark ? "bg-gray-900 border-r border-gray-800" : ""} flex flex-col z-50 
        transition-transform duration-400 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex justify-between p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Kian AI Interview
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
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
