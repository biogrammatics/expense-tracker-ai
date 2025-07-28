'use client';

import { useState } from 'react';
import { 
  Zap, 
  Settings,
  Cloud,
  Check,
  Plus,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Database,
  Archive,
  Smartphone,
  Globe,
  Shield,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Expense } from '@/types/expense';

interface CloudIntegrationsProps {
  expenses: Expense[];
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'spreadsheets' | 'storage' | 'accounting' | 'business';
  connected: boolean;
  lastSync?: string;
  status: 'active' | 'error' | 'syncing' | 'disconnected';
  features: string[];
  premium: boolean;
  autoSync: boolean;
  syncFrequency?: string;
}

export default function CloudIntegrations({ expenses }: CloudIntegrationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSetupModal, setShowSetupModal] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const integrations: Integration[] = [
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Real-time sync with Google Sheets for collaborative expense tracking',
      icon: '📊',
      category: 'spreadsheets',
      connected: true,
      lastSync: '2 minutes ago',
      status: 'active',
      features: ['Real-time sync', 'Collaborative editing', 'Custom formulas', 'Chart integration'],
      premium: false,
      autoSync: true,
      syncFrequency: 'Every 5 minutes'
    },
    {
      id: 'microsoft-excel',
      name: 'Microsoft Excel Online',
      description: 'Sync expense data with Excel Online and Office 365',
      icon: '📈',
      category: 'spreadsheets',
      connected: false,
      status: 'disconnected',
      features: ['Excel templates', 'Power BI integration', 'Office 365 sync', 'Advanced analytics'],
      premium: true,
      autoSync: false
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Automatically backup expense reports to Google Drive',
      icon: '💾',
      category: 'storage',
      connected: true,
      lastSync: '1 hour ago',
      status: 'active',
      features: ['Automatic backup', 'Version history', 'Shared folders', 'Large file support'],
      premium: false,
      autoSync: true,
      syncFrequency: 'Daily at 2 AM'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Secure cloud storage for expense reports and receipts',
      icon: '📦',
      category: 'storage',
      connected: false,
      status: 'disconnected',
      features: ['Smart sync', 'Advanced sharing', 'Version recovery', 'Team collaboration'],
      premium: true,
      autoSync: false
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      description: 'Microsoft OneDrive integration for seamless file management',
      icon: '☁️',
      category: 'storage',
      connected: true,
      lastSync: 'Syncing...',
      status: 'syncing',
      features: ['Office integration', 'Real-time collaboration', 'Advanced security', 'Large storage'],
      premium: true,
      autoSync: true,
      syncFrequency: 'Real-time'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      description: 'Direct integration with QuickBooks for accounting workflows',
      icon: '💼',
      category: 'accounting',
      connected: false,
      status: 'disconnected',
      features: ['Invoice creation', 'Tax categories', 'Chart of accounts', 'Financial reports'],
      premium: true,
      autoSync: false
    },
    {
      id: 'xero',
      name: 'Xero',
      description: 'Professional accounting software integration',
      icon: '📊',
      category: 'accounting',
      connected: true,
      lastSync: 'Error 3 hours ago',
      status: 'error',
      features: ['Multi-currency', 'Bank reconciliation', 'Tax compliance', 'Custom reports'],
      premium: true,
      autoSync: true,
      syncFrequency: 'Hourly'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Create expense databases and reports in Notion workspaces',
      icon: '📝',
      category: 'business',
      connected: true,
      lastSync: '30 minutes ago',
      status: 'active',
      features: ['Database creation', 'Custom views', 'Template library', 'Team collaboration'],
      premium: false,
      autoSync: true,
      syncFrequency: 'Every 15 minutes'
    },
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Flexible database management for expense tracking',
      icon: '🗃️',
      category: 'business',
      connected: false,
      status: 'disconnected',
      features: ['Custom fields', 'Automation', 'API access', 'Advanced filtering'],
      premium: true,
      autoSync: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'spreadsheets', name: 'Spreadsheets', count: integrations.filter(i => i.category === 'spreadsheets').length },
    { id: 'storage', name: 'Cloud Storage', count: integrations.filter(i => i.category === 'storage').length },
    { id: 'accounting', name: 'Accounting', count: integrations.filter(i => i.category === 'accounting').length },
    { id: 'business', name: 'Business Tools', count: integrations.filter(i => i.category === 'business').length },
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const connectedCount = integrations.filter(i => i.connected).length;
  const activeCount = integrations.filter(i => i.status === 'active').length;

  const handleConnect = async (integrationId: string) => {
    setShowSetupModal(integrationId);
  };

  const handleDisconnect = async (integrationId: string) => {
    // Simulate disconnection
    alert(`Disconnected from ${integrations.find(i => i.id === integrationId)?.name}`);
  };

  const handleSync = async (integrationId: string) => {
    setIsSyncing(integrationId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(null);
    alert(`Synced with ${integrations.find(i => i.id === integrationId)?.name} successfully!`);
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'syncing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-7 h-7 text-blue-600" />
            Cloud Integrations
          </h2>
          <p className="text-gray-600 mt-1">Connect to your favorite cloud services and tools</p>
        </div>
        <div className="text-sm text-gray-500">
          {connectedCount} of {integrations.length} connected • {activeCount} active
        </div>
      </div>

      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{connectedCount}</div>
              <div className="text-sm text-gray-600">Connected</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
              <div className="text-sm text-gray-600">Active Syncs</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{expenses.length}</div>
              <div className="text-sm text-gray-600">Expenses Ready</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Auto Sync</div>
            </div>
          </div>
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

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {integration.name}
                    {integration.premium && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-xs">
                        Pro
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">{integration.description}</p>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(integration.status)}`}>
                {getStatusIcon(integration.status)}
                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {integration.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {feature}
                  </span>
                ))}
                {integration.features.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{integration.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Sync Info */}
            {integration.connected && integration.lastSync && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last sync:</span>
                  <span className="text-gray-900 font-medium">{integration.lastSync}</span>
                </div>
                {integration.syncFrequency && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="text-gray-900 font-medium">{integration.syncFrequency}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {integration.connected ? (
                <>
                  <button
                    onClick={() => handleSync(integration.id)}
                    disabled={isSyncing === integration.id || integration.status === 'syncing'}
                    className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSyncing === integration.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Sync Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Integration Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulk Sync */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Bulk Sync Operations</h3>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            Sync all connected integrations simultaneously for maximum efficiency
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync All Connected
          </button>
        </div>

        {/* Integration Marketplace */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Integration Marketplace</h3>
          </div>
          <p className="text-purple-700 text-sm mb-4">
            Discover more integrations and custom connectors for your workflow
          </p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Browse Marketplace
          </button>
        </div>
      </div>

      {/* Setup Modal Placeholder */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connect to {integrations.find(i => i.id === showSetupModal)?.name}
            </h3>
            <p className="text-gray-600 mb-6">
              You'll be redirected to authorize the connection. This typically takes 30-60 seconds.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSetupModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSetupModal(null);
                  alert('Redirecting to authorization...');
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}