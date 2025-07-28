'use client';

import { useState, useMemo } from 'react';
import { X, Download, FileText, Calendar, Filter, Eye, Settings } from 'lucide-react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { exportToCSV, exportToJSON } from '@/lib/export';
import { exportToPDF } from '@/lib/exportPDF';

interface AdvancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export type ExportFormat = 'csv' | 'json' | 'pdf';

interface ExportFilters {
  startDate: string;
  endDate: string;
  categories: ExpenseCategory[];
}

export default function AdvancedExportModal({ isOpen, onClose, expenses }: AdvancedExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('expenses');
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: '',
    endDate: '',
    categories: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      if (startDate && expenseDate < startDate) return false;
      if (endDate && expenseDate > endDate) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) return false;

      return true;
    });
  }, [expenses, filters]);

  const exportSummary = useMemo(() => {
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      recordCount: filteredExpenses.length,
      totalAmount,
      categoryBreakdown,
      dateRange: {
        earliest: filteredExpenses.length > 0 
          ? filteredExpenses.reduce((earliest, expense) => 
              new Date(expense.date) < new Date(earliest.date) ? expense : earliest
            ).date
          : null,
        latest: filteredExpenses.length > 0
          ? filteredExpenses.reduce((latest, expense) => 
              new Date(expense.date) > new Date(latest.date) ? expense : latest
            ).date
          : null
      }
    };
  }, [filteredExpenses]);

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) return;

    setIsExporting(true);
    
    try {
      const exportFilename = filename || 'expenses';
      
      switch (selectedFormat) {
        case 'csv':
          exportToCSV(filteredExpenses, exportFilename);
          break;
        case 'json':
          exportToJSON(filteredExpenses, exportFilename);
          break;
        case 'pdf':
          await exportToPDF(filteredExpenses, exportFilename);
          break;
      }
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      categories: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Advanced Data Export</h2>
              <p className="text-sm text-gray-500">Export your expense data with custom filters and formats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Left Panel - Configuration */}
          <div className="lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            {/* Export Format */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FileText className="h-4 w-4 inline mr-2" />
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { format: 'csv' as ExportFormat, label: 'CSV', description: 'Spreadsheet format' },
                  { format: 'json' as ExportFormat, label: 'JSON', description: 'Data format' },
                  { format: 'pdf' as ExportFormat, label: 'PDF', description: 'Print-ready report' }
                ].map(({ format, label, description }) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      selectedFormat === format
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filename */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Settings className="h-4 w-4 inline mr-2" />
                Custom Filename
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename (without extension)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date Range Filter
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Filter className="h-4 w-4 inline mr-2" />
                Category Filter
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EXPENSE_CATEGORIES.map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
              {filters.categories.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Preview & Summary */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            {/* Export Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Records to export:</span>
                  <span className="font-medium text-gray-900">{exportSummary.recordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total amount:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(exportSummary.totalAmount)}</span>
                </div>
                {exportSummary.dateRange.earliest && exportSummary.dateRange.latest && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date range:</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {new Date(exportSummary.dateRange.earliest).toLocaleDateString()} - 
                      {new Date(exportSummary.dateRange.latest).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Categories:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(exportSummary.categoryBreakdown).map(([category, count]) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {category}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
              
              {showPreview && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-60">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredExpenses.slice(0, 10).map(expense => (
                          <tr key={expense.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 truncate max-w-32">{expense.description}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(expense.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredExpenses.length > 10 && (
                      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50">
                        ... and {filteredExpenses.length - 10} more records
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredExpenses.length === 0 ? (
              <span className="text-red-600">No records match your filters</span>
            ) : (
              <span>Ready to export {filteredExpenses.length} record{filteredExpenses.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={filteredExpenses.length === 0 || isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}