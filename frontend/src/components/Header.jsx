
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X
} from "lucide-react";

export default function Header({ title, subtitle }) {
  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState("");
  const [searchText, setSearchText] = useState("");
  const [read, setRead] = useState(false);

  const pages = [
    { name: "Dashboard", path: "/" },
    { name: "Your Patterns", path: "/patterns" },
    { name: "Ask Asha", path: "/ask-asha" },
    { name: "Your Progress", path: "/progress" }
  ];

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const goToPage = (path) => {
    navigate(path);
    setActivePanel("");
    setSearchText("");
  };

  return (
    <header className="top-header">
      <div className="header-heading">
        <span className="header-greeting">
          YOUR PERSONAL WELLNESS SPACE
        </span>
        <h1>{title || "Your Dashboard"}</h1>
        <p>{subtitle || "Understand yourself. Build healthier habits."}</p>
      </div>

      <div className="header-actions">

        {/* SEARCH */}
        <div className="header-control">
          <button
            className="header-icon"
            aria-label="Search"
            onClick={() =>
              setActivePanel(activePanel === "search" ? "" : "search")
            }
          >
            {activePanel === "search" ? <X size={19} /> : <Search size={19} />}
          </button>

          {activePanel === "search" && (
            <div className="header-dropdown">
              <input
                autoFocus
                type="text"
                placeholder="Search pages..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <button
                    className="dropdown-item"
                    key={page.path}
                    onClick={() => goToPage(page.path)}
                  >
                    {page.name}
                  </button>
                ))
              ) : (
                <p className="dropdown-message">No pages found.</p>
              )}
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div className="header-control">
          <button
            className="header-icon notification-button"
            aria-label="Notifications"
            onClick={() =>
              setActivePanel(
                activePanel === "notifications" ? "" : "notifications"
              )
            }
          >
            <Bell size={19} />
            {!read && <span className="notification-dot"></span>}
          </button>

          {activePanel === "notifications" && (
            <div className="header-dropdown notification-dropdown">
              <h3>Notifications</h3>

              <p>
                {read
                  ? "You're all caught up!"
                  : "Welcome to ASHA! Start recording your daily wellness information."}
              </p>

              {!read && (
                <button
                  className="dropdown-item"
                  onClick={() => setRead(true)}
                >
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="header-control">
          <button
            className="header-profile"
            onClick={() =>
              setActivePanel(activePanel === "profile" ? "" : "profile")
            }
          >
            <div className="profile-avatar">A</div>

            <div className="profile-details">
              <strong>Welcome</strong>
              <span>Wellness member</span>
            </div>

            <ChevronDown size={16} />
          </button>

          {activePanel === "profile" && (
            <div className="header-dropdown profile-dropdown">
              <div className="dropdown-profile">
                <User size={18} />
                <div>
                  <strong>Wellness member</strong>
                  <p>Welcome to ASHA</p>
                </div>
              </div>

              <button
                className="dropdown-item"
                onClick={() => goToPage("/settings")}
              >
                <Settings size={17} />
                Settings
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setActivePanel("");
                  navigate("/");
                }}
              >
                <LogOut size={17} />
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
