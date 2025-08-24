'use client';

import { ResumeContent } from '@/lib/ats-scorer';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';

interface ResumePreviewProps {
  content: ResumeContent;
  template: string;
  className?: string;
  showControls?: boolean;
}

export default function ResumePreview({ 
  content, 
  template, 
  className = '',
  showControls = true 
}: ResumePreviewProps) {
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);


  const [templateData, setTemplateData] = useState<any>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  useEffect(() => {
    const fetchTemplateData = async () => {
      console.log('ResumePreview: Template changed to:', template);
      // Reset template data when switching templates
      setTemplateData(null);
      
      // For legacy templates, use hardcoded components
      if (template === 'template1' || template === 'template2' || template === 'template3') {
        setIsLoadingTemplate(false);
        return;
      }

      // For new database templates, fetch the template data
      try {
        setIsLoadingTemplate(true);
        const response = await fetch(`/api/templates/${template}`);
        if (response.ok) {
          const data = await response.json();
          setTemplateData(data.template);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    fetchTemplateData();
  }, [template]);

  const renderDatabaseTemplate = () => {
    if (!templateData) return null;

    try {
      // Enhanced template substitution with better Handlebars support
      let html = templateData.html_content;
      
      // Handle LinkedIn from socialLinks
      const linkedinLink = content.personalInfo?.socialLinks?.find(link => link.platform.toLowerCase() === 'linkedin');
      
      // Replace basic variables
      if (content.personalInfo?.name) {
        html = html.replace(/\{\{personalInfo\.name\}\}/g, content.personalInfo.name);
      }
      if (content.personalInfo?.email) {
        html = html.replace(/\{\{personalInfo\.email\}\}/g, content.personalInfo.email);
      }
      if (content.personalInfo?.phone) {
        html = html.replace(/\{\{personalInfo\.phone\}\}/g, content.personalInfo.phone);
      }
      if (content.personalInfo?.location) {
        html = html.replace(/\{\{personalInfo\.location\}\}/g, content.personalInfo.location);
      }
      if (linkedinLink) {
        html = html.replace(/\{\{personalInfo\.linkedin\}\}/g, linkedinLink.url);
      }
      if (content.summary) {
        html = html.replace(/\{\{summary\}\}/g, content.summary);
      }

      // Handle conditional sections with basic if/endif logic
      const handleConditional = (html: string, condition: string, value: any) => {
        const ifPattern = new RegExp(`\\{\\{#if ${condition}\\}\\}([\\s\\S]*?)\\{\\{\\/if\\}\\}`, 'g');
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          return html.replace(ifPattern, '$1');
        } else {
          return html.replace(ifPattern, '');
        }
      };

      // Handle array loops for skills, experience, education, certifications
      const handleEach = (html: string, arrayName: string, array: any[]) => {
        const eachPattern = new RegExp(`\\{\\{#each ${arrayName}\\}\\}([\\s\\S]*?)\\{\\{\\/each\\}\\}`, 'g');
        if (array && array.length > 0) {
          return html.replace(eachPattern, (match, template) => {
            return array.map((item, index) => {
              let itemHtml = template;
              
              if (arrayName === 'skills') {
                // For skills array (simple strings)
                itemHtml = itemHtml.replace(/\{\{this\}\}/g, item);
                // Handle comma separation for skills
                if (itemHtml.includes('{{#unless @last}}, {{/unless}}')) {
                  itemHtml = itemHtml.replace(/\{\{#unless @last\}\}, \{\{\/unless\}\}/g, index < array.length - 1 ? ', ' : '');
                }
              } else if (arrayName === 'experience') {
                // For experience array (objects)
                itemHtml = itemHtml.replace(/\{\{title\}\}/g, item.title || '');
                itemHtml = itemHtml.replace(/\{\{company\}\}/g, item.company || '');
                itemHtml = itemHtml.replace(/\{\{duration\}\}/g, item.duration || '');
                itemHtml = itemHtml.replace(/\{\{description\}\}/g, item.description || '');
              } else if (arrayName === 'education') {
                // For education array (objects)
                itemHtml = itemHtml.replace(/\{\{degree\}\}/g, item.degree || '');
                itemHtml = itemHtml.replace(/\{\{institution\}\}/g, item.institution || '');
                itemHtml = itemHtml.replace(/\{\{year\}\}/g, item.year || '');
              } else if (arrayName === 'certifications') {
                // For certifications array (simple strings)
                itemHtml = itemHtml.replace(/\{\{this\}\}/g, item);
              } else if (arrayName === 'personalInfo.socialLinks') {
                // For social links array (objects)
                itemHtml = itemHtml.replace(/\{\{label\}\}/g, item.label || '');
                itemHtml = itemHtml.replace(/\{\{url\}\}/g, item.url || '');
                itemHtml = itemHtml.replace(/\{\{platform\}\}/g, item.platform || '');
              }
              
              return itemHtml;
            }).join('');
          });
        } else {
          return html.replace(eachPattern, '');
        }
      };

      // Process arrays
      if (content.skills) {
        html = handleEach(html, 'skills', content.skills);
      }
      if (content.experience) {
        html = handleEach(html, 'experience', content.experience);
      }
      if (content.education) {
        html = handleEach(html, 'education', content.education);
      }
      if (content.certifications) {
        html = handleEach(html, 'certifications', content.certifications);
      }
      if (content.personalInfo?.socialLinks) {
        html = handleEach(html, 'personalInfo.socialLinks', content.personalInfo.socialLinks);
      }

      // Handle conditionals
      html = handleConditional(html, 'personalInfo\\.phone', content.personalInfo?.phone);
      html = handleConditional(html, 'personalInfo\\.email', content.personalInfo?.email);
      html = handleConditional(html, 'personalInfo\\.location', content.personalInfo?.location);
      html = handleConditional(html, 'personalInfo\\.linkedin', linkedinLink?.url);
      html = handleConditional(html, 'personalInfo\\.socialLinks', content.personalInfo?.socialLinks);
      html = handleConditional(html, 'summary', content.summary);
      html = handleConditional(html, 'experience', content.experience);
      html = handleConditional(html, 'education', content.education);
      html = handleConditional(html, 'skills', content.skills);
      html = handleConditional(html, 'certifications', content.certifications);

      // Generate a unique ID for this template instance
      const templateId = `template-${template.replace(/[^a-zA-Z0-9-]/g, '-')}`;
      
      // Create isolated styles by prefixing all selectors with the template ID
      let isolatedCss = '';
      if (templateData.css_styles) {
        // Add the template ID to scope all styles
        isolatedCss = templateData.css_styles.replace(/([^{]+){/g, (match: string, selector: string) => {
          // Skip media queries and keyframes
          if (selector.trim().startsWith('@')) {
            return match;
          }
          // Prefix each selector with the template ID
          const prefixedSelectors = selector.split(',').map((s: string) => {
            const trimmed = s.trim();
            // If it already has .faang-resume or similar, don't double-prefix
            if (trimmed.startsWith('.faang-resume') || trimmed.startsWith('.template')) {
              return `#${templateId} ${trimmed}`;
            }
            return `#${templateId} ${trimmed}`;
          }).join(', ');
          return prefixedSelectors + ' {';
        });
      }
      
      console.log('Rendering database template:', template, 'with data:', templateData?.id);
      return (
        <div 
          id={templateId} 
          key={template} // Force re-render when template changes
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'top left',
            isolation: 'isolate',
            contain: 'layout style'
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: isolatedCss }} />
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );
    } catch (error) {
      console.error('Error rendering template:', error);
      return (
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          <div className="p-8 text-center text-red-600">
            Error rendering template
          </div>
        </div>
      );
    }
  };

  const getTemplateComponent = () => {
    const commonProps = {
      content,
      className: "transform-origin-top-left"
    };

    // Show loading for database templates
    if (isLoadingTemplate) {
      return (
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      );
    }

    // If we have database template data, use it
    if (templateData) {
      return renderDatabaseTemplate();
    }

    // Legacy hardcoded templates
    switch (template) {
      case 'template2':
        return (
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            <Template2 {...commonProps} />
          </div>
        );
      case 'template3':
        return (
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            <Template3 {...commonProps} />
          </div>
        );
      default:
        return (
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            <Template1 {...commonProps} />
          </div>
        );
    }
  };

  const handleZoomIn = () => {
    if (zoom < 1.5) {
      setZoom(prev => Math.min(prev + 0.1, 1.5));
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.3) {
      setZoom(prev => Math.max(prev - 0.1, 0.3));
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(1);
    } else {
      setZoom(1.0);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/resumes/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, template }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${content.personalInfo?.name || 'resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Download failed with status:', response.status);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Don't throw, just log the error
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 max-w-6xl max-h-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Resume Preview</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={zoom <= 0.3}
              >
                <ZoomOut size={18} />
              </button>
              <span className="px-3 py-2 text-sm bg-gray-100 rounded">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={zoom >= 1.5}
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
              >
                <Download size={18} />
              </button>
              <button
                onClick={handleFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-auto">
            {getTemplateComponent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {showControls && (
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 py-2 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={zoom <= 0.3}
            >
              <ZoomOut size={16} />
            </button>
            <span className="px-2 py-1 text-sm bg-gray-100 rounded">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={zoom >= 1.5}
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
              title="Download PDF"
            >
              <Download size={16} />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded-lg overflow-auto" style={{ minHeight: '500px' }}>
        <div className="flex justify-center">
          {getTemplateComponent()}
        </div>
      </div>
      
      {showControls && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Preview updates automatically as you type
          </p>
        </div>
      )}
    </div>
  );
}