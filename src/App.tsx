// src / App.tsx

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import InterviewSetup from "./pages/InterviewSetup";
import { MainLayout } from "./components/layout/MainLayout";
import InterviewPage from "./pages/InterviewPage";
import ResultPage from "./pages/ResultPage";
import { useLanguageDirection } from "./hooks/useLanguageDirection";
import HistoryPage from "./pages/HistoryPage";
// import InterviewSession from './pages/InterviewSession';
// import InterviewResult from './pages/InterviewResult';
// import HistoryPage from './pages/HistoryPage';
// import ProfilePage from './pages/ProfilePage';
// import SettingsPage from './pages/SettingsPage';

function App() {
  useLanguageDirection();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<InterviewSetup />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/result" element={<ResultPage />} />
          {/* <Route path="/session" element={<InterviewSession />} /> */}
          {/* <Route path="/result" element={<InterviewResult />} /> */}
          <Route path="/history" element={<HistoryPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
