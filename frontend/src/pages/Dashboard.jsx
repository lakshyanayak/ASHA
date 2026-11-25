
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

const wellnessData = [
  { day: "Mon", activity: 45, mood: 65 },
  { day: "Tue", activity: 65, mood: 72 },
  { day: "Wed", activity: 55, mood: 60 },
  { day: "Thu", activity: 78, mood: 80 },
  { day: "Fri", activity: 60, mood: 75 },
  { day: "Sat", activity: 88, mood: 85 },
  { day: "Sun", activity: 72, mood: 90 }
];

export default function Dashboard() {
  return (
    <div className="dashboard-page">

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

      <div className="section-heading">
        <div>
          <h2>Your daily overview</h2>
          <p>A snapshot of your wellness journey</p>
        </div>

        <span className="date-label">
          <Clock size={15} /> Today's overview
        </span>
      </div>

      <section className="metrics-grid">

        <MetricCard
          title="Sleep"
          value="7.5"
          unit="hrs"
          description="Rest and recharge"
          icon={Moon}
          color="purple"
          trend="up"
          trendLabel="Sample data"
        />

        <MetricCard
          title="Activity"
          value="6,240"
          unit="steps"
          description="Daily movement"
          icon={Footprints}
          color="green"
          trend="up"
          trendLabel="Sample data"
        />

        <MetricCard
          title="Mood"
          value="Good"
          description="Daily check-in"
          icon={Smile}
          color="orange"
          trend="neutral"
          trendLabel="Self-reported"
        />

        <MetricCard
          title="Wellness"
          value="78"
          unit="/100"
          description="Illustrative indicator"
          icon={Activity}
          color="blue"
          trend="neutral"
          trendLabel="Demo score"
        />

      </section>

      <section className="chart-section">

        <div className="chart-heading">
          <div>
            <h2>Your weekly patterns</h2>
            <p>Explore your activity and mood trends</p>
          </div>

          <span className="chart-period">Last 7 days</span>
        </div>

        <div className="chart-legend">
          <span><i className="legend-dot activity-dot"></i> Activity</span>
          <span><i className="legend-dot mood-dot"></i> Mood</span>
        </div>

        <div className="wellness-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wellnessData}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#547B62" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#547B62" stopOpacity={0.02} />
                </linearGradient>

                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9A82D5" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#9A82D5" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#EAECE7" />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#858C83", fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#858C83", fontSize: 12 }}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="activity"
                name="Activity"
                stroke="#547B62"
                strokeWidth={3}
                fill="url(#activityGradient)"
              />

              <Area
                type="monotone"
                dataKey="mood"
                name="Mood"
                stroke="#9A82D5"
                strokeWidth={3}
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="chart-note">
          Demonstration data – actual wellness trends will be
          connected to ASHA's backend.
        </p>

      </section>

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
