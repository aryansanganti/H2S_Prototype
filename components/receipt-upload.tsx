"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, FileImage, Loader2, Check, X, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReceiptItem {
  name: string
  quantity: number
  price: number
  category: string
}

interface ProcessedReceipt {
  store: string
  date: string
  total: number
  tax: number
  items: ReceiptItem[]
  currency: string
}

export default function ReceiptUpload() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processedReceipt, setProcessedReceipt] = useState<ProcessedReceipt | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setError(null)
    setIsProcessing(true)
    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadProgress(100)

      const mockReceipt: ProcessedReceipt = {
        store: "Whole Foods Market",
        date: "2024-01-15",
        total: 87.45,
        tax: 7.23,
        currency: "INR",
        items: [
          { name: "Organic Bananas", quantity: 2, price: 3.98, category: "Produce" },
          { name: "Almond Milk", quantity: 1, price: 4.99, category: "Dairy" },
          { name: "Whole Grain Bread", quantity: 1, price: 5.49, category: "Bakery" },
          { name: "Organic Spinach", quantity: 1, price: 4.99, category: "Produce" },
          { name: "Greek Yogurt", quantity: 2, price: 8.98, category: "Dairy" },
          { name: "Olive Oil", quantity: 1, price: 12.99, category: "Pantry" },
          { name: "Chicken Breast", quantity: 1, price: 15.99, category: "Meat" },
          { name: "Bell Peppers", quantity: 3, price: 6.47, category: "Produce" },
        ],
      }

      setProcessedReceipt(mockReceipt)
      setIsProcessing(false)
    }, 3000)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch {
      setError("Camera access denied or not available")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (context) {
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "receipt-photo.jpg", { type: "image/jpeg" })
            const fileList = new DataTransfer()
            fileList.items.add(file)
            handleFileUpload(fileList.files)
          }
        }, "image/jpeg")
      }

      const stream = videoRef.current.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
      setShowCamera(false)
    }
  }

  const addToWallet = async () => {
    if (!processedReceipt) return
    alert("Receipt pass added to Google Wallet successfully!")
  }

  const resetUpload = () => {
    setProcessedReceipt(null)
    setIsProcessing(false)
    setUploadProgress(0)
    setError(null)
    setShowCamera(false)
  }

  if (showCamera) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Capture Receipt</CardTitle>
          <CardDescription>Position your receipt in the camera view</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
            <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg pointer-events-none" />
          </div>
          <div className="flex gap-2">
            <Button onClick={capturePhoto} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Capture
            </Button>
            <Button variant="outline" onClick={() => setShowCamera(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (processedReceipt) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Receipt Processed Successfully
                </CardTitle>
                <CardDescription>AI analysis complete</CardDescription>
              </div>
              <Button variant="outline" onClick={resetUpload}>
                <X className="h-4 w-4 mr-2" />
                New Receipt
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{processedReceipt.store}</h3>
                  <p className="text-muted-foreground">{processedReceipt.date}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{(processedReceipt.total - processedReceipt.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{processedReceipt.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{processedReceipt.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={addToWallet} className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Add to Google Wallet
                </Button>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Items ({processedReceipt.items.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {processedReceipt.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold">₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Receipt</CardTitle>
          <CardDescription>
            Scan or upload your receipt for AI-powered analysis and Google Wallet integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isProcessing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing receipt with Gemini AI...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">Extracting items, prices, and generating wallet pass...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-32 flex-col gap-2 bg-transparent" onClick={startCamera}>
                  <Camera className="h-8 w-8" />
                  <span>Take Photo</span>
                  <span className="text-xs text-muted-foreground">Use camera</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8" />
                  <span>Upload File</span>
                  <span className="text-xs text-muted-foreground">Choose from device</span>
                </Button>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop your receipt here</p>
                <p className="text-muted-foreground">Supports JPG, PNG, HEIC, and other image formats</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileImage className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Multimodal Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Process receipts in any language using Gemini&apos;s advanced vision capabilities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Google Wallet Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically create wallet passes with detailed item information
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p>Don&apos;t forget to check out your Google Wallet app for the latest receipt passes!</p>
    </div>
  )
}
