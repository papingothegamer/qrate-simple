'use client'

import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'
import { AlertCircle, Link as LinkIcon, Download, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function GradientBackground() {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
  )
}

const ColorPicker = ({ color, onChange }: { color: string; onChange: (color: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-md"
    >
      <Palette size={20} className="text-purple-600" />
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 p-0 border-0 cursor-pointer rounded"
      />
      <span className="text-sm text-gray-600">QR Code Color</span>
    </motion.div>
  )
}

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [invalidAttemptCount, setInvalidAttemptCount] = useState(0)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const [qrCodeValue, setQRCodeValue] = useState<string | null>(null)
  const [qrCodeColor, setQRCodeColor] = useState('#4F46E5')

  const generateQRCode = () => {
    if (isValidUrl(url)) {
      setError('')
      setQRCodeValue(url)
      setInvalidAttemptCount(0)
    } else {
      setError('Please enter a valid URL')
      setInvalidAttemptCount(prev => prev + 1)
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
    if (qrCodeRef.current) {
      const svg = qrCodeRef.current.querySelector('svg')
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          const pngFile = canvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          downloadLink.download = 'qrcode.png'
          downloadLink.href = pngFile
          downloadLink.click()
        }
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
      }
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <GradientBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600">
            QRate
            <span className="text-gray-500 text-2xl ml-2">QR + Create</span>
          </h1>
          <p className="text-gray-600 mt-2">Generate QR codes instantly</p>
        </div>
        
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

          <AnimatePresence>
            {error && (
              <motion.div
                className="flex items-center gap-2 text-red-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {qrCodeValue && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col items-center gap-4"
              >
                <div ref={qrCodeRef} className="relative bg-white p-4 rounded-lg shadow-md">
                  <QRCode 
                    value={qrCodeValue}
                    size={200}
                    fgColor={qrCodeColor}
                    style={{ width: '100%' }}
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
                  {qrCodeValue}
                </p>
                <ColorPicker color={qrCodeColor} onChange={setQRCodeColor} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}