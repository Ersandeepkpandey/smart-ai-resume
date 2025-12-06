'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ResumeContent, calculateATSScore, ATSScore as ATSScoreType } from '@/lib/ats-scorer';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import {
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface RealtimeEditorProps {
  initialContent: ResumeContent;
  template: string;
  resumeId?: string;
  onSave?: (content: ResumeContent) => Promise<void>;
  onContentChange?: (content: ResumeContent) => void;
}

// Custom hook for debounced values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function RealtimeEditor({
  initialContent,
  template,
  resumeId: _resumeId,
  onSave,
  onContentChange
}: RealtimeEditorProps) {
  const [content, setContent] = useState<ResumeContent>(initialContent);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [, setAtsScore] = useState<ATSScoreType>({
    score: 0,
    suggestions: [],
    keywords: [],
    missingKeywords: []
  });
  
  // Debounce content updates for performance
  const debouncedContent = useDebounce(content, 300);
  
  
  // For testing: use immediate content instead of debounced
  // const previewContent = content;
  
  // Auto-save functionality
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with initial content changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Debug template changes
  useEffect(() => {
    console.log('RealtimeEditor: Template prop changed to:', template);
  }, [template]);

  // Calculate ATS Score when content changes
  useEffect(() => {
    const atsScoreResult = calculateATSScore(debouncedContent);
    setAtsScore(atsScoreResult);
  }, [debouncedContent]);

  const handleContentChange = useCallback((newContent: ResumeContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    
    // Notify parent component of content change
    if (onContentChange) {
      onContentChange(newContent);
    }
    
    // Clear existing auto-save timeout
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    
    // Set new auto-save timeout for 2 seconds after user stops typing
    autoSaveRef.current = setTimeout(() => {
      handleAutoSave(newContent).catch((error) => {
        console.error('Auto-save timeout error:', error);
      });
    }, 2000);
  }, [onContentChange]);

  const handleAutoSave = async (contentToSave: ResumeContent) => {
    if (!onSave || isSaving) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      await onSave(contentToSave);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveError(error instanceof Error ? error.message : 'Auto-save failed');
      // Don't clear unsaved changes flag on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!onSave || isSaving) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      await onSave(content);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Manual save failed:', error);
      setSaveError(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh - in real app you might reload from server
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, []);

  const getLayoutClasses = () => {
    if (!isPreviewVisible) {
      return 'grid-cols-1';
    }
    return 'grid-cols-1 lg:grid-cols-2';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">Resume Editor</h1>
              {hasUnsavedChanges && !saveError && (
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                  Unsaved changes
                </span>
              )}
              {isSaving && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center">
                  <RefreshCw size={12} className="animate-spin mr-1" />
                  Saving...
                </span>
              )}
              {saveError && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full flex items-center">
                  Save failed - {saveError}
                  <button 
                    onClick={handleManualSave}
                    className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                  <button 
                    onClick={() => setSaveError(null)} 
                    className="ml-1 text-red-700 hover:text-red-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {lastSaved && !hasUnsavedChanges && !saveError && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePreview}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isPreviewVisible ? (
                  <>
                    <EyeOff size={16} className="mr-1" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-1" />
                    Show Preview
                  </>
                )}
              </button>
              
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>
              
              <button
                onClick={handleManualSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={16} className="mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto p-4 grid gap-6 ${getLayoutClasses()}`}>
        {/* Form Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Edit Resume</h2>
              <p className="text-sm text-gray-600">
                Changes appear in real-time in the preview panel
              </p>
            </div>
            <div className="p-4">
              <ResumeForm
                content={content}
                onChange={handleContentChange}
                onFieldFocus={(fieldId) => {
                  // Could add field highlighting in preview
                  console.log('Focused field:', fieldId);
                }}
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {isPreviewVisible && (
          <div className="space-y-4">
            <div className="sticky top-20">
              <ResumePreview
                content={debouncedContent}
                template={template}
                showControls={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Preview Toggle (Hidden on Desktop) */}
      {!isPreviewVisible && (
        <button
          onClick={togglePreview}
          className="fixed bottom-6 right-6 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Eye size={20} />
        </button>
      )}
    </div>
  );
}