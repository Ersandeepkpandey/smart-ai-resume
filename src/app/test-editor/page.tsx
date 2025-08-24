'use client';

import { useState } from 'react';
import { ResumeContent } from '@/lib/ats-scorer';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';

const initialContent: ResumeContent = {
  personalInfo: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-0123',
    location: 'Test City'
  },
  summary: 'This is a test summary',
  experience: [],
  education: [],
  skills: [],
  certifications: []
};

export default function TestEditor() {
  const [content, setContent] = useState<ResumeContent>(initialContent);

  const handleChange = (newContent: ResumeContent) => {
    setContent(newContent);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Test Editor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Form</h2>
          <ResumeForm 
            content={content} 
            onChange={handleChange}
          />
        </div>
        
        {/* Preview */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <ResumePreview 
            content={content} 
            template="template1"
            showControls={false}
          />
        </div>
      </div>
      
      {/* Debug info */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </div>
  );
}