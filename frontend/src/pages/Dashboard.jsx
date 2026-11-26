
import { useEffect, useState } from "react";

import {
  Activity,
  Moon,
  Smile,
  Footprints,
  Sparkles,
  Brain,
  Heart,
  Clock
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import MetricCard from "../components/MetricCard";
import InsightCard from "../components/InsightCard";

import { getWellnessDashboard } from "../services/api";

export default function Dashboard() {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual wellness data from the FastAPI backend.
  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await getWellnessDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError("Unable to load wellness data. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  if (loading) {
    return <div className="dashboard-page">Loading your wellness data...</div>;
  }

  if (error) {
    return <div className="dashboard-page">{error}</div>;
  }

  if (!dashboardData || !dashboardData.latest) {
    return <div className="dashboard-page">No wellness data available.</div>;
  }

  // Data received from the backend.
  const latest = dashboardData.latest;
  const baseline = dashboardData.baseline;
  const records = dashboardData.records;

  // Get today's date in the user's local timezone.
  const today = new Date().toLocaleDateString("en-CA");

  // Prepare records for the weekly chart.
  const wellnessData = records.map((record) => ({
    day: record.date.slice(5),
    activity: record.steps,
    mood: record.mood
  }));

  return (
    <div className="dashboard-page">

      {/* Welcome section */}
      <section className="welcome-banner">
        <div>
          <span className="banner-label">
            <Sparkles size={15} /> YOUR WELLNESS JOURNEY
          </span>

          <h2>A little progress is still progress.</h2>

          <p>
            Take a moment for yourself. Your well-being matters,
            and every small step counts.
          </p>
        </div>

        <div className="banner-decoration">
          <Heart size={58} strokeWidth={1.2} />
        </div>
      </section>

      {/* Daily overview */}
      <div className="section-heading">
        <div>
          <h2>Your daily overview</h2>
          <p>
            Your latest recorded wellness information
          </p>
        </div>

        <span className="date-label">
          <Clock size={15} /> {today}
        </span>
      </div>

      {/* Actual wellness metrics */}
      <section className="metrics-grid">

        <MetricCard
          title="Sleep"
          value={latest.sleep.toFixed(1)}
          unit="hrs"
          description={`Average: ${baseline.sleep.toFixed(1)} hrs`}
          icon={Moon}
          color="purple"
          trend="neutral"
          trendLabel="Latest recorded"
        />

        <MetricCard
          title="Activity"
          value={latest.steps.toLocaleString("en-IN")}
          unit="steps"
          description={`Average: ${Math.round(baseline.steps).toLocaleString("en-IN")} steps`}
          icon={Footprints}
          color="green"
          trend="neutral"
          trendLabel="Latest recorded"
        />

        <MetricCard
          title="Mood"
          value={`${latest.mood}/10`}
          description={`Average: ${baseline.mood.toFixed(1)}/10`}
          icon={Smile}
          color="orange"
          trend="neutral"
          trendLabel="Self-reported"
        />

        <MetricCard
          title="Energy"
          value={`${latest.energy}/10`}
          description={`Average: ${baseline.energy.toFixed(1)}/10`}
          icon={Activity}
          color="blue"
          trend="neutral"
          trendLabel="Self-reported"
        />

      </section>

      {/* Weekly wellness chart */}
      <section className="chart-section">

        <div className="chart-heading">
          <div>
            <h2>Your weekly patterns</h2>
            <p>Explore your activity and mood trends</p>
          </div>

          <span className="chart-period">
            {records.length} recorded days
          </span>
        </div>

        <div className="chart-legend">
          <span>
            <i className="legend-dot activity-dot"></i> Activity
          </span>

          <span>
            <i className="legend-dot mood-dot"></i> Mood
          </span>
        </div>

        <div className="wellness-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wellnessData}>

              <defs>
                <linearGradient
                  id="activityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#547B62"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="100%"
                    stopColor="#547B62"
                    stopOpacity={0.02}
                  />
                </linearGradient>

                <linearGradient
                  id="moodGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#9A82D5"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="100%"
                    stopColor="#9A82D5"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#EAECE7"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#858C83", fontSize: 12 }}
              />

              {/* Left axis: steps */}
              <YAxis
                yAxisId="steps"
                domain={[0, "auto"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#858C83", fontSize: 12 }}
              />

              {/* Right axis: mood out of 10 */}
              <YAxis
                yAxisId="mood"
                orientation="right"
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#858C83", fontSize: 12 }}
              />

              <Tooltip />

              <Area
                yAxisId="steps"
                type="monotone"
                dataKey="activity"
                name="Activity (steps)"
                stroke="#547B62"
                strokeWidth={3}
                fill="url(#activityGradient)"
              />

              <Area
                yAxisId="mood"
                type="monotone"
                dataKey="mood"
                name="Mood (out of 10)"
                stroke="#9A82D5"
                strokeWidth={3}
                fill="url(#moodGradient)"
              />

            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="chart-note">
          Based on your recorded wellness data.
        </p>

      </section>

      {/* Gentle reminders */}
      <section className="insights-section">

        <div className="section-heading">
          <div>
            <h2>Gentle reminders for you</h2>
            <p>Small ideas to support your well-being</p>
          </div>
        </div>

        <div className="insights-grid">

          <InsightCard
            title="Make room for rest"
            description="Give yourself time to unwind and maintain a consistent sleep routine."
            category="REST & RECOVERY"
            icon={Moon}
            color="purple"
          />

          <InsightCard
            title="Keep moving gently"
            description="A short walk or a little stretching can be a good way to stay active."
            category="DAILY ACTIVITY"
            icon={Footprints}
            color="green"
          />

          <InsightCard
            title="Check in with yourself"
            description="Take a moment to notice how you feel. Your emotions deserve attention."
            category="MINDFULNESS"
            icon={Brain}
            color="orange"
          />

        </div>

      </section>

    </div>
  );
}
