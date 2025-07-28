'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Cloud,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Bell,
  Users,
  Database,
  Shield,
  Activity
} from 'lucide-react';
import { Expense } from '@/types/expense';

interface AutoBackupSchedulerProps {
  expenses: Expense[];
}

interface BackupSchedule {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  isActive: boolean;
  destinations: {
    type: 'email' | 'cloud' | 'integration';
    target: string;
    format: string;
  }[];
  template: string;
  filters?: {
    categories?: string[];
    dateRange?: string;
    minAmount?: number;
  };
  lastRun?: string;
  nextRun: string;
  runCount: number;
  successRate: number;
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    recipients: string[];
  };
}

export default function AutoBackupScheduler({ expenses }: AutoBackupSchedulerProps) {
  const [activeTab, setActiveTab] = useState<'schedules' | 'create' | 'logs'>('schedules');
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  
  // Form state for creating new schedule
  const [newScheduleName, setNewScheduleName] = useState('');
  const [newScheduleDescription, setNewScheduleDescription] = useState('');
  const [newScheduleFrequency, setNewScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [newScheduleTime, setNewScheduleTime] = useState('09:00');
  const [newScheduleDayOfWeek, setNewScheduleDayOfWeek] = useState(1); // Monday
  const [newScheduleTemplate, setNewScheduleTemplate] = useState('monthly-summary');

  const schedules: BackupSchedule[] = [
    {
      id: '1',
      name: 'Weekly Team Report',
      description: 'Automated weekly expense summary for team review',
      frequency: 'weekly',
      time: '09:00',
      dayOfWeek: 1, // Monday
      isActive: true,
      destinations: [
        { type: 'email', target: 'team@company.com', format: 'PDF' },
        { type: 'cloud', target: 'Google Drive', format: 'Excel' }
      ],
      template: 'Business Expense Report',
      lastRun: '2024-01-22 09:00:00',
      nextRun: '2024-01-29 09:00:00',
      runCount: 12,
      successRate: 100,
      notifications: {
        onSuccess: true,
        onFailure: true,
        recipients: ['admin@company.com']
      }
    },
    {
      id: '2',
      name: 'Monthly Accounting Backup',
      description: 'End-of-month backup to accounting system',
      frequency: 'monthly',
      time: '02:00',
      dayOfMonth: 1,
      isActive: true,
      destinations: [
        { type: 'integration', target: 'QuickBooks Online', format: 'QBO' },
        { type: 'email', target: 'accountant@company.com', format: 'Excel' }
      ],
      template: 'Tax Report 2024',
      filters: {
        categories: ['Business', 'Travel', 'Meals'],
        minAmount: 10
      },
      lastRun: '2024-01-01 02:00:00',
      nextRun: '2024-02-01 02:00:00',
      runCount: 6,
      successRate: 83.3,
      notifications: {
        onSuccess: true,
        onFailure: true,
        recipients: ['admin@company.com', 'accountant@company.com']
      }
    },
    {
      id: '3',
      name: 'Daily Cloud Sync',
      description: 'Daily backup to multiple cloud storage providers',
      frequency: 'daily',
      time: '23:30',
      isActive: false,
      destinations: [
        { type: 'cloud', target: 'Google Drive', format: 'CSV' },
        { type: 'cloud', target: 'Dropbox', format: 'JSON' },
        { type: 'cloud', target: 'OneDrive', format: 'Excel' }
      ],
      template: 'Category Analysis',
      nextRun: '2024-01-29 23:30:00',
      runCount: 45,
      successRate: 95.6,
      notifications: {
        onSuccess: false,
        onFailure: true,
        recipients: ['admin@company.com']
      }
    }
  ];

  const activeSchedules = schedules.filter(s => s.isActive).length;
  const totalRuns = schedules.reduce((sum, s) => sum + s.runCount, 0);
  const avgSuccessRate = schedules.reduce((sum, s) => sum + s.successRate, 0) / schedules.length;

  const handleToggleSchedule = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    alert(`${schedule?.isActive ? 'Paused' : 'Activated'} schedule: "${schedule?.name}"`);
  };

  const handleRunNow = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    alert(`Running schedule "${schedule?.name}" now...`);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (confirm(`Are you sure you want to delete "${schedule?.name}"?`)) {
      alert(`Deleted schedule: "${schedule?.name}"`);
    }
  };

  const handleCreateSchedule = () => {
    if (!newScheduleName.trim()) {
      alert('Please enter a name for your schedule');
      return;
    }

    alert(`Created new schedule: "${newScheduleName}"`);
    
    // Reset form
    setNewScheduleName('');
    setNewScheduleDescription('');
    setNewScheduleFrequency('weekly');
    setNewScheduleTime('09:00');
    setNewScheduleDayOfWeek(1);
    setActiveTab('schedules');
  };

  const getFrequencyText = (schedule: BackupSchedule) => {
    switch (schedule.frequency) {
      case 'daily':
        return `Daily at ${schedule.time}`;
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Weekly on ${days[schedule.dayOfWeek || 0]} at ${schedule.time}`;
      case 'monthly':
        return `Monthly on day ${schedule.dayOfMonth} at ${schedule.time}`;
      case 'quarterly':
        return `Quarterly at ${schedule.time}`;
      case 'yearly':
        return `Yearly at ${schedule.time}`;
      default:
        return schedule.frequency;
    }
  };

  const getNextRunStatus = (nextRun: string) => {
    const next = new Date(nextRun);
    const now = new Date();
    const diffInHours = (next.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 0) {
      return 'Overdue';
    } else if (diffInHours < 24) {
      return `In ${Math.ceil(diffInHours)} hours`;
    } else {
      return `In ${Math.ceil(diffInHours / 24)} days`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Automated Backups
          </h2>
          <p className="text-gray-600 mt-1">Schedule automatic exports and backups</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeSchedules}</div>
              <div className="text-sm text-gray-600">Active Schedules</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalRuns}</div>
              <div className="text-sm text-gray-600">Total Runs</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{avgSuccessRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{expenses.length}</div>
              <div className="text-sm text-gray-600">Ready to Backup</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'schedules', label: 'Schedules', icon: Calendar },
            { id: 'create', label: 'Create New', icon: Plus },
            { id: 'logs', label: 'Activity Logs', icon: Activity }
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
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{schedule.name}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      schedule.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.isActive ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                      {schedule.isActive ? 'Active' : 'Paused'}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{schedule.description}</p>
                  
                  {/* Schedule Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <div className="text-gray-900 font-medium">{getFrequencyText(schedule)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Run:</span>
                      <div className="text-gray-900 font-medium">{getNextRunStatus(schedule.nextRun)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Success Rate:</span>
                      <div className="text-gray-900 font-medium">{schedule.successRate}% ({schedule.runCount} runs)</div>
                    </div>
                  </div>

                  {/* Destinations */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Destinations:</div>
                    <div className="flex flex-wrap gap-2">
                      {schedule.destinations.map((dest, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                          {dest.type === 'email' && <Mail className="w-3 h-3" />}
                          {dest.type === 'cloud' && <Cloud className="w-3 h-3" />}
                          {dest.type === 'integration' && <Zap className="w-3 h-3" />}
                          <span className="text-gray-700">
                            {dest.target} ({dest.format})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filters */}
                  {schedule.filters && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Filters:</div>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {schedule.filters.categories && (
                          <div>Categories: {schedule.filters.categories.join(', ')}</div>
                        )}
                        {schedule.filters.minAmount && (
                          <div>Minimum amount: ${schedule.filters.minAmount}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunNow(schedule.id)}
                    disabled={!schedule.isActive}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Run Now"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleSchedule(schedule.id)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title={schedule.isActive ? 'Pause' : 'Activate'}
                  >
                    {schedule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingSchedule(schedule.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Backup Schedule</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Name *</label>
                <input
                  type="text"
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                  placeholder="e.g., Weekly Team Report"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                <select
                  value={newScheduleTemplate}
                  onChange={(e) => setNewScheduleTemplate(e.target.value)}
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
                value={newScheduleDescription}
                onChange={(e) => setNewScheduleDescription(e.target.value)}
                placeholder="Optional description for this backup schedule..."
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={newScheduleFrequency}
                  onChange={(e) => setNewScheduleFrequency(e.target.value as any)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {newScheduleFrequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                  <select
                    value={newScheduleDayOfWeek}
                    onChange={(e) => setNewScheduleDayOfWeek(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                  </select>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Preview Schedule</h4>
              <div className="text-sm text-blue-800">
                <p>
                  This schedule will run <strong>{getFrequencyText({
                    frequency: newScheduleFrequency,
                    time: newScheduleTime,
                    dayOfWeek: newScheduleDayOfWeek
                  } as BackupSchedule)}</strong>
                </p>
                <p className="mt-1">
                  Exporting {expenses.length} expenses totaling ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('schedules')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                disabled={!newScheduleName.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Logs</h3>
          <div className="text-gray-600">
            <p>Activity logs and detailed execution history coming soon...</p>
            <p className="mt-2">Track schedule runs, success/failure rates, and performance metrics.</p>
          </div>
        </div>
      )}
    </div>
  );
}