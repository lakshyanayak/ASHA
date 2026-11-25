
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

const sleepData = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7 },
  { day: "Wed", hours: 6.8 },
  { day: "Thu", hours: 7.5 },
  { day: "Fri", hours: 8 },
  { day: "Sat", hours: 7.8 },
  { day: "Sun", hours: 7.5 }
];

const activityData = [
  { day: "Mon", steps: 4200 },
  { day: "Tue", steps: 5800 },
  { day: "Wed", steps: 5100 },
  { day: "Thu", steps: 7200 },
  { day: "Fri", steps: 6500 },
  { day: "Sat", steps: 8100 },
  { day: "Sun", steps: 6240 }
];

export default function Patterns() {
  return (
    <div className="page-placeholder">
      <div className="section-heading">
        <h2>Understand your daily rhythms</h2>
        <p>Explore how your sleep, activity and mood change over time.</p>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <Moon />
          <h3>Sleep consistency</h3>
          <h2>7.3 hrs</h2>
          <p><TrendingUp size={15} /> Your average sleep duration this week.</p>
        </div>

        <div className="insight-card">
          <Activity />
          <h3>Daily movement</h3>
          <h2>6,130 steps</h2>
          <p><TrendingUp size={15} /> Your average daily steps.</p>
        </div>

        <div className="insight-card">
          <Heart />
          <h3>Mood tracking</h3>
          <h2>Good</h2>
          <p>Track how your mood changes throughout the week.</p>
        </div>

        <div className="insight-card">
          <Brain />
          <h3>Wellness patterns</h3>
          <h2>Explore</h2>
          <p>Discover connections between your everyday habits.</p>
        </div>
      </div>

      <div className="chart-card">
        <h3>Weekly sleep pattern</h3>
        <p>Your sleep duration across the week.</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={sleepData}>
            <defs>
              <linearGradient id="sleepColor" x1="0" y1="0" x2="0" y2="1">
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
              stroke="#729b7c"
              fill="url(#sleepColor)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Weekly activity pattern</h3>
        <p>Your daily step count.</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="steps" fill="#91a98e" radius={[7, 7, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="insight-card">
        <TrendingDown />
        <h3>A gentle reminder</h3>
        <p>
          Your sleep duration varies across the week in this demo.
          Try maintaining a consistent bedtime and notice how you feel.
        </p>
      </div>

      <p className="demo-note">
        Demonstration data only — real wellness pattern analysis will be integrated later.
      </p>
    </div>
  );
}
