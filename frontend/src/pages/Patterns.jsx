
import { useEffect, useState } from "react";

import {
  Moon,
  Activity,
  Heart,
  Brain,
  TrendingUp,
  TrendingDown
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import { getWellnessDashboard } from "../services/api";

export default function Patterns() {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await getWellnessDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Patterns data error:", err);
        setError("Unable to load wellness patterns.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  if (loading) {
    return <div className="page-placeholder">Loading your patterns...</div>;
  }

  if (error) {
    return <div className="page-placeholder">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="page-placeholder">No wellness data available.</div>;
  }

  const { records, baseline, deviations } = dashboardData;

  const sleepData = records.map((record) => ({
    day: record.date.slice(5),
    hours: record.sleep
  }));

  const activityData = records.map((record) => ({
    day: record.date.slice(5),
    steps: record.steps
  }));

  const sleepBelowBaseline = records.filter(
    (record) => record.sleep < baseline.sleep
  ).length;

  const sleepAboveBaseline = records.filter(
    (record) => record.sleep > baseline.sleep
  ).length;

  return (
    <div className="page-placeholder">

      <div className="section-heading">
        <h2>Understand your daily rhythms</h2>
        <p>
          Explore how your sleep, activity and mood change over time.
        </p>
      </div>

      {/* Actual baseline information */}
      <div className="insight-grid">

        <div className="insight-card">
          <Moon />
          <h3>Average sleep</h3>
          <h2>{baseline.sleep.toFixed(1)} hrs</h2>
          <p>
            <TrendingUp size={15} />
            Average sleep across {records.length} recorded days.
          </p>
        </div>

        <div className="insight-card">
          <Activity />
          <h3>Average movement</h3>
          <h2>{Math.round(baseline.steps).toLocaleString("en-IN")} steps</h2>
          <p>
            <TrendingUp size={15} />
            Your average daily step count.
          </p>
        </div>

        <div className="insight-card">
          <Heart />
          <h3>Average mood</h3>
          <h2>{baseline.mood.toFixed(1)}/10</h2>
          <p>Based on your self-reported mood.</p>
        </div>

        <div className="insight-card">
          <Brain />
          <h3>Detected deviations</h3>
          <h2>{Object.keys(deviations).length}</h2>
          <p>
            Metrics differing from baseline by at least 20%.
          </p>
        </div>

      </div>

      {/* Sleep chart */}
      <div className="chart-card">
        <h3>Weekly sleep pattern</h3>
        <p>Your actual sleep duration across recorded days.</p>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={sleepData}>

            <defs>
              <linearGradient
                id="sleepColor"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#729b7c" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#729b7c" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="hours"
              name="Sleep (hours)"
              stroke="#729b7c"
              fill="url(#sleepColor)"
              strokeWidth={3}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity chart */}
      <div className="chart-card">
        <h3>Weekly activity pattern</h3>
        <p>Your actual daily step count.</p>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="steps"
              name="Steps"
              fill="#91a98e"
              radius={[7, 7, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep comparison */}
      <div className="insight-card">
        {sleepBelowBaseline > sleepAboveBaseline ? (
          <TrendingDown />
        ) : (
          <TrendingUp />
        )}

        <h3>Your sleep observations</h3>

        <p>
          Out of {records.length} recorded days, your sleep was below
          your personal average on {sleepBelowBaseline} days and above
          your average on {sleepAboveBaseline} days.
        </p>
      </div>

      {/* Deviation details */}
      <div className="chart-card">
        <h3>Latest deviations from your baseline</h3>
        <p>
          Latest recorded values that differ from your personal average
          by at least 20%.
        </p>

        {Object.keys(deviations).length === 0 ? (
          <p>No significant deviations detected.</p>
        ) : (
          Object.entries(deviations).map(([metric, details]) => (
            <div className="progress-item" key={metric}>
              <div className="progress-label">
                <span>{metric.replace("_", " ").toUpperCase()}</span>

                <strong>
                  {details.percentage_change > 0 ? "+" : ""}
                  {details.percentage_change.toFixed(1)}%
                </strong>
              </div>

              <p>
                Current: {details.current} | Baseline:{" "}
                {details.baseline.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>

      <p className="demo-note">
        These observations are based on recorded wellness data and
        a 20% deviation threshold. They are not medical assessments.
      </p>

    </div>
  );
}
