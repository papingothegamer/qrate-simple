'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { AlertCircle, Link as LinkIcon, Download } from 'lucide-react'

// Background component for the gradient
function GradientBackground() {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
  )
}

// Main QR code generator component
export default function QRCodeGenerator() {
  const [url, setUrl] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [error, setError] = useState('')
  const qrRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = () => {
    if (isValidUrl(url)) {
      setQrCodeUrl(url)
      setError('')
    } else {
      setError('Please enter a valid URL')
      setQrCodeUrl('')
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current
      const image = canvas.toDataURL("image/png")
      const link = document.createElement('a')
      link.href = image
      link.download = 'qrcode.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <GradientBackground />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600">
            QRate
            <span className="text-gray-500 text-2xl ml-2">QR + Create</span>
          </h1>
          <p className="text-gray-600 mt-2">Generate QR codes instantly</p>
        </div>
        {/* <h2 className="text-2xl font-bold text-center text-gray-800">QR Code Generator</h2>
        <p className="text-center text-gray-600">Enter a URL to generate a QR code</p> */}
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={generateQRCode}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Generate
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {qrCodeUrl && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative bg-white p-4 rounded-lg">
                <QRCodeCanvas 
                  ref={qrRef}
                  value={qrCodeUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <button
                  onClick={downloadQRCode}
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <Download size={20} className="text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <LinkIcon size={16} />
                {qrCodeUrl}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}