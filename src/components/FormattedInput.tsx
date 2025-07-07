'use client'

import { useState, useRef, useEffect } from 'react'
import { TextFormatting } from '@/lib/ats-scorer'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  ChevronDown,
  Settings,
  Link as LinkIcon,
  Highlighter,
  Eraser,
  ListOrdered,
  Quote,
  Minus,
  X
} from 'lucide-react'

interface FormattedInputProps {
  value: string
  onChange: (value: string) => void
  onFormatChange?: (formatting: TextFormatting) => void
  initialFormatting?: TextFormatting
  placeholder?: string
  rows?: number
  type?: string
  label?: string
  className?: string
  onFocus?: () => void
}

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px']
const fontFamilies = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet' }
]


const alignments = [
  { value: 'left', icon: AlignLeft, label: 'Left' },
  { value: 'center', icon: AlignCenter, label: 'Center' },
  { value: 'right', icon: AlignRight, label: 'Right' }
]

const bulletStyles = [
  { label: '•', title: 'Bullet' },
  { label: '◦', title: 'Hollow Bullet' },
  { label: '–', title: 'Dash' },
  { label: '▪', title: 'Square' },
  { label: '→', title: 'Arrow' },
];

export default function FormattedInput({
  value,
  onChange,
  onFormatChange,
  initialFormatting,
  placeholder,
  rows = 1,
  type = 'text',
  label,
  className = '',
  onFocus
}: FormattedInputProps) {
  const [showToolbar, setShowToolbar] = useState(false)
  const [showFontSize, setShowFontSize] = useState(false)
  const [showFontFamily, setShowFontFamily] = useState(false)
  const [showColor, setShowColor] = useState(false)
  const [formatting, setFormatting] = useState<TextFormatting>({
    fontSize: initialFormatting?.fontSize || '16px',
    fontFamily: initialFormatting?.fontFamily || 'Arial, sans-serif',
    color: initialFormatting?.color || '#000000',
    alignment: initialFormatting?.alignment || 'left',
    bold: initialFormatting?.bold || false,
    italic: initialFormatting?.italic || false,
    underline: initialFormatting?.underline || false
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const fontSizeRef = useRef<HTMLDivElement>(null)
  const fontFamilyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
    if (!showToolbar) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;

      // Check if click is outside toolbar and dropdowns
      if (
        toolbarRef.current && !toolbarRef.current.contains(target) &&
        colorPickerRef.current && !colorPickerRef.current.contains(target) &&
        fontSizeRef.current && !fontSizeRef.current.contains(target) &&
        fontFamilyRef.current && !fontFamilyRef.current.contains(target)
      ) {
        setShowToolbar(false);
        setShowFontSize(false);
        setShowFontFamily(false);
        setShowColor(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowToolbar(false);
        setShowFontSize(false);
        setShowFontFamily(false);
        setShowColor(false);
      }
    }

    // Add event listeners immediately for better responsiveness
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showToolbar, showFontSize, showColor]);

  const applyFormatting = (format: keyof TextFormatting, formatValue: string | boolean) => {
    const newFormatting = {
      ...formatting,
      [format]: formatValue
    }
    setFormatting(newFormatting)
    if (onFormatChange) {
      onFormatChange(newFormatting)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleFocus = () => {
    if (onFocus) {
      onFocus()
    }
  }

  const handleInputClick = () => {
    // Close toolbar when clicking on the input
    setShowToolbar(false);
    setShowFontSize(false);
    setShowFontFamily(false);
    setShowColor(false);
  }

  const handleBlur = () => {
    // Keep blur handling for potential future use
  }

  const inputStyle = {
    fontSize: formatting.fontSize,
    fontFamily: formatting.fontFamily,
    color: formatting.color,
    textAlign: formatting.alignment as 'left' | 'center' | 'right',
    fontWeight: formatting.bold ? 'bold' : 'normal',
    fontStyle: formatting.italic ? 'italic' : 'normal',
    textDecoration: formatting.underline ? 'underline' : 'none'
  }

  const insertBullet = (bullet = '•', indent = false) => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const prefix = (before && before[before.length - 1] !== '\n' ? '\n' : '') + (indent ? '    ' : '');
    const newValue = before + prefix + bullet + ' ' + after;
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = (before + prefix + bullet + ' ').length;
      el.focus();
    }, 0);
  }

  const insertNumberedList = () => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const prefix = (before && before[before.length - 1] !== '\n' ? '\n' : '');
    const newValue = before + prefix + '1. ' + after;
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = (before + prefix + '1. ').length;
      el.focus();
    }, 0);
  }

  const insertQuote = () => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const prefix = (before && before[before.length - 1] !== '\n' ? '\n' : '');
    const newValue = before + prefix + '❝ ' + after;
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = (before + prefix + '❝ ').length;
      el.focus();
    }, 0);
  }

  const insertDivider = () => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const prefix = (before && before[before.length - 1] !== '\n' ? '\n' : '');
    const newValue = before + prefix + '———' + '\n' + after;
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = (before + prefix + '———\n').length;
      el.focus();
    }, 0);
  }

  const insertLink = () => {
    const url = window.prompt('Enter the URL:');
    if (!url) return;
    const text = window.prompt('Enter the link text:', url);
    if (!inputRef.current) return;
    const el = inputRef.current;
    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const newValue = before + `[${text}](${url})` + after;
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = (before + `[${text}](${url})`).length;
      el.focus();
    }, 0);
  }

  const insertHighlight = () => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    if (start === end) return; // nothing selected
    const before = value.substring(0, start);
    const selected = value.substring(start, end);
    const after = value.substring(end);
    // Use a simple marker for highlight (could be replaced with HTML in a real editor)
    const newValue = before + '<mark>' + selected + '</mark>' + after;
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = before.length;
      el.selectionEnd = before.length + ('<mark>' + selected + '</mark>').length;
      el.focus();
    }, 0);
  }

  const clearFormatting = () => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    // Remove simple HTML tags and markdown links/highlights
    let value = el.value;
    value = value.replace(/<[^>]+>/g, ''); // remove HTML tags
    value = value.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '$1'); // remove markdown links
    onChange(value);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = value.length;
      el.focus();
    }, 0);
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="relative">
          {rows > 1 ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={handleInputClick}
              placeholder={placeholder}
              rows={rows}
              style={inputStyle}
              className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${className}`}
            />
          ) : (
            <input
              ref={inputRef}
              type={type}
              value={value}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={handleInputClick}
              placeholder={placeholder}
              style={inputStyle}
              className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${className}`}
            />
          )}

          {/* Toolbar Button */}
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-black hover:text-black hover:bg-gray-100 rounded"
            title="Formatting Options"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Toolbar */}
        {showToolbar && (
          <div
            ref={toolbarRef}
            className="absolute -top-12 left-0 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 text-black">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowToolbar(false);
                  setShowFontSize(false);
                  setShowFontFamily(false);
                  setShowColor(false);
                }}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                title="Close Toolbar"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="w-px h-6 bg-gray-300" />
              {/* Font tools */}
              <div className="flex items-center gap-1">
                {/* Font Size */}
                <div className="relative">
                  <button
                    onClick={() => setShowFontSize(!showFontSize)}
                    className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs text-black"
                    title="Font Size"
                  >
                    <Type className="w-3 h-3" />
                    <span>{formatting.fontSize}</span>
                    <ChevronDown className="w-2 h-2" />
                  </button>
                  {showFontSize && (
                    <div ref={fontSizeRef} className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[60px]" onClick={(e) => e.stopPropagation()}>
                      {fontSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            applyFormatting('fontSize', size)
                            setShowFontSize(false)
                          }}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-xs text-black"
                          style={{ fontSize: size }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Font Family */}
                <div className="relative">
                  <button
                    onClick={() => setShowFontFamily(!showFontFamily)}
                    className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs text-black"
                    title="Font Family"
                  >
                    <span style={{ fontFamily: formatting.fontFamily }}>Aa</span>
                    <span className="truncate max-w-[60px]">
                      {fontFamilies.find(f => f.value === formatting.fontFamily)?.label || 'Arial'}
                    </span>
                    <ChevronDown className="w-2 h-2" />
                  </button>
                  {showFontFamily && (
                    <div ref={fontFamilyRef} className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[120px] max-h-[200px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      {fontFamilies.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => {
                            applyFormatting('fontFamily', font.value)
                            setShowFontFamily(false)
                          }}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-xs text-black"
                          style={{ fontFamily: font.value }}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Color Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowColor(!showColor)}
                    className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-black"
                    title="Text Color"
                  >
                    <Palette className="w-3 h-3" />
                    <div
                      className="w-3 h-3 rounded border border-gray-300"
                      style={{ backgroundColor: formatting.color }}
                    />
                  </button>
                  {showColor && (
                                         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-2xl z-30 p-4 flex flex-col items-center" ref={colorPickerRef} onClick={(e) => e.stopPropagation()}>
                      {/* Color preview */}
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs text-gray-700">Selected:</span>
                        <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: formatting.color }}></span>
                        <span className="text-xs text-gray-700">{formatting.color}</span>
                      </div>
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <span className="text-xs text-gray-700 mb-1">Pick any color</span>
                        <input
                          type="color"
                          value={formatting.color}
                          onChange={e => {
                            applyFormatting('color', e.target.value)
                          }}
                          className="w-12 h-12 border-none bg-transparent cursor-pointer"
                          aria-label="Color picker"
                          style={{ padding: 0, borderRadius: '8px' }}
                        />
                      </label>
                      <button
                        type="button"
                        className="mt-4 px-4 py-1 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-colors"
                        onClick={() => setShowColor(false)}
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              {/* Text style */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => applyFormatting('bold', !formatting.bold)}
                  className={`p-1 rounded hover:bg-gray-100 text-black ${formatting.bold ? 'bg-blue-100' : ''}`}
                  title="Bold"
                >
                  <Bold className="w-3 h-3" />
                </button>
                <button
                  onClick={() => applyFormatting('italic', !formatting.italic)}
                  className={`p-1 rounded hover:bg-gray-100 text-black ${formatting.italic ? 'bg-blue-100' : ''}`}
                  title="Italic"
                >
                  <Italic className="w-3 h-3" />
                </button>
                <button
                  onClick={() => applyFormatting('underline', !formatting.underline)}
                  className={`p-1 rounded hover:bg-gray-100 text-black ${formatting.underline ? 'bg-blue-100' : ''}`}
                  title="Underline"
                >
                  <Underline className="w-3 h-3" />
                </button>
              </div>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              {/* Alignment */}
              <div className="flex items-center gap-1">
                {alignments.map((alignment) => (
                  <button
                    key={alignment.value}
                    onClick={() => applyFormatting('alignment', alignment.value)}
                    className={`p-1 rounded hover:bg-gray-100 text-black ${formatting.alignment === alignment.value ? 'bg-blue-100' : ''}`}
                    title={alignment.label}
                  >
                    <alignment.icon className="w-3 h-3" />
                  </button>
                ))}
              </div>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              {/* List/Bullet tools */}
              <div className="flex items-center gap-1">
                {bulletStyles.map(b => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => insertBullet(b.label)}
                    className="p-1 rounded hover:bg-gray-100 text-black"
                    title={b.title}
                  >
                    <span className="text-lg">{b.label}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => insertBullet('•', true)}
                  className="p-1 rounded hover:bg-gray-100 text-black"
                  title="Child Bullet"
                >
                  <span className="text-lg">  •</span>
                </button>
              </div>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              {/* New tools */}
              <div className="flex items-center gap-1">
                <button type="button" onClick={insertNumberedList} className="p-1 rounded hover:bg-gray-100 text-black" title="Numbered List"><ListOrdered className="w-3 h-3" /></button>
                <button type="button" onClick={insertQuote} className="p-1 rounded hover:bg-gray-100 text-black" title="Quote"><Quote className="w-3 h-3" /></button>
                <button type="button" onClick={insertDivider} className="p-1 rounded hover:bg-gray-100 text-black" title="Divider"><Minus className="w-3 h-3" /></button>
                <button type="button" onClick={insertLink} className="p-1 rounded hover:bg-gray-100 text-black" title="Link"><LinkIcon className="w-3 h-3" /></button>
                <button type="button" onClick={insertHighlight} className="p-1 rounded hover:bg-gray-100 text-black" title="Highlight"><Highlighter className="w-3 h-3" /></button>
                <button type="button" onClick={clearFormatting} className="p-1 rounded hover:bg-gray-100 text-black" title="Clear Formatting"><Eraser className="w-3 h-3" /></button>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  )
}