'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Edit2, Trash2, Calendar, Tag, DollarSign } from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency, formatDate, filterExpenses, cn } from '@/lib/utils';
import EditExpenseModal from './EditExpenseModal';

interface ExpenseListProps {
  expenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const categories: Array<ExpenseCategory | 'All'> = [
  'All',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export default function ExpenseList({ expenses, onUpdateExpense, onDeleteExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedExpenses = useMemo(() => {
    const filtered = filterExpenses(expenses, {
      category: selectedCategory,
      dateFrom,
      dateTo,
      searchTerm
    });

    // Sort expenses
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'date':
        default:
          aValue = a.date;
          bValue = b.date;
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [expenses, selectedCategory, dateFrom, dateTo, searchTerm, sortBy, sortOrder]);

  const totalFilteredAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDelete = (expense: Expense) => {
    if (window.confirm(`Are you sure you want to delete the ${expense.category.toLowerCase()} expense for ${formatCurrency(expense.amount)}?`)) {
      onDeleteExpense(expense.id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
          <p className="text-sm text-gray-600">
            {filteredAndSortedExpenses.length} of {expenses.length} expenses
            {filteredAndSortedExpenses.length > 0 && (
              <span className="ml-2 font-medium">
                Total: {formatCurrency(totalFilteredAmount)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search expenses..."
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'All')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-600">
              {expenses.length === 0 
                ? "Start by adding your first expense!" 
                : "Try adjusting your filters to see more expenses."
              }
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('date')}
                className="text-left flex items-center space-x-1 hover:text-gray-700"
              >
                <Calendar className="h-3 w-3" />
                <span>Date</span>
                {sortBy === 'date' && (
                  <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <button
                onClick={() => handleSort('amount')}
                className="text-left flex items-center space-x-1 hover:text-gray-700"
              >
                <DollarSign className="h-3 w-3" />
                <span>Amount</span>
                {sortBy === 'amount' && (
                  <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <button
                onClick={() => handleSort('category')}
                className="text-left flex items-center space-x-1 hover:text-gray-700"
              >
                <Tag className="h-3 w-3" />
                <span>Category</span>
                {sortBy === 'category' && (
                  <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <div className="col-span-3">Description</div>
              <div>Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredAndSortedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-7 gap-4 items-center">
                    <div className="text-sm text-gray-900">
                      {formatDate(expense.date)}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </div>
                    <div>
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                        expense.category === 'Food' && "bg-orange-100 text-orange-800",
                        expense.category === 'Transportation' && "bg-blue-100 text-blue-800",
                        expense.category === 'Entertainment' && "bg-purple-100 text-purple-800",
                        expense.category === 'Shopping' && "bg-pink-100 text-pink-800",
                        expense.category === 'Bills' && "bg-red-100 text-red-800",
                        expense.category === 'Other' && "bg-gray-100 text-gray-800"
                      )}>
                        {expense.category}
                      </span>
                    </div>
                    <div className="col-span-3 text-sm text-gray-900">
                      {expense.description}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(expense.date)}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingExpense(expense)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                        expense.category === 'Food' && "bg-orange-100 text-orange-800",
                        expense.category === 'Transportation' && "bg-blue-100 text-blue-800",
                        expense.category === 'Entertainment' && "bg-purple-100 text-purple-800",
                        expense.category === 'Shopping' && "bg-pink-100 text-pink-800",
                        expense.category === 'Bills' && "bg-red-100 text-red-800",
                        expense.category === 'Other' && "bg-gray-100 text-gray-800"
                      )}>
                        {expense.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {expense.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onUpdate={onUpdateExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}