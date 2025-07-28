'use client';

import { useState } from 'react';
import { 
  Share2, 
  QrCode,
  Link,
  Users,
  Eye,
  EyeOff,
  Copy,
  Download,
  Calendar,
  Lock,
  Unlock,
  Settings,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  ExternalLink,
  Shield,
  Clock,
  BarChart3,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { Expense } from '@/types/expense';

interface SharedExportsProps {
  expenses: Expense[];
}

interface SharedLink {
  id: string;
  title: string;
  description: string;
  url: string;
  qrCode: string;
  password?: string;
  expiresAt?: string;
  createdAt: string;
  viewCount: number;
  downloadCount: number;
  isPublic: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  expenseCount: number;
  totalAmount: number;
  template: string;
  status: 'active' | 'expired' | 'disabled';
  recentViews: Array<{
    timestamp: string;
    location: string;
    device: string;
  }>;
}

export default function SharedExports({ expenses }: SharedExportsProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'create' | 'analytics'>('links');
  const [showQRModal, setShowQRModal] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');
  const [newLinkPassword, setNewLinkPassword] = useState('');
  const [newLinkExpiry, setNewLinkExpiry] = useState('');
  const [newLinkTemplate, setNewLinkTemplate] = useState('monthly-summary');

  const sharedLinks: SharedLink[] = [
    {
      id: '1',
      title: 'January Expenses - Team Review',
      description: 'Monthly expense summary for team review and approval',
      url: 'https://app.expensetracker.ai/shared/abc123def456',
      qrCode: 'QR_CODE_DATA_1',
      expiresAt: '2024-02-28',
      createdAt: '2024-01-28',
      viewCount: 12,
      downloadCount: 3,
      isPublic: false,
      allowDownload: true,
      allowComments: true,
      expenseCount: 45,
      totalAmount: 2847.50,
      template: 'Monthly Summary',
      status: 'active',
      recentViews: [
        { timestamp: '2024-01-28 10:30', location: 'San Francisco, CA', device: 'Desktop' },
        { timestamp: '2024-01-28 09:15', location: 'New York, NY', device: 'Mobile' },
        { timestamp: '2024-01-27 16:45', location: 'London, UK', device: 'Tablet' },
      ]
    },
    {
      id: '2',
      title: 'Q1 Business Expenses',
      description: 'Comprehensive quarterly report for stakeholders',
      url: 'https://app.expensetracker.ai/shared/xyz789ghi012',
      qrCode: 'QR_CODE_DATA_2',
      password: 'protected',
      createdAt: '2024-01-25',
      viewCount: 28,
      downloadCount: 8,
      isPublic: true,
      allowDownload: true,
      allowComments: false,
      expenseCount: 156,
      totalAmount: 12450.75,
      template: 'Business Report',
      status: 'active',
      recentViews: [
        { timestamp: '2024-01-28 11:00', location: 'Austin, TX', device: 'Desktop' },
        { timestamp: '2024-01-28 08:22', location: 'Seattle, WA', device: 'Mobile' },
      ]
    },
    {
      id: '3',
      title: 'Tax Preparation Documents',
      description: 'Year-end tax documents and receipts',
      url: 'https://app.expensetracker.ai/shared/tax2024abc',
      qrCode: 'QR_CODE_DATA_3',
      expiresAt: '2024-04-15',
      createdAt: '2024-01-20',
      viewCount: 5,
      downloadCount: 2,
      isPublic: false,
      allowDownload: false,
      allowComments: false,
      expenseCount: 89,
      totalAmount: 8950.25,
      template: 'Tax Report',
      status: 'active',
      recentViews: [
        { timestamp: '2024-01-26 14:15', location: 'Chicago, IL', device: 'Desktop' },
      ]
    }
  ];

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleCreateLink = () => {
    if (!newLinkTitle.trim()) {
      alert('Please enter a title for your shared link');
      return;
    }

    const newLink: Partial<SharedLink> = {
      title: newLinkTitle,
      description: newLinkDescription,
      password: newLinkPassword || undefined,
      expiresAt: newLinkExpiry || undefined,
      expenseCount: expenses.length,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      template: newLinkTemplate
    };

    alert(`Created shared link: "${newLinkTitle}"`);
    
    // Reset form
    setNewLinkTitle('');
    setNewLinkDescription('');
    setNewLinkPassword('');
    setNewLinkExpiry('');
    setActiveTab('links');
  };

  const handleToggleStatus = (linkId: string) => {
    const link = sharedLinks.find(l => l.id === linkId);
    alert(`${link?.status === 'active' ? 'Disabled' : 'Enabled'} shared link: "${link?.title}"`);
  };

  const handleDeleteLink = (linkId: string) => {
    const link = sharedLinks.find(l => l.id === linkId);
    if (confirm(`Are you sure you want to delete "${link?.title}"?`)) {
      alert(`Deleted shared link: "${link?.title}"`);
    }
  };

  const generateQRCode = (linkId: string) => {
    // This would generate an actual QR code in a real implementation
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjczODAiPgogICAgUVIgQ29kZQogIDwvdGV4dD4KPC9zdmc+`;
  };

  const totalViews = sharedLinks.reduce((sum, link) => sum + link.viewCount, 0);
  const totalDownloads = sharedLinks.reduce((sum, link) => sum + link.downloadCount, 0);
  const activeLinks = sharedLinks.filter(link => link.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="w-7 h-7 text-blue-600" />
            Shared Exports
          </h2>
          <p className="text-gray-600 mt-1">Create and manage shareable expense reports</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeLinks}</div>
              <div className="text-sm text-gray-600">Active Links</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalDownloads}</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {sharedLinks.reduce((sum, link) => sum + link.recentViews.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Unique Viewers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'links', label: 'Shared Links', icon: Link },
            { id: 'create', label: 'Create New', icon: Plus },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          {sharedLinks.map((link) => (
            <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {link.status}
                    </div>
                    {link.password && (
                      <Lock className="w-4 h-4 text-orange-500" title="Password Protected" />
                    )}
                    {link.isPublic && (
                      <Globe className="w-4 h-4 text-blue-500" title="Public Link" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{link.description}</p>
                  
                  {/* Link URL */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 font-mono flex-1 truncate">
                      {link.url}
                    </div>
                    <button
                      onClick={() => handleCopyLink(link.url)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowQRModal(link.id)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Show QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Views:</span>
                      <span className="text-gray-900 font-medium ml-1">{link.viewCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Downloads:</span>
                      <span className="text-gray-900 font-medium ml-1">{link.downloadCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expenses:</span>
                      <span className="text-gray-900 font-medium ml-1">{link.expenseCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <span className="text-gray-900 font-medium ml-1">${link.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Expiry */}
                  {link.expiresAt && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-orange-600">
                      <Calendar className="w-4 h-4" />
                      Expires on {new Date(link.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(link.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(link.id)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title={link.status === 'active' ? 'Disable' : 'Enable'}
                  >
                    {link.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recent Views */}
              {link.recentViews.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {link.recentViews.slice(0, 3).map((view, index) => (
                      <div key={index} className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-3 h-3" />
                          <span>{view.device} from {view.location}</span>
                        </div>
                        <span>{view.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Shared Link</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="e.g., Monthly Expense Report"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                <select
                  value={newLinkTemplate}
                  onChange={(e) => setNewLinkTemplate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly-summary">Monthly Summary</option>
                  <option value="tax-report">Tax Report</option>
                  <option value="business-expense">Business Expense Report</option>
                  <option value="category-analysis">Category Analysis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newLinkDescription}
                onChange={(e) => setNewLinkDescription(e.target.value)}
                placeholder="Optional description for the shared report..."
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Protection</label>
                <input
                  type="password"
                  value={newLinkPassword}
                  onChange={(e) => setNewLinkPassword(e.target.value)}
                  placeholder="Optional password"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={newLinkExpiry}
                  onChange={(e) => setNewLinkExpiry(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Export Preview</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <span className="text-blue-600">Expenses:</span>
                  <span className="font-medium ml-1">{expenses.length}</span>
                </div>
                <div>
                  <span className="text-blue-600">Total Amount:</span>
                  <span className="font-medium ml-1">
                    ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('links')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLink}
                disabled={!newLinkTitle.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create Shared Link
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sharing Analytics</h3>
            <div className="text-gray-600">
              <p>Detailed analytics and insights coming soon...</p>
              <p className="mt-2">Track engagement, popular content, and sharing patterns.</p>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="mb-4">
              <img
                src={generateQRCode(showQRModal)}
                alt="QR Code"
                className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
              />
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Scan this QR code to access the shared expense report
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQRModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Download QR code functionality
                  alert('QR code downloaded!');
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}