"use client"

import { useState } from "react"
import { Camera, Upload, MessageCircle, Wallet, TrendingUp, Receipt, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ReceiptUpload from "@/components/receipt-upload"
import ChatInterface from "@/components/chat-interface"
import SpendingDashboard from "@/components/spending-dashboard"
import WalletPasses from "@/components/wallet-passes"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [recentReceipts] = useState([
    { id: 1, store: "Whole Foods", amount: 87.45, date: "2024-01-15", items: 12 },
    { id: 2, store: "Target", amount: 156.78, date: "2024-01-14", items: 8 },
    { id: 3, store: "Starbucks", amount: 12.5, date: "2024-01-14", items: 2 },
  ])

  const [walletPasses] = useState([
    { id: 1, title: "Weekly Grocery List", type: "shopping", items: 8, updated: "2 hours ago" },
    { id: 2, title: "Spending Insights - January", type: "insights", updated: "1 day ago" },
    { id: 3, title: "Recipe Ingredients", type: "shopping", items: 5, updated: "3 days ago" },
  ])

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <ReceiptUpload />
      case "chat":
        return <ChatInterface />
      case "analytics":
        return <SpendingDashboard />
      case "wallet":
        return <WalletPasses />
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹1,247.83</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receipts</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wallet Passes</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{walletPasses.length}</div>
                  <p className="text-xs text-muted-foreground">Active passes</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with Project Raseed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("upload")}
                  >
                    <Camera className="h-6 w-6" />
                    Scan Receipt
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageCircle className="h-6 w-6" />
                    Ask Assistant
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <TrendingUp className="h-6 w-6" />
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("wallet")}
                  >
                    <Wallet className="h-6 w-6" />
                    Wallet Passes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Receipts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Receipts</CardTitle>
                <CardDescription>Your latest scanned receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReceipts.map((receipt) => (
                    <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{receipt.store}</p>
                          <p className="text-sm text-muted-foreground">
                            {receipt.items} items • {receipt.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{receipt.amount}</p>
                        <Badge variant="secondary" className="text-xs">
                          Processed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Wallet Passes */}
            <Card>
              <CardHeader>
                <CardTitle>Active Wallet Passes</CardTitle>
                <CardDescription>Your current Google Wallet passes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {walletPasses.map((pass) => (
                    <div key={pass.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Wallet className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{pass.title}</p>
                          <p className="text-xs text-muted-foreground">Updated {pass.updated}</p>
                        </div>
                      </div>
                      <Badge variant={pass.type === "shopping" ? "default" : "secondary"}>
                        {pass.type === "shopping" ? `${pass.items} items` : "Insights"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Project Raseed</h1>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Receipt
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("dashboard")}
              >
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="h-4 w-4" />
                Upload Receipt
              </Button>
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("chat")}
              >
                <MessageCircle className="h-4 w-4" />
                AI Assistant
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("analytics")}
              >
                <TrendingUp className="h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant={activeTab === "wallet" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("wallet")}
              >
                <Wallet className="h-4 w-4" />
                Wallet Passes
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
