'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
  List,
  ListOrdered,
  Quote,
  Minus,
  ChevronDown,
  X
} from 'lucide-react'
import { TextFormatting } from '@/lib/ats-scorer'

interface ResumeToolbarProps {
  onFormatChange: (format: string, value: string | boolean) => void
  currentFormat: TextFormatting
}

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']
const colors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
  '#FF0000', '#FF4400', '#FF8800', '#FFCC00', '#FFFF00',
  '#88FF00', '#44FF00', '#00FF00', '#00FF44', '#00FF88',
  '#00FFCC', '#00FFFF', '#00CCFF', '#0088FF', '#0044FF',
  '#0000FF', '#4400FF', '#8800FF', '#CC00FF', '#FF00FF',
  '#FF00CC', '#FF0088', '#FF0044', '#FF0000'
]

const alignments = [
  { value: 'left', icon: AlignLeft, label: 'Left' },
  { value: 'center', icon: AlignCenter, label: 'Center' },
  { value: 'right', icon: AlignRight, label: 'Right' },
  { value: 'justify', icon: AlignJustify, label: 'Justify' }
]

export default function ResumeToolbar({ onFormatChange, currentFormat }: ResumeToolbarProps) {
  const [showFontSize, setShowFontSize] = useState(false)
  const [showColor, setShowColor] = useState(false)

  const toolbarRef = useRef<HTMLDivElement>(null)

  const toggleFormat = (format: string) => {
    const currentValue = currentFormat[format as keyof typeof currentFormat]
    onFormatChange(format, !currentValue)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // If toolbar ref exists and click is outside it, close dropdowns
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setShowFontSize(false)
        setShowColor(false)
      }
    }

    // Close dropdowns on escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowFontSize(false)
        setShowColor(false)
      }
    }

    if (showFontSize || showColor) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [showFontSize, showColor])

  return (
    <div ref={toolbarRef} className="bg-white border-b border-gray-200 p-3 sticky top-0 z-10">
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        {/* Font Size */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowFontSize(!showFontSize)
            }}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            title="Font Size"
          >
            <Type className="w-4 h-4" />
            <span>{currentFormat.fontSize || '16px'}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 min-w-[80px]">
              <div className="flex justify-between items-center p-2 border-b border-gray-200">
                <span className="text-sm font-medium">Font Size</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowFontSize(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation()
                    onFormatChange('fontSize', size)
                    setShowFontSize(false)
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  style={{ fontSize: size }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowColor(!showColor)
            }}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: currentFormat.color || '#000000' }}
            />
          </button>
          {showColor && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 p-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Text Color</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowColor(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation()
                      onFormatChange('color', color)
                      setShowColor(false)
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Text Formatting */}
        <button
          onClick={() => toggleFormat('bold')}
          className={`p-2 rounded hover:bg-gray-100 ${currentFormat.bold ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => toggleFormat('italic')}
          className={`p-2 rounded hover:bg-gray-100 ${currentFormat.italic ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => toggleFormat('underline')}
          className={`p-2 rounded hover:bg-gray-100 ${currentFormat.underline ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Alignment */}
        {alignments.map((alignment) => (
          <button
            key={alignment.value}
            onClick={() => onFormatChange('alignment', alignment.value)}
            className={`p-2 rounded hover:bg-gray-100 ${currentFormat.alignment === alignment.value ? 'bg-blue-100 text-blue-600' : ''}`}
            title={alignment.label}
          >
            <alignment.icon className="w-4 h-4" />
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* List Tools */}
        <button
          onClick={() => onFormatChange('list', 'bullet')}
          className="p-2 rounded hover:bg-gray-100"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => onFormatChange('list', 'numbered')}
          className="p-2 rounded hover:bg-gray-100"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Additional Tools */}
        <button
          onClick={() => onFormatChange('quote', true)}
          className="p-2 rounded hover:bg-gray-100"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => onFormatChange('divider', true)}
          className="p-2 rounded hover:bg-gray-100"
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}