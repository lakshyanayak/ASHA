
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  color = "green",
  trend,
  trendLabel
}) {
  const TrendIcon =
    trend === "down"
      ? TrendingDown
      : trend === "neutral"
      ? Minus
      : TrendingUp;

  return (
    <div className="metric-card">
      <div className="metric-top">
        <div className={`metric-icon ${color}`}>
          {Icon && <Icon size={22} />}
        </div>

        <span className="metric-label">{title}</span>
      </div>

      <div className="metric-value">
        <strong>{value}</strong>
        {unit && <span>{unit}</span>}
      </div>

      <div className="metric-bottom">
        <span className={`metric-trend ${trend || "neutral"}`}>
          <TrendIcon size={15} />
          {trendLabel || "No comparison"}
        </span>

        <span className="metric-description">
          {description}
        </span>
      </div>
    </div>
  );
}
