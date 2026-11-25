
import {
  Trophy,
  Target,
  Flame,
  Star,
  Footprints,
  Moon,
  Heart,
  Award
} from "lucide-react";

const achievements = [
  {
    icon: Moon,
    title: "Sleep Champion",
    description: "Maintained a consistent sleep routine.",
    status: "Unlocked"
  },
  {
    icon: Footprints,
    title: "Active Explorer",
    description: "Reached your daily activity goal.",
    status: "Unlocked"
  },
  {
    icon: Heart,
    title: "Mindful Moments",
    description: "Made time to check in with yourself.",
    status: "In progress"
  }
];

export default function Progress() {
  return (
    <div className="page-placeholder">
      <div className="section-heading">
        <h2>Your wellness journey</h2>
        <p>Every small step matters. Celebrate your progress.</p>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <Trophy />
          <h3>Wellness score</h3>
          <h2>78/100</h2>
          <p>Your demonstration wellness score.</p>
        </div>

        <div className="insight-card">
          <Flame />
          <h3>Active streak</h3>
          <h2>5 days</h2>
          <p>Consecutive days of recorded activity.</p>
        </div>

        <div className="insight-card">
          <Target />
          <h3>Weekly goals</h3>
          <h2>3/4</h2>
          <p>Demonstration goals completed this week.</p>
        </div>

        <div className="insight-card">
          <Star />
          <h3>Achievements</h3>
          <h2>2 earned</h2>
          <p>Celebrate your wellness milestones.</p>
        </div>
      </div>

      <div className="chart-card">
        <h3>Weekly goal progress</h3>
        <p>Track your demonstration wellness goals.</p>

        <div className="progress-item">
          <div className="progress-label">
            <span><Moon size={17} /> Sleep goal</span>
            <strong>85%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: "85%" }} />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span><Footprints size={17} /> Activity goal</span>
            <strong>70%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: "70%" }} />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span><Heart size={17} /> Mindfulness goal</span>
            <strong>60%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3>Your achievements</h3>
        <p>Small milestones worth celebrating.</p>

        <div className="achievement-list">
          {achievements.map((item) => {
            const Icon = item.icon;

            return (
              <div className="achievement-item" key={item.title}>
                <div className="achievement-icon">
                  <Icon size={22} />
                </div>

                <div className="achievement-info">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>

                <span className="achievement-status">{item.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="insight-card">
        <Award />
        <h3>Keep growing!</h3>
        <p>
          Progress isn't about being perfect. It's about understanding
          yourself and building healthier habits one day at a time.
        </p>
      </div>

      <p className="demo-note">
        Demonstration data only — real progress tracking will be integrated later.
      </p>
    </div>
  );
}
