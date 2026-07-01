// src / App.tsx

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import LandingPage from "./pages/LandingPage";
import InterviewSetup from "./pages/InterviewSetup";
import { useState } from "react";
// import InterviewSession from './pages/InterviewSession';
// import InterviewResult from './pages/InterviewResult';
// import HistoryPage from './pages/HistoryPage';
// import ProfilePage from './pages/ProfilePage';
// import SettingsPage from './pages/SettingsPage';

function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <div
        className={`flex ${isSidebarOpen ? "overflow-hidden" : ""} h-screen ${isDark ? "bg-gray-950" : "bg-gray-500"}`}
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
            <Routes>
              <Route path="/" element={<LandingPage isDark={isDark} />} />
              <Route path="/setup" element={<InterviewSetup />} />
              {/* <Route path="/session" element={<InterviewSession />} /> */}
              {/* <Route path="/result" element={<InterviewResult />} /> */}
              {/* <Route path="/history" element={<HistoryPage />} /> */}
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
