
import { Sparkles, ArrowRight } from "lucide-react";

export default function InsightCard({
  title,
  description,
  category = "PERSONAL INSIGHT",
  icon: Icon = Sparkles,
  color = "purple",
  action = "Explore insight"
}) {
  return (
    <div className={`insight-card ${color}`}>
      <div className="insight-top">
        <div className="insight-icon">
          <Icon size={21} />
        </div>

        <span className="insight-category">{category}</span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button className="insight-action">
        {action}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
