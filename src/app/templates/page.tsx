"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CheckCircle,
  LayoutTemplate,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Users
} from 'lucide-react';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const router = useRouter();

  const handleUseTemplate = (templateId: number) => {
    // Store the selected template in sessionStorage for after login
    sessionStorage.setItem('selectedTemplate', templateId.toString());
    // Redirect to login page
    router.push('/auth/signin');
  };

  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      description: "Clean, contemporary design perfect for tech and creative industries",
      category: "Modern",
      color: "blue",
      icon: LayoutTemplate,
      features: ["ATS-Optimized", "Clean Layout", "Professional Typography", "Mobile Responsive"],
      popularity: 98,
      preview: "/api/templates/1/preview",
      bestFor: ["Software Engineers", "Designers", "Marketing Professionals"]
    },
    {
      id: 2,
      name: "Classic Executive",
      description: "Timeless design that commands respect in traditional industries",
      category: "Classic",
      color: "indigo",
      icon: FileText,
      features: ["Executive Style", "Traditional Layout", "High Readability", "Print-Ready"],
      popularity: 95,
      preview: "/api/templates/2/preview",
      bestFor: ["Managers", "Consultants", "Finance Professionals"]
    },
    {
      id: 3,
      name: "Creative Portfolio",
      description: "Stand out with this visually striking template for creative fields",
      category: "Creative",
      color: "purple",
      icon: Sparkles,
      features: ["Visual Impact", "Color Accents", "Creative Layout", "Portfolio Ready"],
      popularity: 92,
      preview: "/api/templates/3/preview",
      bestFor: ["Artists", "Photographers", "Content Creators"]
    }
  ];



  const getGradientClasses = (color: string) => {
    const gradients = {
      blue: "from-blue-50 to-blue-100",
      indigo: "from-indigo-50 to-indigo-100",
      purple: "from-purple-50 to-purple-100"
    };
    return gradients[color as keyof typeof gradients] || gradients.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-medium">Premium Templates</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Professional Resume
                <span className="block text-blue-200">Templates</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Choose from our collection of expertly crafted, ATS-optimized templates designed to help you stand out and land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">100% ATS-Friendly</span>
                </div>
                <div className="flex items-center text-white">
                  <Award className="w-5 h-5 mr-2" />
                  <span className="font-medium">Professional Design</span>
                </div>
                <div className="flex items-center text-white">
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-medium">Instant Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Template
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each template is carefully designed to maximize your chances of getting noticed by recruiters and passing through ATS systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  selectedTemplate === template.id ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-100'
                }`}
                onMouseEnter={() => setSelectedTemplate(template.id)}
                onMouseLeave={() => setSelectedTemplate(null)}
              >
                {/* Popularity Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {template.popularity}%
                </div>

                {/* Template Preview */}
                <div className={`h-48 bg-gradient-to-br ${getGradientClasses(template.color)} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}>
                  <template.icon className={`w-16 h-16 text-${template.color}-600`} />
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-gray-800">
                      {template.category}
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{template.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <div className="space-y-2">
                      {template.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Perfect for:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.bestFor.map((profession, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {profession}
                        </span>
                      ))}
                    </div>
                  </div>

                                     {/* Action Buttons */}
                   <div className="flex gap-3">
                     <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center">
                       <Eye className="w-4 h-4 mr-2" />
                       Preview
                     </button>
                     <button
                       onClick={() => handleUseTemplate(template.id)}
                       className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group"
                     >
                       Use Template
                       <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Our Templates */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Templates?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our templates are designed with industry best practices to maximize your success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ATS-Optimized</h3>
                <p className="text-gray-600">
                  Every template is tested and optimized to pass through Applicant Tracking Systems.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Design</h3>
                <p className="text-gray-600">
                  Created by professional designers with years of experience in recruitment.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Success</h3>
                <p className="text-gray-600">
                  Used by thousands of professionals who have successfully landed their dream jobs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Create Your Professional Resume?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have successfully landed their dream jobs with our templates.
              </p>
                             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                   onClick={() => router.push('/auth/signin')}
                   className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                 >
                   Get Started Free
                   <ArrowRight className="w-5 h-5 ml-2" />
                 </button>
                 <Link
                   href="/templates"
                   className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                 >
                   View All Templates
                   <Eye className="w-5 h-5 ml-2" />
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
  );
}