'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy, 
  Settings,
  FileText,
  Palette,
  Code,
  Save,
  X
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  html_content: string;
  css_styles: string;
  preview_image: string;
  usage_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'professional',
    html_content: '',
    css_styles: '',
    preview_image: '',
    status: 'active'
  });

  const categories = [
    { value: 'professional', label: 'Professional' },
    { value: 'creative', label: 'Creative' },
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTemplate 
        ? `/api/admin/templates/${editingTemplate.id}` 
        : '/api/admin/templates';
      const method = editingTemplate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchTemplates();
        resetForm();
        setShowEditor(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      html_content: template.html_content,
      css_styles: template.css_styles,
      preview_image: template.preview_image,
      status: template.status
    });
    setShowEditor(true);
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTemplates();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const handleDuplicate = (template: Template) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description,
      category: template.category,
      html_content: template.html_content,
      css_styles: template.css_styles,
      preview_image: template.preview_image,
      status: 'draft'
    });
    setShowEditor(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'professional',
      html_content: '',
      css_styles: '',
      preview_image: '',
      status: 'active'
    });
    setEditingTemplate(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'creative': return 'bg-purple-100 text-purple-800';
      case 'modern': return 'bg-indigo-100 text-indigo-800';
      case 'classic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Resume Templates</h2>
              <p className="text-gray-600 mt-1">Create and manage resume templates</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowEditor(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              New Template
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                        {template.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Used {template.usage_count} times
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No templates found</h3>
            <p className="text-gray-500">Create your first resume template to get started.</p>
          </div>
        )}

        {/* Template Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] w-full overflow-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                  </h3>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Professional Template"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="A clean and professional resume template perfect for corporate jobs..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.preview_image}
                      onChange={(e) => setFormData({ ...formData, preview_image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/template-preview.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HTML Content *
                  </label>
                  <textarea
                    required
                    value={formData.html_content}
                    onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows={12}
                    placeholder="<div class=&quot;resume&quot;>&#10;  <header>&#10;    <h1>{{name}}</h1>&#10;    <p>{{email}} | {{phone}} | {{location}}</p>&#10;  </header>&#10;  <!-- Add more HTML structure -->&#10;</div>"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSS Styles
                  </label>
                  <textarea
                    value={formData.css_styles}
                    onChange={(e) => setFormData({ ...formData, css_styles: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows={10}
                    placeholder=".resume { font-family: Arial, sans-serif; margin: 0 auto; max-width: 800px; }&#10;header { text-align: center; margin-bottom: 20px; }&#10;/* Add more CSS styles */"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEditor(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Preview: {previewTemplate.name}
                  </h3>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">HTML Content:</h4>
                  <pre className="text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap">
                    {previewTemplate.html_content}
                  </pre>
                </div>
                
                {previewTemplate.css_styles && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-medium mb-2">CSS Styles:</h4>
                    <pre className="text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap">
                      {previewTemplate.css_styles}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}