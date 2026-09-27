"use client";

import { useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const chatOptions = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1-mini",
];

const starterMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I am your AI assistant. Ask me anything.",
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [selectedModel, setSelectedModel] = useState(chatOptions[0]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const assistantId = crypto.randomUUID();
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    setMessages([...nextMessages, assistantPlaceholder]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: nextMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: fullText } : msg
          )
        );
      }
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: `Error: ${error.message || "Unknown error"}` }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">AI Chat</div>

        <button className="newButton">+ New chat</button>

        <div className="sidebarBlock">
          <div className="miniLabel">Workspace</div>
          <div className="simpleCard">Product strategy</div>
          <div className="simpleCard">Marketing plan</div>
          <div className="simpleCard">Code review</div>
        </div>
      </aside>

      <section className="mainPanel">
        <header className="topBar">
          <div className="titleWrap">
            <div className="title">Universal AI Assistant</div>
            <div className="status">Online</div>
          </div>

          <select
            className="modelSelect"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {chatOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </header>

        <div className="messagesArea">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`messageBubble ${msg.role === "user" ? "user" : "assistant"}`}
            >
              <div className="bubbleHeader">
                {msg.role === "user" ? "You" : "AI"}
              </div>
              <div className="bubbleText">{msg.content || "..."}</div>
            </div>
          ))}
        </div>

        <div className="composerWrap">
          <textarea
            className="composer"
            value={input}
            rows={3}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            className="sendButton"
            disabled={loading || !input.trim()}
            onClick={sendMessage}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </section>
    </main>
  );
}
