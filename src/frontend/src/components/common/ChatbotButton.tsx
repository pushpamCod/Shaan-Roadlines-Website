import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallOpenAI, useOpenAIConfigured } from "@/hooks/useBackend";
import { useUIStore } from "@/store";
import { Bot, MessageSquare, Send, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MSG: Message = {
  role: "assistant",
  content:
    "Hello! I'm your Shaan Roadlines AI assistant. Ask me about destinations, best travel times, packing tips, route suggestions, or anything travel-related!",
};

export function ChatbotButton() {
  const { isChatOpen, toggleChat } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callOpenAI = useCallOpenAI();
  const { data: isConfigured } = useOpenAIConfigured();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (!isConfigured) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "OpenAI is not configured. Please ask an admin to set the API key in admin settings.",
        },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);
    try {
      const result = await callOpenAI.mutateAsync(input);
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                role: "assistant",
                content:
                  typeof result === "string"
                    ? result
                    : ((result as Record<string, string>)?.ok ??
                      "Sorry, I could not get a response."),
              }
            : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                role: "assistant",
                content: "Sorry, there was an error. Please try again.",
              }
            : m,
        ),
      );
    }
  };

  return (
    <>
      <button
        type="button"
        data-ocid="chatbot.open_modal_button"
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition-all flex items-center justify-center"
        aria-label="Open AI travel assistant"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
            data-ocid="chatbot.dialog"
          >
            {/* Header */}
            <div className="p-4 bg-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot size={24} />
                <div>
                  <p className="font-bold">Shaan Roadlines AI</p>
                  <p className="text-xs opacity-80">Powered by OpenAI</p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="chatbot.close_button"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${m.content.slice(0, 10)}-${i}`}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center mr-2 shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-amber-500 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content === "..." ? (
                      <span className="animate-pulse">Thinking...</span>
                    ) : (
                      m.content
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center ml-2 shrink-0">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex gap-2">
              <Input
                data-ocid="chatbot.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about destinations, travel tips..."
                className="flex-1"
              />
              <Button
                type="button"
                data-ocid="chatbot.submit_button"
                onClick={sendMessage}
                size="icon"
                className="bg-teal-500 hover:bg-teal-600"
                aria-label="Send message"
              >
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatbotButton;
