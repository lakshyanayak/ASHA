
import {
  LayoutDashboard,
  Activity,
  Brain,
  MessageCircle,
  TrendingUp,
  Heart,
  Settings,
  Leaf
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Your Patterns", icon: Brain, path: "/patterns" },
  { name: "Ask Asha", icon: MessageCircle, path: "/ask-asha" },
  { name: "Your Progress", icon: TrendingUp, path: "/progress" }
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Leaf size={25} />
        </div>
        <div>
          <h2>ASHA</h2>
          <span>WELLNESS COMPANION</span>
        </div>
      </div>

      <div className="sidebar-label">YOUR SPACE</div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              className={`menu-item ${
                activePage === item.path ? "active" : ""
              }`}
              onClick={() => onNavigate(item.path)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-quote">
          <Heart size={20} />
          <p>Small steps today create healthier tomorrows.</p>
        </div>

        <button className="menu-item settings-item">
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div>
            <strong>Welcome to ASHA</strong>
            <span>Your wellness journey</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
