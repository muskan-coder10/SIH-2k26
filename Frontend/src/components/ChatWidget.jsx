import React, { useState, useRef, useEffect } from "react";

/**
 * ChatWidget
 * Floating Hinglish chatbot bubble, shown on all three portals
 * (Farmer / Officer / Admin). Talks to the Node backend proxy at
 * /api/chatbot/chat, which forwards to the Python Flask service.
 *
 * Usage: import ChatWidget from "./ChatWidget";
 *        <ChatWidget /> anywhere inside AppShell.jsx
 */

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! Main ANNDISHA assistant hoon. Aap mujhse token, payment, procurement ya complaint se related sawal pooch sakte hain.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: data.reply || "Maaf kijiye, kuch gadbad ho gayi. Dobara try karein.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Chatbot service se connect nahi ho pa raha. Kripya thodi der baad try karein.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      {isOpen && (
        <div
          style={{
            width: 320,
            height: 420,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#1b7a3d",
              color: "#fff",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            <span>ANNDISHA Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "#f5f7f5",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  background: msg.sender === "user" ? "#1b7a3d" : "#e6e6e6",
                  color: msg.sender === "user" ? "#fff" : "#222",
                  padding: "8px 12px",
                  borderRadius: 14,
                  maxWidth: "80%",
                  fontSize: 14,
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#e6e6e6",
                  color: "#666",
                  padding: "8px 12px",
                  borderRadius: 14,
                  fontSize: 13,
                  fontStyle: "italic",
                }}
              >
                Assistant type kar raha hai...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: 8,
              gap: 8,
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Apna sawal likhein..."
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: 20,
                padding: "8px 14px",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#1b7a3d",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Bhejein
            </button>
          </div>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#1b7a3d",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          fontSize: 26,
          cursor: "pointer",
        }}
        aria-label="Open chat assistant"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}