// src/components/layout/MainLayout.tsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function MainLayout() {
  // مدیریت وضعیت تم و سیدبار به این کامپوننت منتقل شد
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div
      className={`flex ${isSidebarOpen ? "overflow-hidden" : ""} h-screen ${
        isDark ? "bg-gray-950" : "bg-gray-500"
      }`}
    >
      <Sidebar
        isDark={isDark}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <Header
          isDark={isDark}
          onDark={() => setIsDark(!isDark)}
          onClose={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {/* 
            اینجا محتوای مربوط به هر صفحه (مثل LandingPage، InterviewSetup و غیره) 
            به صورت داینامیک جایگزین می‌شود.
            ارسال context اجازه می‌دهد صفحات در صورت نیاز به isDark دسترسی داشته باشند.
          */}
          <Outlet context={{ isDark }} />
        </main>
      </div>
    </div>
  );
}