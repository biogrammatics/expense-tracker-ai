'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Star, 
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  TrendingUp,
  Building,
  Clock,
  Settings,
  Sparkles
} from 'lucide-react';
import { Expense } from '@/types/expense';

interface ExportTemplatesProps {
  expenses: Expense[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'tax' | 'business' | 'personal' | 'analytics';
  premium: boolean;
  popular: boolean;
  features: string[];
  preview: string;
  estimatedTime: string;
  format: string[];
}

export default function ExportTemplates({ expenses }: ExportTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const templates: Template[] = [
    {
      id: 'tax-report',
      name: 'Tax Report 2024',
      description: 'Comprehensive tax-ready expense report with categorized deductions',
      icon: FileText,
      category: 'tax',
      premium: false,
      popular: true,
      features: ['IRS-compliant formatting', 'Automatic categorization', 'Deduction summaries', 'Receipt links'],
      preview: 'Professional PDF with expense categories, totals, and tax-deductible items clearly highlighted',
      estimatedTime: '30 seconds',
      format: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'monthly-summary',
      name: 'Monthly Summary',
      description: 'Clean monthly overview with spending trends and category breakdowns',
      icon: Calendar,
      category: 'personal',
      premium: false,
      popular: true,
      features: ['Visual charts', 'Spending trends', 'Budget comparisons', 'Category insights'],
      preview: 'Executive summary with charts showing spending patterns and budget performance',
      estimatedTime: '15 seconds',
      format: ['PDF', 'PowerPoint', 'HTML']
    },
    {
      id: 'business-expense',
      name: 'Business Expense Report',
      description: 'Corporate-ready expense report for reimbursements and accounting',
      icon: Building,
      category: 'business',
      premium: true,
      popular: false,
      features: ['Approval workflows', 'Project tracking', 'Client billing', 'Mileage calculations'],
      preview: 'Professional business report with approval sections and detailed expense tracking',
      estimatedTime: '45 seconds',
      format: ['PDF', 'Excel', 'QuickBooks']
    },
    {
      id: 'analytics-deep-dive',
      name: 'Analytics Deep Dive',
      description: 'Advanced spending analytics with predictive insights and recommendations',
      icon: BarChart3,
      category: 'analytics',
      premium: true,
      popular: false,
      features: ['Predictive modeling', 'Spending forecasts', 'Anomaly detection', 'Recommendations'],
      preview: 'Data-rich analysis with machine learning insights and spending optimization tips',
      estimatedTime: '60 seconds',
      format: ['PDF', 'Excel', 'Tableau']
    },
    {
      id: 'category-analysis',
      name: 'Category Analysis',
      description: 'Detailed breakdown by expense categories with trend analysis',
      icon: PieChart,
      category: 'analytics',
      premium: false,
      popular: true,
      features: ['Category trends', 'YoY comparisons', 'Budget vs actual', 'Top vendors'],
      preview: 'Comprehensive category breakdown with visual charts and trend analysis',
      estimatedTime: '25 seconds',
      format: ['PDF', 'Excel', 'Google Sheets']
    },
    {
      id: 'investment-tracker',
      name: 'Investment & ROI Tracker',
      description: 'Track business investments and calculate returns on expense categories',
      icon: TrendingUp,
      category: 'business',
      premium: true,
      popular: false,
      features: ['ROI calculations', 'Investment tracking', 'Performance metrics', 'Goal tracking'],
      preview: 'Investment-focused report showing expense ROI and business impact metrics',
      estimatedTime: '40 seconds',
      format: ['PDF', 'Excel', 'PowerBI']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'tax', name: 'Tax & Compliance', count: templates.filter(t => t.category === 'tax').length },
    { id: 'business', name: 'Business', count: templates.filter(t => t.category === 'business').length },
    { id: 'personal', name: 'Personal', count: templates.filter(t => t.category === 'personal').length },
    { id: 'analytics', name: 'Analytics', count: templates.filter(t => t.category === 'analytics').length },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleExport = async (template: Template, format: string) => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    
    // Simulate file download
    alert(`Exporting "${template.name}" as ${format}. Download will start shortly.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Export Templates
          </h2>
          <p className="text-gray-600 mt-1">Professional export formats for every need</p>
        </div>
        <div className="text-sm text-gray-500">
          {expenses.length} expenses • Ready to export
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 relative overflow-hidden"
            >
              {/* Premium Badge */}
              {template.premium && (
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Pro
                  </div>
                </div>
              )}

              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.format.join(', ')}
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {template.format.map((format) => (
                      <button
                        key={format}
                        onClick={() => handleExport(template, format)}
                        disabled={isExporting}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          template.premium && !template.popular
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isExporting ? 'Exporting...' : `Export ${format}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Preview:</div>
                <div className="text-sm text-gray-700">{template.preview}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Template CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-1">Need a Custom Template?</h3>
            <p className="text-blue-700 text-sm">
              Our AI can generate custom export templates based on your specific requirements
            </p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Create Custom
          </button>
        </div>
      </div>
    </div>
  );
}