
import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  X,
  Moon,
  Footprints,
  Brain,
  CheckCircle2,
  Heart
} from "lucide-react";

const insightContent = {
  "Make room for rest": {
    icon: Moon,
    heading: "Your Rest & Recovery Insight",
    intro:
      "Rest is an important part of looking after your overall well-being. Giving yourself enough time to unwind can help support your daily routine.",
    why:
      "A consistent sleep routine gives your body and mind regular opportunities to recover.",
    suggestions: [
      "Try going to bed and waking up at approximately the same time each day.",
      "Create a relaxing bedtime routine, such as reading or listening to calm music.",
      "Give yourself a break from screens before bedtime."
    ],
    action:
      "Tonight, set aside 15 minutes for a calming activity before bed.",
    reminder:
      "Rest is productive too. Give yourself permission to slow down."
  },

  "Keep moving gently": {
    icon: Footprints,
    heading: "Your Daily Activity Insight",
    intro:
      "Movement does not always have to be intense. Small, enjoyable activities throughout your day can support your overall well-being.",
    why:
      "Regular movement can support physical health, improve mood and help you feel more refreshed.",
    suggestions: [
      "Take a comfortable short walk when you have some free time.",
      "Try gentle stretching after sitting for a long period.",
      "Choose an activity you enjoy, such as dancing, cycling or playing outdoors."
    ],
    action:
      "Choose one enjoyable movement activity and make a little time for it today.",
    reminder:
      "Every little bit of movement counts. Listen to your body and take breaks when needed."
  },

  "Check in with yourself": {
    icon: Brain,
    heading: "Your Mindfulness Insight",
    intro:
      "Your emotions deserve attention. Taking a moment to understand how you feel can help you become more aware of your emotional well-being.",
    why:
      "Recognising and expressing emotions can help you understand your needs and communicate them more clearly.",
    suggestions: [
      "Take a quiet moment and identify how you are feeling today.",
      "Write down one thing that made you feel happy, worried or grateful.",
      "Talk with someone you trust if something has been bothering you."
    ],
    action:
      "Take two minutes today to pause and ask yourself: How am I feeling right now?",
    reminder:
      "There is no right or wrong emotion. Be kind to yourself."
  }
};

export default function InsightCard({
  title,
  description,
  category = "PERSONAL INSIGHT",
  icon: Icon = Sparkles,
  color = "purple",
  action = "Explore insight"
}) {
  const [isOpen, setIsOpen] = useState(false);

  const content = insightContent[title];

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const InsightIcon = content?.icon || Heart;

  return (
    <>
      <div className={`insight-card ${color}`}>
        <div className="insight-top">
          <div className="insight-icon">
            <Icon size={21} />
          </div>

          <span className="insight-category">
            {category}
          </span>
        </div>

        <h3>{title}</h3>

        <p>{description}</p>

        <button
          className="insight-action"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          {action}
          <ArrowRight size={16} />
        </button>
      </div>

      {isOpen && (
        <div
          className="insight-modal-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20, 40, 30, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 9999,
            overflowY: "auto"
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="insight-heading"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "570px",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "20px",
              padding: "30px",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close insight"
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                border: "none",
                background: "#f1f4ef",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                display: "grid",
                placeItems: "center"
              }}
            >
              <X size={19} />
            </button>

            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "15px",
                background: "#e8f0e8",
                color: "#547b62",
                display: "grid",
                placeItems: "center",
                marginBottom: "18px"
              }}
            >
              <InsightIcon size={27} />
            </div>

            <span
              style={{
                color: "#547b62",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "1.5px"
              }}
            >
              ASHA PERSONAL INSIGHT
            </span>

            <h2
              id="insight-heading"
              style={{
                color: "#234735",
                fontSize: "25px",
                margin: "10px 0"
              }}
            >
              {content?.heading || title}
            </h2>

            <p style={{
              color: "#69766e",
              lineHeight: 1.7,
              fontSize: "14px"
            }}>
              {content?.intro || description}
            </p>

            <div style={{
              background: "#f1f6f0",
              padding: "17px",
              borderRadius: "13px",
              marginTop: "20px"
            }}>
              <h3 style={{
                color: "#315b42",
                fontSize: "15px",
                marginTop: 0
              }}>
                <Sparkles
                  size={16}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: "7px"
                  }}
                />
                Why this matters
              </h3>

              <p style={{
                color: "#66756a",
                fontSize: "13px",
                lineHeight: 1.7,
                marginBottom: 0
              }}>
                {content?.why}
              </p>
            </div>

            <h3 style={{
              color: "#234735",
              fontSize: "16px",
              marginTop: "24px"
            }}>
              Things you can try
            </h3>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}>
              {content?.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "11px",
                    alignItems: "flex-start"
                  }}
                >
                  <CheckCircle2
                    size={19}
                    color="#547b62"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  />

                  <span style={{
                    color: "#66736a",
                    fontSize: "13px",
                    lineHeight: 1.7
                  }}>
                    {suggestion}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "24px",
              padding: "18px",
              background: "#f7f4fb",
              borderRadius: "13px"
            }}>
              <h3 style={{
                color: "#69558f",
                fontSize: "15px",
                marginTop: 0
              }}>
                Your small step for today
              </h3>

              <p style={{
                color: "#70647f",
                fontSize: "13px",
                lineHeight: 1.7,
                marginBottom: 0
              }}>
                {content?.action}
              </p>
            </div>

            <p style={{
              color: "#547b62",
              fontSize: "13px",
              fontWeight: "600",
              textAlign: "center",
              marginTop: "22px"
            }}>
              {content?.reminder}
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                width: "100%",
                padding: "13px",
                background: "#315b42",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "12px"
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
