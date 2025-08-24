'use client'

import { ATSScore as ATSScoreType } from '@/lib/ats-scorer'
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'

interface CompactATSScoreProps {
  score: ATSScoreType
}

export default function CompactATSScore({ score }: CompactATSScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4" />
    if (score >= 60) return <CheckCircle className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const getBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200 hover:bg-green-100'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    return 'bg-red-50 border-red-200 hover:bg-red-100'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent ATS compatibility'
    if (score >= 60) return 'Good ATS compatibility'
    return 'Needs improvement for ATS'
  }

  return (
    <div className="relative group">
      {/* Compact Display */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-help ${getBgColor(score?.score || 0)}`}>
        <div className={`flex items-center gap-1 ${getScoreColor(score?.score || 0)}`}>
          {getScoreIcon(score?.score || 0)}
          <span className="font-semibold text-sm">{score?.score || 0}</span>
        </div>
        <span className="text-xs text-gray-600">ATS</span>
      </div>

      {/* Hover Tooltip */}
      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">ATS Score Details</h3>
          <div className={`flex items-center gap-2 ${getScoreColor(score?.score || 0)}`}>
            {getScoreIcon(score?.score || 0)}
            <span className="font-bold text-lg">{score?.score || 0}/100</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              (score?.score || 0) >= 80 ? 'bg-green-500' : (score?.score || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score?.score || 0}%` }}
          ></div>
        </div>

        <div className="mb-3">
          <p className={`text-xs font-medium ${getScoreColor(score?.score || 0)}`}>
            {getScoreMessage(score?.score || 0)}
          </p>
        </div>

        {/* Keywords Found */}
        {(score?.keywords || []).length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-600" />
              Keywords Found ({(score?.keywords || []).length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {(score?.keywords || []).slice(0, 6).map((keyword, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {(score?.keywords || []).length > 6 && (
                <span className="text-xs text-gray-500">
                  +{(score?.keywords || []).length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {(score?.missingKeywords || []).length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-yellow-600" />
              Consider Adding ({(score?.missingKeywords || []).length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {(score?.missingKeywords || []).slice(0, 4).map((keyword, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {(score?.missingKeywords || []).length > 4 && (
                <span className="text-xs text-gray-500">
                  +{(score?.missingKeywords || []).length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top Suggestions */}
        {(score?.suggestions || []).length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-blue-600" />
              Top Suggestions
            </h4>
            <ul className="space-y-1">
              {(score?.suggestions || []).slice(0, 3).map((suggestion, index) => (
                <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 text-xs">•</span>
                  {suggestion}
                </li>
              ))}
              {(score?.suggestions || []).length > 3 && (
                <li className="text-xs text-gray-500 italic">
                  +{(score?.suggestions || []).length - 3} more suggestions
                </li>
              )}
            </ul>
          </div>
        )}
        
        {/* Arrow pointing to the compact score */}
        <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
      </div>
    </div>
  )
}