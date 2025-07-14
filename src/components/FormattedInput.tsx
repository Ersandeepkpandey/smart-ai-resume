      'use client'

import { useState, useRef, useEffect } from 'react'
import { TextFormatting, renderContentWithLinks } from '@/lib/ats-scorer'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  ChevronDown,
  Settings,
  Link as LinkIcon,
  Highlighter,
  Eraser,
  ListOrdered,
  Quote,
  Minus,
  X,
  List,
  AlignJustify
} from 'lucide-react'

interface FormattedInputProps {
  value: string | undefined
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
  { value: 'right', icon: AlignRight, label: 'Right' },
  { value: 'justify', icon: AlignJustify, label: 'Justify' }
]

const bulletStyles = [
  { label: '•', title: 'Bullet' },
  { label: '◦', title: 'Hollow Bullet' },
  { label: '–', title: 'Dash' },
  { label: '▪', title: 'Square' },
  { label: '→', title: 'Arrow' },
];

const colors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
  '#FF0000', '#FF4400', '#FF8800', '#FFCC00', '#FFFF00',
  '#88FF00', '#44FF00', '#00FF00', '#00FF44', '#00FF88',
  '#00FFCC', '#00FFFF', '#00CCFF', '#0088FF', '#0044FF',
  '#0000FF', '#4400FF', '#8800FF', '#CC00FF', '#FF00FF',
  '#FF00CC', '#FF0088', '#FF0044', '#FF0000'
]

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
  const [showFontSettings, setShowFontSettings] = useState(false)
  const [showTextFormatting, setShowTextFormatting] = useState(false)
  const [showAlignment, setShowAlignment] = useState(false)
  const [showLists, setShowLists] = useState(false)
  const [showSpecialTools, setShowSpecialTools] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
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
  const fontSettingsRef = useRef<HTMLDivElement>(null)
  const textFormattingRef = useRef<HTMLDivElement>(null)
  const alignmentRef = useRef<HTMLDivElement>(null)
  const listsRef = useRef<HTMLDivElement>(null)
  const specialToolsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showToolbar) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;

      // Check if click is outside toolbar and all dropdowns
      if (
        toolbarRef.current && !toolbarRef.current.contains(target) &&
        fontSettingsRef.current && !fontSettingsRef.current.contains(target) &&
        textFormattingRef.current && !textFormattingRef.current.contains(target) &&
        alignmentRef.current && !alignmentRef.current.contains(target) &&
        listsRef.current && !listsRef.current.contains(target) &&
        specialToolsRef.current && !specialToolsRef.current.contains(target)
      ) {
        setShowToolbar(false);
        setShowFontSettings(false);
        setShowTextFormatting(false);
        setShowAlignment(false);
        setShowLists(false);
        setShowSpecialTools(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowToolbar(false);
        setShowFontSettings(false);
        setShowTextFormatting(false);
        setShowAlignment(false);
        setShowLists(false);
        setShowSpecialTools(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showToolbar, showFontSettings, showTextFormatting, showAlignment, showLists, showSpecialTools]);

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
    setIsEditing(true);
    if (onFocus) {
      onFocus()
    }
  }

  const handleInputClick = () => {
    setIsEditing(true);
    // Close toolbar when clicking on the input
    setShowToolbar(false);
    setShowFontSettings(false);
    setShowTextFormatting(false);
    setShowAlignment(false);
    setShowLists(false);
    setShowSpecialTools(false);
  }

  const handleBlur = () => {
    setIsEditing(false);
  }

  const inputStyle = {
    fontSize: formatting.fontSize,
    fontFamily: formatting.fontFamily,
    color: formatting.color,
    textAlign: formatting.alignment as 'left' | 'center' | 'right' | 'justify',
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
    const newValue = before + prefix + '"' + after + '"';
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = (before + prefix + '"').length;
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
    const newValue = before + prefix + '---' + after;
    onChange(newValue);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = (before + prefix + '---').length;
      el.focus();
    }, 0);
  }

  const insertLink = () => {
    const el = inputRef.current || textareaRef.current;
    if (!el) return;

    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selectedText = value.substring(start, end);

    // Prompt for URL
    const url = window.prompt('Enter the URL:', 'https://');
    if (!url) return; // User cancelled

    // Prompt for link text (use selected text as default)
    const linkText = window.prompt('Enter the link text:', selectedText || 'Link Text');
    if (!linkText) return; // User cancelled

    const before = value.substring(0, start);
    const after = value.substring(end);

    // Insert link with special format: [LINK:url]text[/LINK]
    const newValue = before + `[LINK:${url}]${linkText}[/LINK]` + after;

    onChange(newValue);

    // Set cursor position after the inserted link
    setTimeout(() => {
      const newCursorPos = before.length + `[LINK:${url}]${linkText}[/LINK]`.length;
      el.selectionStart = el.selectionEnd = newCursorPos;
      el.focus();
    }, 0);
  }

  const insertHighlight = () => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const value = el.value;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const selectedText = value.substring(start, end);
    const newValue = before + '**' + (selectedText || 'Highlighted Text') + '**' + after;
    onChange(newValue);
    setTimeout(() => {
      if (selectedText) {
        el.selectionStart = el.selectionEnd = (before + '**' + selectedText + '**').length;
      } else {
        el.selectionStart = el.selectionEnd = (before + '**').length;
      }
      el.focus();
    }, 0);
  }

  const clearFormatting = () => {
    setFormatting({
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      alignment: 'left',
      bold: false,
      italic: false,
      underline: false
    });
    if (onFormatChange) {
      onFormatChange({
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        alignment: 'left',
        bold: false,
        italic: false,
        underline: false
      });
    }
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
          {!isEditing && (value || '').includes('[LINK:') ? (
            // Show clickable links when not editing
            <div
              onClick={() => setIsEditing(true)}
              className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black cursor-text ${className}`}
              style={inputStyle}
            >
              {renderContentWithLinks(value || '')}
            </div>
          ) : rows > 1 ? (
            <textarea
              ref={textareaRef}
              value={value || ''}
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
              value={value || ''}
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

        {/* Inline Toolbar with 5 Dropdowns */}
        {showToolbar && (
          <div
            ref={toolbarRef}
            className="absolute -top-12 left-0 right-0 lg:right-auto lg:min-w-[600px] bg-white border border-gray-300 rounded-md shadow-lg p-2 z-20 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center flex-wrap lg:flex-nowrap gap-1 lg:gap-2 text-black">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowToolbar(false);
                  setShowFontSettings(false);
                  setShowTextFormatting(false);
                  setShowAlignment(false);
                  setShowLists(false);
                  setShowSpecialTools(false);
                }}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 flex-shrink-0"
                title="Close Toolbar"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="w-px h-6 bg-gray-300 flex-shrink-0" />

              {/* 1. Font Settings Dropdown */}
              <div className="relative flex-shrink-0" ref={fontSettingsRef}>
                <button
                  onClick={() => setShowFontSettings(!showFontSettings)}
                  className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs text-black whitespace-nowrap"
                  title="Font Settings"
                >
                  <Type className="w-3 h-3" />
                  <span className="hidden sm:inline">Font</span>
                  <ChevronDown className="w-2 h-2" />
                </button>
                {showFontSettings && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[200px] max-w-[90vw] lg:max-w-[300px] p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Font Settings</span>
                      <button
                        onClick={() => setShowFontSettings(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Font Size */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">Size</label>
                      <div className="grid grid-cols-3 gap-1">
                        {fontSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => {
                              applyFormatting('fontSize', size)
                              setShowFontSettings(false)
                            }}
                            className={`px-2 py-1 text-xs rounded hover:bg-gray-100 ${formatting.fontSize === size ? 'bg-blue-100 text-blue-600' : ''}`}
                            style={{ fontSize: size }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Family */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">Family</label>
                      <div className="max-h-32 overflow-y-auto">
                        {fontFamilies.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => {
                              applyFormatting('fontFamily', font.value)
                              setShowFontSettings(false)
                            }}
                            className={`block w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 ${formatting.fontFamily === font.value ? 'bg-blue-100 text-blue-600' : ''}`}
                            style={{ fontFamily: font.value }}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Color</label>
                      <div className="grid grid-cols-6 gap-1">
                        {colors.slice(0, 18).map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              applyFormatting('color', color)
                              setShowFontSettings(false)
                            }}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Text Formatting Dropdown */}
              <div className="relative flex-shrink-0" ref={textFormattingRef}>
                <button
                  onClick={() => setShowTextFormatting(!showTextFormatting)}
                  className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs text-black whitespace-nowrap"
                  title="Text Formatting"
                >
                  <Bold className="w-3 h-3" />
                  <span className="hidden sm:inline">Style</span>
                  <ChevronDown className="w-2 h-2" />
                </button>
                {showTextFormatting && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[120px] max-w-[90vw] lg:max-w-[150px] p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Text Style</span>
                      <button
                        onClick={() => setShowTextFormatting(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          applyFormatting('bold', !formatting.bold)
                          setShowTextFormatting(false)
                        }}
                        className={`flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100 ${formatting.bold ? 'bg-blue-100 text-blue-600' : ''}`}
                      >
                        <Bold className="w-3 h-3 mr-2" />
                        Bold
                      </button>
                      <button
                        onClick={() => {
                          applyFormatting('italic', !formatting.italic)
                          setShowTextFormatting(false)
                        }}
                        className={`flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100 ${formatting.italic ? 'bg-blue-100 text-blue-600' : ''}`}
                      >
                        <Italic className="w-3 h-3 mr-2" />
                        Italic
                      </button>
                      <button
                        onClick={() => {
                          applyFormatting('underline', !formatting.underline)
                          setShowTextFormatting(false)
                        }}
                        className={`flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100 ${formatting.underline ? 'bg-blue-100 text-blue-600' : ''}`}
                      >
                        <Underline className="w-3 h-3 mr-2" />
                        Underline
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Alignment Dropdown */}
              <div className="relative flex-shrink-0" ref={alignmentRef}>
                <button
                  onClick={() => setShowAlignment(!showAlignment)}
                  className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs text-black whitespace-nowrap"
                  title="Alignment"
                >
                  <AlignLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Align</span>
                  <ChevronDown className="w-2 h-2" />
                </button>
                {showAlignment && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[100px] max-w-[90vw] lg:max-w-[120px] p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Alignment</span>
                      <button
                        onClick={() => setShowAlignment(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {alignments.map((alignment) => (
                        <button
                          key={alignment.value}
                          onClick={() => {
                            applyFormatting('alignment', alignment.value)
                            setShowAlignment(false)
                          }}
                          className={`flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100 ${formatting.alignment === alignment.value ? 'bg-blue-100 text-blue-600' : ''}`}
                        >
                          <alignment.icon className="w-3 h-3 mr-2" />
                          {alignment.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Lists & Bullets Dropdown */}
              <div className="relative flex-shrink-0" ref={listsRef}>
                <button
                  onClick={() => setShowLists(!showLists)}
                  className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs text-black whitespace-nowrap"
                  title="Lists & Bullets"
                >
                  <List className="w-3 h-3" />
                  <span className="hidden sm:inline">Lists</span>
                  <ChevronDown className="w-2 h-2" />
                </button>
                {showLists && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[150px] max-w-[90vw] lg:max-w-[180px] p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Lists & Bullets</span>
                      <button
                        onClick={() => setShowLists(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          insertNumberedList()
                          setShowLists(false)
                        }}
                        className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                      >
                        <ListOrdered className="w-3 h-3 mr-2" />
                        Numbered List
                      </button>
                      {bulletStyles.map(b => (
                        <button
                          key={b.label}
                          onClick={() => {
                            insertBullet(b.label)
                            setShowLists(false)
                          }}
                          className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                          title={b.title}
                        >
                          <span className="mr-2">{b.label}</span>
                          {b.title}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          insertBullet('•', true)
                          setShowLists(false)
                        }}
                        className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                        title="Child Bullet"
                      >
                        <span className="mr-2">    •</span>
                        Child Bullet
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Special Tools Dropdown */}
              <div className="relative flex-shrink-0" ref={specialToolsRef}>
                <button
                  onClick={() => setShowSpecialTools(!showSpecialTools)}
                  className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs text-black whitespace-nowrap"
                  title="Special Tools"
                >
                  <Settings className="w-3 h-3" />
                  <span className="hidden sm:inline">Tools</span>
                  <ChevronDown className="w-2 h-2" />
                </button>
                {showSpecialTools && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[140px] max-w-[90vw] lg:max-w-[160px] p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Special Tools</span>
                      <button
                        onClick={() => setShowSpecialTools(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          insertQuote()
                          setShowSpecialTools(false)
                        }}
                        className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                      >
                        <Quote className="w-3 h-3 mr-2" />
                        Quote
                      </button>
                      <button
                        onClick={() => {
                          insertDivider()
                          setShowSpecialTools(false)
                        }}
                        className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3 mr-2" />
                        Divider
                      </button>
                      <button
                        onClick={() => {
                          insertLink()
                          setShowSpecialTools(false)
                        }}
                        className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                      >
                        <LinkIcon className="w-3 h-3 mr-2" />
                        Link
                      </button>
                      <button
                        onClick={() => {
                          insertHighlight()
                          setShowSpecialTools(false)
                        }}
                        className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                      >
                        <Highlighter className="w-3 h-3 mr-2" />
                        Highlight
                      </button>
                      <button
                        onClick={() => {
                          clearFormatting()
                          setShowSpecialTools(false)
                        }}
                        className="flex items-center w-full px-2 py-1 text-xs rounded hover:bg-gray-100"
                      >
                        <Eraser className="w-3 h-3 mr-2" />
                        Clear Formatting
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}