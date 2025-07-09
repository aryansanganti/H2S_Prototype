"use client"

import { useState } from "react"
import { Wallet, Plus, MoreVertical, Share, Trash2, Edit, ShoppingCart, TrendingUp, ChefHat } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface WalletPass {
  id: string
  title: string
  type: "shopping" | "insights" | "recipe" | "receipt"
  description: string
  items?: string[]
  amount?: number
  store?: string
  date: string
  lastUpdated: string
  status: "active" | "expired" | "draft"
}

export default function WalletPasses() {
  const [passes, setPasses] = useState<WalletPass[]>([
    {
      id: "1",
      title: "Weekly Grocery List",
      type: "shopping",
      description: "AI-generated shopping list based on your consumption patterns",
      items: ["Milk", "Bread", "Eggs", "Bananas", "Chicken breast", "Spinach"],
      date: "2024-01-15",
      lastUpdated: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      title: "January Spending Insights",
      type: "insights",
      description: "Monthly financial analysis and recommendations",
      amount: 1247.83,
      date: "2024-01-01",
      lastUpdated: "1 day ago",
      status: "active",
    },
    {
      id: "3",
      title: "Chicken Stir Fry Recipe",
      type: "recipe",
      description: "Recipe based on your recent grocery purchases",
      items: ["Soy sauce", "Garlic", "Ginger", "Rice", "Sesame oil"],
      date: "2024-01-14",
      lastUpdated: "3 days ago",
      status: "active",
    },
    {
      id: "4",
      title: "Whole Foods Receipt",
      type: "receipt",
      description: "Digital receipt with itemized details",
      amount: 87.45,
      store: "Whole Foods Market",
      date: "2024-01-13",
      lastUpdated: "5 days ago",
      status: "active",
    },
    {
      id: "5",
      title: "Holiday Shopping List",
      type: "shopping",
      description: "Gift ideas and shopping reminders",
      items: ["Gift cards", "Decorations", "Party supplies"],
      date: "2023-12-20",
      lastUpdated: "3 weeks ago",
      status: "expired",
    },
  ])

  const [selectedPass, setSelectedPass] = useState<WalletPass | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getPassIcon = (type: string) => {
    switch (type) {
      case "shopping":
        return <ShoppingCart className="h-5 w-5" />
      case "insights":
        return <TrendingUp className="h-5 w-5" />
      case "recipe":
        return <ChefHat className="h-5 w-5" />
      case "receipt":
        return <Wallet className="h-5 w-5" />
      default:
        return <Wallet className="h-5 w-5" />
    }
  }

  const getPassColor = (type: string) => {
    switch (type) {
      case "shopping":
        return "bg-blue-500"
      case "insights":
        return "bg-green-500"
      case "recipe":
        return "bg-orange-500"
      case "receipt":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const deletePass = (id: string) => {
    setPasses(passes.filter((pass) => pass.id !== id))
  }

  const addToGoogleWallet = (pass: WalletPass) => {
    alert(`"${pass.title}" has been added to your Google Wallet!`)
  }

  const sharePass = (pass: WalletPass) => {
    if (navigator.share) {
      navigator.share({
        title: pass.title,
        text: pass.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(`${pass.title}: ${pass.description}`)
      alert("Pass details copied to clipboard!")
    }
  }

  const activePasses = passes.filter((pass) => pass.status === "active")
  const expiredPasses = passes.filter((pass) => pass.status === "expired")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Google Wallet Passes</h2>
          <p className="text-muted-foreground">Manage your AI-generated wallet passes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Pass
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wallet Pass</DialogTitle>
              <DialogDescription>Create a custom pass to add to your Google Wallet</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter pass title" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter pass description" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Pass</Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activePasses.length}</p>
                <p className="text-sm text-muted-foreground">Active Passes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passes.filter((p) => p.type === "shopping").length}</p>
                <p className="text-sm text-muted-foreground">Shopping Lists</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passes.filter((p) => p.type === "insights").length}</p>
                <p className="text-sm text-muted-foreground">Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Passes */}
      <Card>
        <CardHeader>
          <CardTitle>Active Passes</CardTitle>
          <CardDescription>Your current Google Wallet passes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePasses.map((pass) => (
              <div key={pass.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${getPassColor(pass.type)} rounded-lg flex items-center justify-center text-white`}
                    >
                      {getPassIcon(pass.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{pass.title}</h3>
                      <p className="text-sm text-muted-foreground">{pass.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => addToGoogleWallet(pass)}>
                        <Wallet className="h-4 w-4 mr-2" />
                        Add to Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => sharePass(pass)}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPass(pass)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deletePass(pass.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {pass.amount && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-semibold">₹{pass.amount.toFixed(2)}</span>
                  </div>
                )}

                {pass.store && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Store:</span>
                    <span className="font-medium">{pass.store}</span>
                  </div>
                )}

                {pass.items && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Items ({pass.items.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {pass.items.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {pass.items.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{pass.items.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant={pass.status === "active" ? "default" : "secondary"}>{pass.status}</Badge>
                    <span className="text-xs text-muted-foreground">Updated {pass.lastUpdated}</span>
                  </div>
                  <Button size="sm" onClick={() => addToGoogleWallet(pass)}>
                    <Wallet className="h-3 w-3 mr-1" />
                    Add to Wallet
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expired Passes */}
      {expiredPasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expired Passes</CardTitle>
            <CardDescription>Previously created passes that are no longer active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiredPasses.map((pass) => (
                <div key={pass.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${getPassColor(pass.type)} rounded-lg flex items-center justify-center text-white`}
                    >
                      {getPassIcon(pass.type)}
                    </div>
                    <div>
                      <p className="font-medium">{pass.title}</p>
                      <p className="text-sm text-muted-foreground">Expired • {pass.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => deletePass(pass.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pass Details Dialog */}
      {selectedPass && (
        <Dialog open={!!selectedPass} onOpenChange={() => setSelectedPass(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 ${getPassColor(selectedPass.type)} rounded-lg flex items-center justify-center text-white`}
                >
                  {getPassIcon(selectedPass.type)}
                </div>
                {selectedPass.title}
              </DialogTitle>
              <DialogDescription>{selectedPass.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedPass.items && (
                <div>
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {selectedPass.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => addToGoogleWallet(selectedPass)} className="flex-1">
                  <Wallet className="h-4 w-4 mr-2" />
                  Add to Google Wallet
                </Button>
                <Button variant="outline" onClick={() => sharePass(selectedPass)}>
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
