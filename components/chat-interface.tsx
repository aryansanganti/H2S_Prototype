"use client"

/// <reference lib="dom" />

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Wallet, ShoppingCart, TrendingUp, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Update global declarations for better types
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognition = ISpeechRecognition;

type SpeechRecognitionEvent = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  walletPass?: {
    title: string
    type: "shopping" | "insights" | "recipe"
    items?: string[]
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI financial assistant. I can help you with questions about your spending, create shopping lists, suggest recipes based on your purchases, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const response = generateAIResponse(inputValue)
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    if (input.includes("grocery") || input.includes("food") || input.includes("cook")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "Based on your recent grocery purchases, I can see you bought chicken breast, bell peppers, spinach, and olive oil. Here are some recipe suggestions and a shopping list for missing ingredients:",
        timestamp: new Date(),
        walletPass: {
          title: "Recipe Ingredients - Chicken Stir Fry",
          type: "recipe",
          items: ["Soy sauce", "Garlic", "Ginger", "Rice", "Sesame oil"],
        },
      }
    }

    if (input.includes("spend") || input.includes("money") || input.includes("budget")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "You've spent ₹1,247.83 this month. Your biggest categories are groceries (₹456.78) and dining out (₹234.56). I notice you're spending 15% more on groceries than last month. Here are some insights:",
        timestamp: new Date(),
        walletPass: {
          title: "January Spending Insights",
          type: "insights",
        },
      }
    }

    if (input.includes("shopping") || input.includes("buy") || input.includes("need")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content: "Based on your purchase history and consumption patterns, here's what you might need to buy soon:",
        timestamp: new Date(),
        walletPass: {
          title: "Weekly Shopping List",
          type: "shopping",
          items: ["Milk", "Bread", "Eggs", "Bananas", "Laundry detergent", "Toilet paper"],
        },
      }
    }

    return {
      id: Date.now().toString(),
      type: "assistant",
      content:
        "I can help you with spending analysis, recipe suggestions based on your purchases, shopping lists, and financial insights. Try asking me about your grocery spending, what you can cook with recent purchases, or what you might need to buy soon!",
      timestamp: new Date(),
    }
  }

  const addToWallet = (walletPass: Message["walletPass"]) => {
    if (!walletPass) return;
    alert(`"${walletPass.title}" has been added to your Google Wallet!`)
  }

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as typeof window & {
        webkitSpeechRecognition: new () => SpeechRecognition;
      }).webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser");
    }
  }

  const quickQuestions: string[] = [
    "How much did I spend on groceries last month?",
    "What can I cook with my recent purchases?",
    "What ingredients do I need for pasta?",
    "Do I have enough laundry detergent?",
    "Show me my spending trends",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Financial Assistant</CardTitle>
          <CardDescription>
            Ask questions in your local language about spending, recipes, shopping lists, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          <ScrollArea className="h-96 w-full border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "assistant" && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {message.walletPass && (
                      <div className="mt-2 p-3 border rounded-lg bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-sm">{message.walletPass.title}</span>
                          </div>
                          <Badge variant="secondary">{message.walletPass.type}</Badge>
                        </div>

                        {message.walletPass.items && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">Items:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.walletPass.items.map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button size="sm" onClick={() => addToWallet(message.walletPass)} className="w-full">
                          <Wallet className="h-3 w-3 mr-1" />
                          Add to Google Wallet
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your spending, recipes, shopping lists..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={startVoiceInput}
              >
                {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Spending Analysis</h4>
                <p className="text-sm text-muted-foreground">Get insights into your spending patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Smart Shopping Lists</h4>
                <p className="text-sm text-muted-foreground">AI-generated lists based on your habits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium">Wallet Integration</h4>
                <p className="text-sm text-muted-foreground">Seamless Google Wallet pass creation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
