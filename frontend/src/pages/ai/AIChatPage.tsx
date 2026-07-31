import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Code, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aiService } from "@/services/ai.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem("forgeops_ai_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    return [
      {
        id: "1",
        role: "ai",
        content: "Hello! I am ForgeOps AI. How can I assist you with your repositories today?",
      }
    ];
  });

  // Save to session storage whenever messages change
  useEffect(() => {
    sessionStorage.setItem("forgeops_ai_chat", JSON.stringify(messages));
  }, [messages]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));
      return await aiService.chat(message, history);
    },
    onSuccess: (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: data.data || data,
        },
      ]);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to get response from AI");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: "Sorry, I ran into an error processing your request.",
        },
      ]);
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    chatMutation.mutate(input);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">ForgeOps AI Assistant</h1>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[80%] space-x-3 rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="mt-1 flex-shrink-0">
                  {msg.role === "user" ? <User size={18} /> : <Code size={18} />}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] space-x-3 rounded-lg p-4 bg-muted">
                <div className="mt-1 flex-shrink-0">
                  <Bot size={18} />
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">ForgeOps AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSend} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your codebase..."
              className="flex-1"
              disabled={chatMutation.isPending}
            />
            <Button type="submit" disabled={chatMutation.isPending || !input.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
