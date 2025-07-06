'use client'

import { ATSScore as ATSScoreType } from '@/lib/ats-scorer'
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'

interface ATSScoreProps {
  score: ATSScoreType
  jobKeywords?: string[]
}

export default function ATSScore({ score }: ATSScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-5 h-5" />
    if (score >= 60) return <CheckCircle className="w-5 h-5" />
    return <TrendingDown className="w-5 h-5" />
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent ATS compatibility'
    if (score >= 60) return 'Good ATS compatibility'
    return 'Needs improvement for ATS'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
        <div className={`flex items-center gap-2 ${getScoreColor(score.score)}`}>
          {getScoreIcon(score.score)}
          <span className="font-semibold">{score.score}/100</span>
        </div>
      </div>

      <div className="mb-4">
        <p className={`text-sm ${getScoreColor(score.score)}`}>
          {getScoreMessage(score.score)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            score.score >= 80 ? 'bg-green-500' : score.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score.score}%` }}
        ></div>
      </div>

      {/* Keywords Found */}
      {score.keywords.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Keywords Found ({score.keywords.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {score.keywords.slice(0, 10).map((keyword, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
              >
                {keyword}
              </span>
            ))}
            {score.keywords.length > 10 && (
              <span className="text-xs text-gray-500">
                +{score.keywords.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {score.missingKeywords.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            Consider Adding ({score.missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {score.missingKeywords.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
              >
                {keyword}
              </span>
            ))}
            {score.missingKeywords.length > 5 && (
              <span className="text-xs text-gray-500">
                +{score.missingKeywords.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {score.suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            Suggestions
          </h4>
          <ul className="space-y-1">
            {score.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}