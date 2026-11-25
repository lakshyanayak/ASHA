
import { Search, Bell, Sun, ChevronDown } from "lucide-react";

export default function Header({ title, subtitle }) {
  return (
    <header className="top-header">
      <div className="header-heading">
        <span className="header-greeting">YOUR PERSONAL WELLNESS SPACE</span>
        <h1>{title || "Your Dashboard"}</h1>
        <p>{subtitle || "Understand yourself. Build healthier habits."}</p>
      </div>

      <div className="header-actions">
        <button className="header-icon" aria-label="Search">
          <Search size={19} />
        </button>

        <button className="header-icon notification-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile">
          <div className="profile-avatar">A</div>
          <div className="profile-details">
            <strong>Welcome</strong>
            <span>Wellness member</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
