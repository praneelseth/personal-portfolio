"use client";
import { useState, useRef } from "react";
import { embed } from "@/utils/embed";
import { loadKnowledge, similarity, KnowledgeChunk } from "@/utils/knowledge";

function classNames(...arr: string[]) {
  return arr.filter(Boolean).join(" ");
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!question.trim()) return;
    setMessages(msgs => [...msgs, { role: "user", text: question }]);
    setLoading(true);

    // Step 1: Embed user question
    let vec: number[];
    try {
      vec = await embed(question);
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { role: "ai", text: "Sorry, there was an error embedding your question." }
      ]);
      setLoading(false);
      return;
    }

    // Step 2: Load knowledge
    let knowledge: KnowledgeChunk[];
    try {
      knowledge = await loadKnowledge();
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { role: "ai", text: "Sorry, could not load knowledge base." }
      ]);
      setLoading(false);
      return;
    }

    // Step 3: Compute similarity and pick top 4
    const scored = knowledge
      .map(k => ({ ...k, score: similarity(vec, k.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    const contexts = scored.map(s => s.text);

    // Step 4: Compose prompt and call Gemini Pro
    const prompt = `Context:\n${contexts.join("\n")}\n\nUser: ${question}`;
    let answer = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const json = await res.json();
      answer =
        json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        json.error ||
        "I'm sorry, I couldn't generate an answer.";
    } catch (err) {
      answer = `Error: ${(err as Error).message}`;
    }
    setMessages(msgs => [...msgs, { role: "ai", text: answer }]);
    setLoading(false);
    setQuestion("");
  }

  return (
    <>
      {/* Floating chat button */}
      <button
        className={classNames(
          "fixed z-40 bottom-6 right-6 rounded-full shadow-lg bg-black text-white p-4 transition hover:bg-gray-800",
          open ? "hidden" : ""
        )}
        aria-label="Open chat"
        onClick={() => setOpen(true)}
      >
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <circle cx={12} cy={12} r={12} fill="#fff" fillOpacity="0.2" />
          <path d="M16.5 10.5V9A4.5 4.5 0 0 0 7.5 9v1.5m9 0V12a4.5 4.5 0 0 1-9 0v-1.5m9 0h-9" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      </button>
      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 bottom-6 right-6 w-[22rem] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-black flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="font-semibold text-lg text-gray-900">Ask Me Anything</div>
            <button
              className="text-gray-400 hover:text-black transition"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm">Ask a question about my experience, projects, or achievements!</div>
            )}
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="text-right">
                  <div className="inline-block bg-black text-white rounded-lg px-3 py-2 text-sm max-w-[85%] break-words">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="text-left">
                  <div className="inline-block bg-gray-200 text-black rounded-lg px-3 py-2 text-sm max-w-[95%] break-words">
                    {msg.text}
                  </div>
                </div>
              )
            )}
            {loading && (
              <div className="text-left">
                <div className="inline-block bg-gray-200 text-black rounded-lg px-3 py-2 text-sm max-w-[95%] break-words animate-pulse">
                  <span className="opacity-60">Thinking…</span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-2 px-4 py-3 border-t border-gray-200 bg-white">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="Ask a question…"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-black text-white rounded-lg px-4 py-2 font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-60"
              disabled={loading || !question.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}