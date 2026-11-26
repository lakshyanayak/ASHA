
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Patterns from "./pages/Patterns";
import AskAsha from "./AskAsha";
import Progress from "./pages/Progress";

const pageDetails = {
  "/": {
    title: "Your Dashboard",
    subtitle: "Understand yourself. Build healthier habits."
  },
  "/patterns": {
    title: "Your Patterns",
    subtitle: "Discover the rhythms of your everyday life."
  },
  "/ask-asha": {
    title: "Ask Asha",
    subtitle: "A space to reflect, explore and understand."
  },
  "/progress": {
    title: "Your Progress",
    subtitle: "Celebrate every step of your wellness journey."
  }
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage =
    pageDetails[location.pathname] || pageDetails["/"];

  return (
    <div className="app-layout">
      <Sidebar
        activePage={location.pathname}
        onNavigate={navigate}
      />

      <main className="main-content">
        <div className="content-area">
          <Header
            title={currentPage.title}
            subtitle={currentPage.subtitle}
          />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/ask-asha" element={<AskAsha />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
