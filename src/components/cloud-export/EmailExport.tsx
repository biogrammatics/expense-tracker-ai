'use client';

import { useState } from 'react';
import { 
  Mail, 
  Send, 
  Calendar,
  Clock,
  Users,
  Eye,
  Edit3,
  Plus,
  X,
  Check,
  Paperclip,
  Shield,
  Zap,
  Globe,
  Bell,
  ChevronDown
} from 'lucide-react';
import { Expense } from '@/types/expense';

interface EmailExportProps {
  expenses: Expense[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview: string;
  professional: boolean;
}

interface Recipient {
  id: string;
  email: string;
  name: string;
  role: string;
  lastSent?: string;
}

export default function EmailExport({ expenses }: EmailExportProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional');
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', email: 'accountant@company.com', name: 'Sarah Johnson', role: 'Accountant', lastSent: '2024-01-15' },
    { id: '2', email: 'manager@company.com', name: 'Mike Chen', role: 'Manager' },
  ]);
  const [newRecipient, setNewRecipient] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingMode, setSendingMode] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [encryptEmail, setEncryptEmail] = useState(false);
  const [notifyDelivery, setNotifyDelivery] = useState(true);

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'professional',
      name: 'Professional Report',
      subject: 'Monthly Expense Report - {{month}} {{year}}',
      preview: 'Formal business email with expense summary and professional formatting',
      professional: true
    },
    {
      id: 'summary',
      name: 'Executive Summary',
      subject: 'Expense Summary - {{period}}',
      preview: 'Concise overview with key metrics and highlights for executives',
      professional: true
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      subject: 'Comprehensive Expense Analysis - {{date}}',
      preview: 'In-depth analysis with charts, trends, and detailed breakdowns',
      professional: true
    },
    {
      id: 'custom',
      name: 'Custom Message',
      subject: '',
      preview: 'Create your own personalized email message',
      professional: false
    }
  ];

  const handleAddRecipient = () => {
    if (newRecipient && newRecipient.includes('@')) {
      const newId = Date.now().toString();
      setRecipients([...recipients, {
        id: newId,
        email: newRecipient,
        name: newRecipient.split('@')[0],
        role: 'Recipient'
      }]);
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSending(false);
    alert(`Email ${sendingMode === 'now' ? 'sent' : 'scheduled'} successfully to ${recipients.length} recipient(s)!`);
  };

  const generatePreview = () => {
    const template = emailTemplates.find(t => t.id === selectedTemplate);
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expenseCount = expenses.length;
    
    return {
      subject: customSubject || template?.subject.replace('{{month}}', 'January').replace('{{year}}', '2024').replace('{{period}}', 'Q1 2024').replace('{{date}}', 'Jan 28, 2024') || 'Expense Report',
      body: customMessage || `Dear Recipient,

Please find attached the expense report containing ${expenseCount} expenses totaling $${totalAmount.toFixed(2)}.

Key highlights:
• Total expenses: $${totalAmount.toFixed(2)}
• Number of transactions: ${expenseCount}
• Reporting period: Current month
• Categories covered: ${[...new Set(expenses.map(e => e.category))].join(', ')}

The attached report includes detailed breakdowns, receipts, and supporting documentation.

Best regards,
ExpenseTracker Team`
    };
  };

  const preview = generatePreview();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-7 h-7 text-blue-600" />
            Email Export
          </h2>
          <p className="text-gray-600 mt-1">Send professional expense reports via email</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Composition */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emailTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.preview}</div>
                  {template.professional && (
                    <div className="mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Professional</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Subject & Message */}
          {selectedTemplate === 'custom' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Write your custom message..."
                    rows={6}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recipients */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recipients</h3>
              <span className="text-sm text-gray-500">{recipients.length} selected</span>
            </div>
            
            {/* Add New Recipient */}
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="Enter email address..."
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddRecipient}
                disabled={!newRecipient.includes('@')}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Recipients List */}
            <div className="space-y-2">
              {recipients.map((recipient) => (
                <div key={recipient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {recipient.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{recipient.name}</div>
                      <div className="text-sm text-gray-600">{recipient.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{recipient.role}</span>
                    <button
                      onClick={() => handleRemoveRecipient(recipient.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Send Options */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Options</h3>
            
            {/* Send Mode */}
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setSendingMode('now')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    sendingMode === 'now'
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Send Now
                </button>
                <button
                  onClick={() => setSendingMode('scheduled')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    sendingMode === 'scheduled'
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>

              {sendingMode === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeAttachments}
                  onChange={(e) => setIncludeAttachments(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900">Include expense report attachment</span>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={encryptEmail}
                  onChange={(e) => setEncryptEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900">Encrypt email (Enterprise)</span>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyDelivery}
                  onChange={(e) => setNotifyDelivery(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900">Notify me when delivered</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Email Preview */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Email Preview
            </h3>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Email Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Subject:</div>
                <div className="font-medium text-gray-900">{preview.subject}</div>
              </div>
              
              {/* Email Body */}
              <div className="p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {preview.body}
                </pre>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Expenses:</span>
                <span className="text-gray-900 font-medium">{expenses.length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-gray-900 font-medium">
                  ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipients:</span>
                <span className="text-gray-900 font-medium">{recipients.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span className="text-gray-900 font-medium">
                  {sendingMode === 'now' ? 'Immediate' : 'Scheduled'}
                </span>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendEmail}
            disabled={isSending || recipients.length === 0}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-lg font-medium"
          >
            {isSending ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {sendingMode === 'now' ? 'Send Email' : 'Schedule Email'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}