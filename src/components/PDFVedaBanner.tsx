'use client'

import React from 'react'
import { FileDown, Layers, RotateCw, Scissors, Edit, Lock, Image, Maximize2, Crop, Minimize2 } from 'lucide-react'

export default function PDFVedaBanner() {
  const tools = [
    {
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      title: 'Merge PDF'
    },
    {
      icon: <Scissors className="w-5 h-5 text-blue-600" />,
      title: 'Split PDF'
    },
    {
      icon: <FileDown className="w-5 h-5 text-blue-600" />,
      title: 'Compress PDF'
    },
    {
      icon: (
        <div className="flex items-center gap-1">
          <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">PDF</div>
          <span className="text-blue-600 text-xs">→</span>
          <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">W</div>
        </div>
      ),
      title: 'PDF to Word'
    },
    {
      icon: <Edit className="w-5 h-5 text-blue-600" />,
      title: 'Edit PDF'
    },
    {
      icon: <RotateCw className="w-5 h-5 text-blue-600" />,
      title: 'Rotate PDF'
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-600" />,
      title: 'Protect PDF'
    },
    {
      icon: <Minimize2 className="w-5 h-5 text-purple-600" />,
      title: 'Compress Image'
    },
    {
      icon: <Maximize2 className="w-5 h-5 text-purple-600" />,
      title: 'Resize Image'
    },
    {
      icon: <Crop className="w-5 h-5 text-purple-600" />,
      title: 'Crop Image'
    },
    {
      icon: <Image className="w-5 h-5 text-purple-600" />,
      title: 'MB to KB'
    }
  ]

  return (
    <div className="w-full bg-gradient-to-br from-cyan-50 to-blue-50 py-8 px-4 relative">
      <div className="absolute top-2 right-4 text-xs text-gray-500">Partner: PDFVeda</div>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-6">
          All-in-One PDF & Image Toolbox
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer min-w-[80px] flex flex-col items-center gap-1"
            >
              <div className="h-6 flex items-center justify-center">
                {tool.icon}
              </div>
              <span className="text-blue-900 font-medium text-[11px]">
                {tool.title}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <a
            href="https://pdfveda.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-600 transition-all transform hover:scale-105"
          >
            TRY FREE AT PDFVEDA.COM
          </a>
        </div>
      </div>
    </div>
  )
}