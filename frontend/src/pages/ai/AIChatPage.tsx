import { useState } from "react";
import { Send, Bot, User, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I am ForgeOps AI. How can I assist you with your repositories today?",
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "I'm currently in demo mode. My AI brain is still booting up, but I'll be ready to help you analyze code, generate PR descriptions, and review commits very soon!",
        },
      ]);
    }, 1000);
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
                <div>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSend} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your codebase..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
