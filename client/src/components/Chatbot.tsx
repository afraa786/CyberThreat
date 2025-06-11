import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

interface Message {
  role: "system" | "user" | "assistant" | "error";
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "Hey I am AstraAi — your intelligent guardian in the digital realm, empowering you to detect, analyze, and respond to cyber threats with real-time insights and smart defense.. So, what is your query?" },
  ]);
  const [input, setInput] = useState("");
  const [conversationId] = useState(() => Date.now().toString()); // unique session id
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          role: "user",
          conversation_id: conversationId,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = { role: "assistant", content: data.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMsg = data.detail || "Something went wrong!";
        setMessages((prev) => [...prev, { role: "error", content: errorMsg }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Network error. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">AI Chatbot</h1>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-600 self-end"
                : msg.role === "assistant"
                ? "bg-gray-700 self-start"
                : "bg-red-600 self-center"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex space-x-2">
        <textarea
          rows={2}
          className="flex-1 p-2 rounded-md resize-none text-black"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 rounded-md"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
