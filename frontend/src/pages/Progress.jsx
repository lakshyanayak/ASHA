
import { useEffect, useState } from "react";

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

import { getWellnessDashboard } from "../services/api";

export default function Progress() {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await getWellnessDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Progress data error:", err);
        setError("Unable to load your progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  if (loading) {
    return <div className="page-placeholder">Loading your progress...</div>;
  }

  if (error) {
    return <div className="page-placeholder">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="page-placeholder">No wellness data available.</div>;
  }

  const { records, baseline } = dashboardData;

  const latest = dashboardData.latest;

  // Calculate simple tracking indicators.
  const sleepGoal = 8;
  const stepsGoal = 10000;
  const waterGoal = 2.5;

  const sleepProgress = Math.min(
    (baseline.sleep / sleepGoal) * 100,
    100
  );

  const stepsProgress = Math.min(
    (baseline.steps / stepsGoal) * 100,
    100
  );

  const waterProgress = Math.min(
    (baseline.water / waterGoal) * 100,
    100
  );

  // Count days on which the recorded value reached the goal.
  const sleepGoalDays = records.filter(
    (record) => record.sleep >= sleepGoal
  ).length;

  const activityGoalDays = records.filter(
    (record) => record.steps >= stepsGoal
  ).length;

  const waterGoalDays = records.filter(
    (record) => record.water >= waterGoal
  ).length;

  const achievements = [
    {
      icon: Moon,
      title: "Sleep Milestone",
      description: `${sleepGoalDays} days with at least ${sleepGoal} hours of sleep.`,
      unlocked: sleepGoalDays > 0
    },
    {
      icon: Footprints,
      title: "Active Explorer",
      description: `${activityGoalDays} days with at least ${stepsGoal.toLocaleString("en-IN")} steps.`,
      unlocked: activityGoalDays > 0
    },
    {
      icon: Heart,
      title: "Hydration Habit",
      description: `${waterGoalDays} days with at least ${waterGoal} litres of water.`,
      unlocked: waterGoalDays > 0
    }
  ];

  return (
    <div className="page-placeholder">

      <div className="section-heading">
        <h2>Your wellness journey</h2>
        <p>
          Every small step matters. Celebrate your recorded progress.
        </p>
      </div>

      {/* Actual wellness summary */}
      <div className="insight-grid">

        <div className="insight-card">
          <Trophy />
          <h3>Recorded days</h3>
          <h2>{records.length}</h2>
          <p>Wellness records collected so far.</p>
        </div>

        <div className="insight-card">
          <Moon />
          <h3>Average sleep</h3>
          <h2>{baseline.sleep.toFixed(1)} hrs</h2>
          <p>Your average sleep duration.</p>
        </div>

        <div className="insight-card">
          <Footprints />
          <h3>Average activity</h3>
          <h2>{Math.round(baseline.steps).toLocaleString("en-IN")}</h2>
          <p>Average daily steps.</p>
        </div>

        <div className="insight-card">
          <Heart />
          <h3>Average mood</h3>
          <h2>{baseline.mood.toFixed(1)}/10</h2>
          <p>Your average self-reported mood.</p>
        </div>

      </div>

      {/* Goal tracking */}
      <div className="chart-card">
        <h3>Wellness goal tracking</h3>
        <p>
          Your average values compared with illustrative daily goals.
        </p>

        <div className="progress-item">

          <div className="progress-label">
            <span>
              <Moon size={17} /> Sleep goal
            </span>
            <strong>{Math.round(sleepProgress)}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${sleepProgress}%` }}
            />
          </div>

        </div>

        <div className="progress-item">

          <div className="progress-label">
            <span>
              <Footprints size={17} /> Activity goal
            </span>
            <strong>{Math.round(stepsProgress)}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${stepsProgress}%` }}
            />
          </div>

        </div>

        <div className="progress-item">

          <div className="progress-label">
            <span>
              <Heart size={17} /> Hydration goal
            </span>
            <strong>{Math.round(waterProgress)}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${waterProgress}%` }}
            />
          </div>

        </div>

      </div>

      {/* Achievements */}
      <div className="chart-card">

        <h3>Your achievements</h3>
        <p>
          Milestones calculated from your actual wellness records.
        </p>

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

                <span className="achievement-status">
                  {item.unlocked ? "Unlocked" : "In progress"}
                </span>

              </div>
            );
          })}

        </div>

      </div>

      {/* Latest record */}
      <div className="insight-card">
        <Award />
        <h3>Your latest recorded progress</h3>

        <p>
          On {latest.date}, you recorded {latest.sleep} hours of sleep,
          {` ${latest.steps.toLocaleString("en-IN")} steps`}, and a mood
          rating of {latest.mood}/10. Keep observing your habits and
          celebrating small improvements.
        </p>
      </div>

      <p className="demo-note">
        Goals are illustrative tracking targets. Progress indicators
        are calculated from available records, not medical assessments.
      </p>

    </div>
  );
}
