'use client';

import { useState } from 'react';
import { 
  History, 
  Download,
  Mail,
  Share2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  Eye,
  Trash2,
  Filter,
  Search,
  ExternalLink,
  User,
  Globe
} from 'lucide-react';

interface ExportRecord {
  id: string;
  type: 'email' | 'download' | 'share' | 'integration';
  destination: string;
  format: string;
  status: 'completed' | 'failed' | 'pending' | 'scheduled';
  timestamp: string;
  fileSize?: string;
  recipientCount?: number;
  downloadCount?: number;
  expenseCount: number;
  totalAmount: number;
  template?: string;
  error?: string;
  deliveryStatus?: string;
}

export default function ExportHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<ExportRecord | null>(null);

  const exportHistory: ExportRecord[] = [
    {
      id: '1',
      type: 'email',
      destination: 'accountant@company.com',
      format: 'PDF',
      status: 'completed',
      timestamp: '2024-01-28 09:15:00',
      recipientCount: 1,
      expenseCount: 45,
      totalAmount: 2847.50,
      template: 'Tax Report 2024',
      deliveryStatus: 'Delivered successfully'
    },
    {
      id: '2',
      type: 'integration',
      destination: 'Google Sheets',
      format: 'Live Sync',
      status: 'completed',
      timestamp: '2024-01-28 08:30:00',
      expenseCount: 45,
      totalAmount: 2847.50,
      deliveryStatus: 'Synced to "Monthly Budget 2024"'
    },
    {
      id: '3',
      type: 'share',
      destination: 'Shared Link',
      format: 'Web Dashboard',
      status: 'completed',
      timestamp: '2024-01-27 16:45:00',
      downloadCount: 7,
      expenseCount: 42,
      totalAmount: 2693.25,
      deliveryStatus: 'Active - 7 views'
    },
    {
      id: '4',
      type: 'download',
      destination: 'Local Download',
      format: 'Excel',
      status: 'completed',
      timestamp: '2024-01-27 14:22:00',
      fileSize: '2.3 MB',
      expenseCount: 42,
      totalAmount: 2693.25,
      template: 'Monthly Summary'
    },
    {
      id: '5',
      type: 'email',
      destination: 'team@company.com',
      format: 'PDF',
      status: 'failed',
      timestamp: '2024-01-27 11:30:00',
      recipientCount: 3,
      expenseCount: 38,
      totalAmount: 2450.00,
      template: 'Business Expense Report',
      error: 'SMTP server timeout - automatic retry scheduled'
    },
    {
      id: '6',
      type: 'integration',
      destination: 'QuickBooks Online',
      format: 'QBO Format',
      status: 'pending',
      timestamp: '2024-01-27 10:15:00',
      expenseCount: 38,
      totalAmount: 2450.00,
      deliveryStatus: 'Authenticating connection...'
    },
    {
      id: '7',
      type: 'email',
      destination: 'manager@company.com',
      format: 'PDF',
      status: 'scheduled',
      timestamp: '2024-01-29 09:00:00',
      recipientCount: 1,
      expenseCount: 45,
      totalAmount: 2847.50,
      template: 'Weekly Summary',
      deliveryStatus: 'Scheduled for tomorrow at 9:00 AM'
    }
  ];

  const filteredHistory = exportHistory.filter(record => {
    const matchesSearch = record.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.template?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: ExportRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: ExportRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'pending':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'scheduled':
        return 'text-orange-700 bg-orange-50 border-orange-200';
    }
  };

  const getTypeIcon = (type: ExportRecord['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'download':
        return <Download className="w-4 h-4" />;
      case 'share':
        return <Share2 className="w-4 h-4" />;
      case 'integration':
        return <Globe className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleRetry = (recordId: string) => {
    alert(`Retrying export for record ${recordId}...`);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('Are you sure you want to delete this export record?')) {
      alert(`Deleted export record ${recordId}`);
    }
  };

  const stats = {
    total: exportHistory.length,
    completed: exportHistory.filter(r => r.status === 'completed').length,
    failed: exportHistory.filter(r => r.status === 'failed').length,
    pending: exportHistory.filter(r => r.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-7 h-7 text-blue-600" />
            Export History
          </h2>
          <p className="text-gray-600 mt-1">Track all your export activities and deliveries</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Exports</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="download">Download</option>
            <option value="share">Share</option>
            <option value="integration">Integration</option>
          </select>
        </div>
      </div>

      {/* Export History Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Export Details</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Destination</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Data</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        {getTypeIcon(record.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {record.type} Export
                        </div>
                        <div className="text-sm text-gray-600">
                          {record.format} • {formatTimestamp(record.timestamp)}
                        </div>
                        {record.template && (
                          <div className="text-xs text-blue-600 mt-1">{record.template}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="text-gray-900 font-medium">{record.destination}</div>
                    {record.deliveryStatus && (
                      <div className="text-sm text-gray-600 mt-1">{record.deliveryStatus}</div>
                    )}
                    {record.recipientCount && (
                      <div className="text-xs text-gray-500 mt-1">
                        {record.recipientCount} recipient{record.recipientCount > 1 ? 's' : ''}
                      </div>
                    )}
                    {record.downloadCount && (
                      <div className="text-xs text-gray-500 mt-1">
                        {record.downloadCount} view{record.downloadCount > 1 ? 's' : ''}
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </div>
                    {record.error && (
                      <div className="text-xs text-red-600 mt-2 max-w-xs">{record.error}</div>
                    )}
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {record.expenseCount} expenses
                    </div>
                    <div className="text-sm text-gray-600">
                      ${record.totalAmount.toFixed(2)}
                    </div>
                    {record.fileSize && (
                      <div className="text-xs text-gray-500 mt-1">{record.fileSize}</div>
                    )}
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {record.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(record.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Retry Export"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      
                      {record.type === 'share' && record.status === 'completed' && (
                        <button
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Open Shared Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Export Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Export Type</label>
                  <div className="text-gray-900 capitalize">{selectedRecord.type} Export</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Format</label>
                  <div className="text-gray-900">{selectedRecord.format}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Destination</label>
                  <div className="text-gray-900">{selectedRecord.destination}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(selectedRecord.status)}`}>
                    {getStatusIcon(selectedRecord.status)}
                    {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Data Summary */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Data Summary</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Expenses:</span>
                      <span className="text-gray-900 font-medium ml-2">{selectedRecord.expenseCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-gray-900 font-medium ml-2">${selectedRecord.totalAmount.toFixed(2)}</span>
                    </div>
                    {selectedRecord.fileSize && (
                      <div>
                        <span className="text-gray-600">File Size:</span>
                        <span className="text-gray-900 font-medium ml-2">{selectedRecord.fileSize}</span>
                      </div>
                    )}
                    {selectedRecord.template && (
                      <div>
                        <span className="text-gray-600">Template:</span>
                        <span className="text-gray-900 font-medium ml-2">{selectedRecord.template}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              {selectedRecord.deliveryStatus && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Delivery Status</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-blue-800">{selectedRecord.deliveryStatus}</div>
                  </div>
                </div>
              )}

              {/* Error Info */}
              {selectedRecord.error && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Error Details</label>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800">{selectedRecord.error}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}