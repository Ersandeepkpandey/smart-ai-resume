'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';

interface ResumeData {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  template: string;
  templateName?: string;
  createdAt: string;
  updatedAt: string;
  completionStatus: number;
}

export default function AdminResumes() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<ResumeData[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplatesAndResumes();
  }, []);

  useEffect(() => {
    filterAndSortResumes();
  }, [searchTerm, filterTemplate, sortBy, resumes, templates]);

  const fetchTemplatesAndResumes = async () => {
    try {
      // First fetch templates
      const templatesResponse = await fetch('/api/templates');
      let templatesData = [];
      if (templatesResponse.ok) {
        const data = await templatesResponse.json();
        templatesData = data.templates || [];
        setTemplates(templatesData);
      }

      // Then fetch resumes
      const resumesResponse = await fetch('/api/admin/resumes');
      if (resumesResponse.ok) {
        const data = await resumesResponse.json();
        const resumesWithTemplateNames = data.resumes.map((resume: ResumeData) => ({
          ...resume,
          templateName: getTemplateNameById(resume.template, templatesData)
        }));
        setResumes(resumesWithTemplateNames || []);
        setFilteredResumes(resumesWithTemplateNames || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/admin/resumes');
      if (response.ok) {
        const data = await response.json();
        const resumesWithTemplateNames = data.resumes.map((resume: ResumeData) => ({
          ...resume,
          templateName: getTemplateName(resume.template)
        }));
        setResumes(resumesWithTemplateNames || []);
        setFilteredResumes(resumesWithTemplateNames || []);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTemplateNameById = (templateId: string, templatesData: any[]) => {
    const template = templatesData.find(t => t.id === templateId);
    return template?.name || templateId;
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || templateId;
  };

  const filterAndSortResumes = () => {
    let filtered = [...resumes];

    if (searchTerm) {
      filtered = filtered.filter(resume => 
        resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTemplate !== 'all') {
      filtered = filtered.filter(resume => resume.template === filterTemplate);
    }

    // Sort resumes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'completion':
          return (b.completionStatus || 0) - (a.completionStatus || 0);
        default:
          return 0;
      }
    });

    setFilteredResumes(filtered);
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        const response = await fetch(`/api/admin/resumes/${resumeId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setResumes(resumes.filter(r => r.id !== resumeId));
        }
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResumes.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedResumes.length} resumes?`)) {
      try {
        const response = await fetch('/api/admin/resumes/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeIds: selectedResumes })
        });
        if (response.ok) {
          setResumes(resumes.filter(r => !selectedResumes.includes(r.id)));
          setSelectedResumes([]);
        }
      } catch (error) {
        console.error('Error bulk deleting resumes:', error);
      }
    }
  };

  const handleViewResume = (resumeId: string) => {
    window.open(`/resume/${resumeId}/preview`, '_blank');
  };

  const handleDownloadResume = async (resumeId: string) => {
    window.open(`/resume/${resumeId}/download`, '_blank');
  };

  const toggleResumeSelection = (resumeId: string) => {
    setSelectedResumes(prev => 
      prev.includes(resumeId) 
        ? prev.filter(id => id !== resumeId)
        : [...prev, resumeId]
    );
  };

  const selectAllResumes = () => {
    if (selectedResumes.length === filteredResumes.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(filteredResumes.map(r => r.id));
    }
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'text-green-600 bg-green-100';
    if (completion >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Resume Management</h2>
              <p className="text-gray-600 mt-1">View and manage all user resumes</p>
            </div>
            <div className="flex space-x-3">
              {selectedResumes.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Selected ({selectedResumes.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterTemplate}
              onChange={(e) => setFilterTemplate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Templates</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="completion">Completion Status</option>
            </select>
          </div>
        </div>

        {/* Resumes Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedResumes.length === filteredResumes.length && filteredResumes.length > 0}
                      onChange={selectAllResumes}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedResumes.includes(resume.id)}
                        onChange={() => toggleResumeSelection(resume.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="text-gray-400 mr-3" size={20} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {resume.title || 'Untitled Resume'}
                          </div>
                          <div className="text-xs text-gray-500">ID: {resume.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{resume.userName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{resume.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {resume.templateName || resume.template || 'Default'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${resume.completionStatus || 0}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getCompletionColor(resume.completionStatus || 0)}`}>
                          {resume.completionStatus || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === resume.id ? null : resume.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {showActionMenu === resume.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <button
                              onClick={() => {
                                handleViewResume(resume.id);
                                setShowActionMenu(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye size={14} className="inline mr-2" />
                              View Resume
                            </button>
                            <button
                              onClick={() => {
                                handleDownloadResume(resume.id);
                                setShowActionMenu(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Download size={14} className="inline mr-2" />
                              Download PDF
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteResume(resume.id);
                                setShowActionMenu(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} className="inline mr-2" />
                              Delete Resume
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredResumes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No resumes found matching your criteria
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Showing {filteredResumes.length} of {resumes.length} resumes</span>
            <div className="flex space-x-4">
              <span>Total Resumes: {resumes.length}</span>
              <span>Avg Completion: {Math.round(resumes.reduce((acc, r) => acc + (r.completionStatus || 0), 0) / resumes.length || 0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}