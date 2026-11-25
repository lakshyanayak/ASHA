
import { useState } from "react";
import { Send, Sparkles, User, Plus } from "lucide-react";

const suggestions = [
  "How can I improve my sleep?",
  "Give me a wellness tip",
  "How was my week?",
  "Why am I feeling tired?"
];

export default function AskAsha() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "asha",
      text: "Hello! 🌿 I'm Asha, your wellness companion. How are you feeling today?"
    }
  ]);

  function sendMessage(text = message) {
    if (!text.trim()) return;

    const userMessage = text.trim();

    setMessages((previous) => [
      ...previous,
      { sender: "user", text: userMessage },
      {
        sender: "asha",
        text: "Thank you for sharing! Taking a moment to understand how you feel is a positive step. I'll be able to give you more personalised insights once my wellness intelligence is connected."
      }
    ]);

    setMessage("");
  }

  return (
    <div className="page-placeholder">
      <div className="chat-card">
        <div className="chat-welcome">
          <Sparkles size={32} />
          <h2>Your space to reflect</h2>
          <p>Talk about your habits, feelings and everyday well-being.</p>
        </div>

        <div className="chat-messages">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`chat-message ${item.sender === "user" ? "user-message" : ""}`}
            >
              <div className="message-icon">
                {item.sender === "asha" ? <Sparkles size={18} /> : <User size={18} />}
              </div>
              <div>
                <strong>{item.sender === "asha" ? "Asha" : "You"}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="suggestion-list">
          {suggestions.map((item) => (
            <button key={item} onClick={() => sendMessage(item)}>
              {item}
            </button>
          ))}
        </div>

        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share what's on your mind..."
          />
          <button type="submit" aria-label="Send message">
            <Send size={18} />
          </button>
        </form>

        <p className="demo-note">
          Demo responses — personalised AI functionality will be integrated later.
        </p>
      </div>
    </div>
  );
}
