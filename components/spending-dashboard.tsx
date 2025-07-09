"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Calendar, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpendingCategory {
  name: string
  amount: number
  percentage: number
  change: number
  color: string
}

interface MonthlyData {
  month: string
  amount: number
}

export default function SpendingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const categories: SpendingCategory[] = [
    { name: "Groceries", amount: 456.78, percentage: 36.6, change: 15.2, color: "bg-blue-500" },
    { name: "Dining Out", amount: 234.56, percentage: 18.8, change: -8.3, color: "bg-green-500" },
    { name: "Transportation", amount: 189.45, percentage: 15.2, change: 5.7, color: "bg-yellow-500" },
    { name: "Shopping", amount: 167.89, percentage: 13.4, change: 22.1, color: "bg-purple-500" },
    { name: "Entertainment", amount: 123.45, percentage: 9.9, change: -12.4, color: "bg-pink-500" },
    { name: "Other", amount: 75.7, percentage: 6.1, change: 3.2, color: "bg-gray-500" },
  ].map((cat) => ({ ...cat, amount: cat.amount }))

  const monthlyData: MonthlyData[] = [
    { month: "Sep", amount: 1156.23 },
    { month: "Oct", amount: 1289.45 },
    { month: "Nov", amount: 1098.67 },
    { month: "Dec", amount: 1345.89 },
    { month: "Jan", amount: 1247.83 },
  ].map((data) => ({ ...data, amount: data.amount }))

  const insights = [
    {
      type: "warning",
      title: "Grocery spending is up 15%",
      description: "You spent $456.78 on groceries this month, which is higher than usual.",
      suggestion: "Consider meal planning to reduce food waste and costs.",
    },
    {
      type: "success",
      title: "Great job on dining out!",
      description: "You reduced dining expenses by 8.3% compared to last month.",
      suggestion: "Keep up the good work with home cooking.",
    },
    {
      type: "info",
      title: "Shopping spike detected",
      description: "Shopping expenses increased by 22% this month.",
      suggestion: "Review recent purchases to identify any unnecessary items.",
    },
  ]

  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Spending Analytics</h2>
          <p className="text-muted-foreground">AI-powered insights into your financial habits</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              -3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalSpent / 47).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <Progress value={83} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Spending by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Your expenses broken down by category this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">₹{category.amount.toFixed(2)}</span>
                    <Badge variant={category.change > 0 ? "destructive" : "default"} className="text-xs">
                      {category.change > 0 ? "+" : ""}
                      {category.change.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={category.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12">{category.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
          <CardDescription>Your spending over the last 5 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="h-8 bg-muted rounded-lg relative overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-lg transition-all duration-500"
                      style={{
                        width: `${(data.amount / Math.max(...monthlyData.map((d) => d.amount))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="font-semibold w-20 text-right">₹{data.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
          <CardDescription>Personalized recommendations based on your spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      insight.type === "warning"
                        ? "bg-yellow-500"
                        : insight.type === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <p className="text-sm font-medium text-primary">{insight.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
