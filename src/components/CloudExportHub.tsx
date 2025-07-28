'use client';

import { useState, useEffect } from 'react';
import { 
  Cloud, 
  Download, 
  Share2, 
  Mail, 
  Calendar,
  History,
  FileText,
  Settings,
  Zap,
  Globe,
  QrCode,
  Smartphone,
  Shield,
  Clock
} from 'lucide-react';
import { Expense } from '@/types/expense';
import ExportTemplates from './cloud-export/ExportTemplates';
import EmailExport from './cloud-export/EmailExport';
import CloudIntegrations from './cloud-export/CloudIntegrations';
import ExportHistory from './cloud-export/ExportHistory';
import SharedExports from './cloud-export/SharedExports';
import AutoBackupScheduler from './cloud-export/AutoBackupScheduler';

interface CloudExportHubProps {
  expenses: Expense[];
  onClose: () => void;
}

type ExportView = 'overview' | 'templates' | 'email' | 'integrations' | 'history' | 'sharing' | 'automation';

export default function CloudExportHub({ expenses, onClose }: CloudExportHubProps) {
  const [currentView, setCurrentView] = useState<ExportView>('overview');
  const [isConnected, setIsConnected] = useState(true);
  const [activeExports, setActiveExports] = useState(3);
  const [storageUsed, setStorageUsed] = useState(156); // MB

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Cloud, description: 'Export dashboard' },
    { id: 'templates', label: 'Templates', icon: FileText, description: 'Pre-built export formats' },
    { id: 'email', label: 'Email Export', icon: Mail, description: 'Send reports via email' },
    { id: 'integrations', label: 'Integrations', icon: Zap, description: 'Connect to cloud services' },
    { id: 'history', label: 'History', icon: History, description: 'Export activity log' },
    { id: 'sharing', label: 'Sharing', icon: Share2, description: 'Shareable links & QR codes' },
    { id: 'automation', label: 'Automation', icon: Calendar, description: 'Scheduled exports' },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'templates':
        return <ExportTemplates expenses={expenses} />;
      case 'email':
        return <EmailExport expenses={expenses} />;
      case 'integrations':
        return <CloudIntegrations expenses={expenses} />;
      case 'history':
        return <ExportHistory />;
      case 'sharing':
        return <SharedExports expenses={expenses} />;
      case 'automation':
        return <AutoBackupScheduler expenses={expenses} />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <Cloud className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Cloud Connected</span>
          </div>
          <Shield className="w-4 h-4 text-green-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Active Exports</span>
            <div className="font-semibold text-green-700">{activeExports} running</div>
          </div>
          <div>
            <span className="text-gray-600">Storage Used</span>
            <div className="font-semibold text-blue-700">{storageUsed} MB / 5 GB</div>
          </div>
          <div>
            <span className="text-gray-600">Last Sync</span>
            <div className="font-semibold text-gray-700">2 minutes ago</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView('email')}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 group"
        >
          <Mail className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 mb-1">Email Report</h3>
          <p className="text-sm text-gray-600">Send formatted reports instantly</p>
        </button>

        <button
          onClick={() => setCurrentView('sharing')}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 group"
        >
          <QrCode className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 mb-1">Share & Collaborate</h3>
          <p className="text-sm text-gray-600">Generate shareable links</p>
        </button>

        <button
          onClick={() => setCurrentView('integrations')}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300 group"
        >
          <Zap className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 mb-1">Cloud Sync</h3>
          <p className="text-sm text-gray-600">Auto-sync to your favorite apps</p>
        </button>

        <button
          onClick={() => setCurrentView('automation')}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-300 group"
        >
          <Calendar className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 mb-1">Auto Backup</h3>
          <p className="text-sm text-gray-600">Schedule recurring exports</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Export Activity</h3>
          <button
            onClick={() => setCurrentView('history')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {[
            { type: 'Email', recipient: 'accountant@company.com', time: '5 minutes ago', status: 'sent' },
            { type: 'Google Sheets', target: 'Monthly Budget 2024', time: '1 hour ago', status: 'synced' },
            { type: 'Shared Link', recipient: 'team-finance', time: '3 hours ago', status: 'active' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-gray-900">{activity.type}</span>
                  <span className="text-gray-600 ml-2">→ {activity.recipient}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Smart Export Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-800 mb-1">Optimal Export Time</div>
            <div className="text-blue-700">Weekdays at 9 AM get 40% higher engagement</div>
          </div>
          <div>
            <div className="font-medium text-blue-800 mb-1">Popular Format</div>
            <div className="text-blue-700">Tax Report template used most this month</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex overflow-hidden shadow-2xl">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cloud Export</h2>
                <p className="text-sm text-gray-600">Professional data export suite</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
            >
              ×
            </button>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ExportView)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-md border border-blue-100'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">{item.description}</p>
                </button>
              );
            })}
          </nav>

          {/* Connection Status */}
          <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Cloud Status</span>
            </div>
            <p className="text-xs text-gray-600">All integrations operational</p>
            <div className="mt-2 bg-gray-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Sync health: 94%</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  );
}