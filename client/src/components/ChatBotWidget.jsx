import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/api.js";
import { useAuth } from ".././context/AuthContext.jsx";

const PRACTICE_CONTEXT_KEY = "pass4sure_practice_context";
const CHATBOT_SESSION_KEY = "pass4sure_chatbot_session";

const buildPracticeContext = (pathname) => {
  if (!pathname.startsWith("/practice")) {
    return null;
  }

  const stored = localStorage.getItem(PRACTICE_CONTEXT_KEY);
  if (!stored) {
    return { page: "practice" };
  }

  try {
    return { page: "practice", ...JSON.parse(stored) };
  } catch (error) {
    console.error("Failed to parse practice context", error);
    return { page: "practice" };
  }
};

const ChatBotWidget = () => {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi 👋 I am Pass4Sure Assistant. How can I help you today?"
    }
  ]);

  const practiceContext = useMemo(
    () => buildPracticeContext(location.pathname),
    [location.pathname]
  );
  const sessionId = useMemo(() => {
    const stored = localStorage.getItem(CHATBOT_SESSION_KEY);
    if (stored) return stored;
    const freshId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(CHATBOT_SESSION_KEY, freshId);
    return freshId;
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) {
      return;
    }

    const newMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/api/chatbot/message", {
        message: trimmed,
        context: practiceContext,
        userId: user?.id || null
      });
      const reply = response.data.reply ||
        "Thanks for reaching out. How else can I support you?";
      const receivedSessionId = response.data.sessionId;
      if (receivedSessionId && receivedSessionId !== sessionId) {
        localStorage.setItem(CHATBOT_SESSION_KEY, receivedSessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: reply
        }
      ]);
    } catch (error) {
      console.error("Chatbot request failed", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Sorry, I ran into an issue. Please try again in a moment."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[320px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/40 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Pass4Sure Assistant</p>
              <p className="text-xs text-slate-500">Online now</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-700"
              aria-label="Minimize chatbot"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[360px] space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-500">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about exams, practice, or subscriptions..."
                className="flex-1 resize-none rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:bg-blue-700"
          aria-label="Open chatbot"
        >
          <span className="text-lg">💬</span>
          Chat with us
        </button>
      )}
    </div>
  );
};

export default ChatBotWidget;
