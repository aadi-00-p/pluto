import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import {
  useCreateOpenaiConversation,
  useListOpenaiMessages,
  getListOpenaiMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type Personality = "funny" | "professional" | "smart" | "startup";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalMessage {
  id: string;
  role: string;
  content: string;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [personality, setPersonality] = useState<Personality>("smart");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const createConversation = useCreateOpenaiConversation();
  const { data: serverMessages } = useListOpenaiMessages(conversationId ?? 0, {
    query: {
      enabled: !!conversationId,
      queryKey: getListOpenaiMessagesQueryKey(conversationId ?? 0),
    },
  });

  // Initialize conversation on open
  useEffect(() => {
    if (isOpen && !conversationId && !createConversation.isPending) {
      createConversation.mutate(
        { data: { title: "PlutoAI Chat" } },
        {
          onSuccess: (data) => {
            setConversationId(data.id);
            setLocalMessages([
              {
                id: "welcome",
                role: "assistant",
                content: "Hello! I am PlutoAI. How can I assist you today?",
              },
            ]);
          },
        }
      );
    }
  }, [isOpen, conversationId]);

  // Sync server messages
  useEffect(() => {
    if (serverMessages && serverMessages.length > 0) {
      const formattedServerMsgs = serverMessages.map((m) => ({
        id: m.id.toString(),
        role: m.role,
        content: m.content,
      }));
      setLocalMessages(formattedServerMsgs);
    }
  }, [serverMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !conversationId || isTyping) return;

    const userMsgContent = inputValue.trim();
    setInputValue("");

    const newUserMsg: LocalMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMsgContent,
    };

    setLocalMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setLocalMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: userMsgContent,
          personality: personality,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ") && line.trim() !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setLocalMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                }
                if (data.done) {
                  done = true;
                }
              } catch (e) {
                console.error("Error parsing SSE JSON", e);
              }
            }
          }
        }
      }
      
      // Refresh server messages after streaming is complete
      queryClient.invalidateQueries({
        queryKey: getListOpenaiMessagesQueryKey(conversationId),
      });

    } catch (error) {
      console.error("Error sending message:", error);
      setLocalMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: "Sorry, I encountered an error." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-0 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col bg-card border border-primary/20 rounded-2xl sm:rounded-3xl shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 slide-in-from-bottom-8 sm:slide-in-from-bottom-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 glow-purple">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg glow-text">PlutoAI</h3>
              <p className="text-xs text-muted-foreground">Deep Space Network Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-close-chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-b from-background to-card">
          {createConversation.isPending && !localMessages.length ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-muted-foreground animate-pulse">Initializing connection...</span>
            </div>
          ) : (
            localMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 shrink-0 rounded-full flex items-center justify-center border mt-auto",
                  msg.role === "user" 
                    ? "bg-secondary border-white/10" 
                    : "bg-primary/20 border-primary/50 glow-purple"
                )}>
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary/80 to-primary text-white rounded-br-sm"
                      : "bg-secondary/80 border border-white/5 text-foreground rounded-bl-sm"
                  )}
                >
                  {msg.content || (isTyping && msg.role === "assistant" && msg.id === localMessages[localMessages.length - 1].id ? (
                    <span className="flex gap-1 items-center h-5">
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  ) : "")}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-white/5">
          <div className="flex flex-wrap gap-2 mb-3">
            {(["funny", "professional", "smart", "startup"] as Personality[]).map((p) => (
              <button
                key={p}
                onClick={() => setPersonality(p)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full border transition-all duration-200 capitalize",
                  personality === p
                    ? "bg-primary/20 border-primary text-primary glow-purple"
                    : "bg-secondary/50 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                data-testid={`button-mode-${p}`}
              >
                {p} Mode
              </button>
            ))}
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={isTyping || !conversationId}
              className="w-full bg-secondary/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all disabled:opacity-50 placeholder:text-muted-foreground"
              data-testid="input-chat"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || !conversationId}
              className="absolute right-2 p-1.5 bg-primary rounded-lg text-white disabled:opacity-50 hover:bg-primary/90 transition-colors"
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
