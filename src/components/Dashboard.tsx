'use client';

import { useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, PieChart, ArrowUp, ArrowDown } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Expense } from '@/types/expense';
import { calculateExpenseSummary, formatCurrency, cn } from '@/lib/utils';
import { format, parseISO, startOfMonth, subMonths, isWithinInterval } from 'date-fns';

interface DashboardProps {
  expenses: Expense[];
}

const COLORS = {
  Food: '#f59e0b',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Other: '#6b7280'
};

export default function Dashboard({ expenses }: DashboardProps) {
  const summary = useMemo(() => calculateExpenseSummary(expenses), [expenses]);

  const monthlyTrend = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const monthExpenses = expenses.filter(expense => {
        try {
          const expenseDate = parseISO(expense.date);
          return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
        } catch {
          return false;
        }
      });
      
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      months.push({
        month: format(monthStart, 'MMM yyyy'),
        total,
        expenses: monthExpenses.length
      });
    }
    
    return months;
  }, [expenses]);

  const categoryData = useMemo(() => {
    return Object.entries(summary.categorySummary)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: summary.totalExpenses > 0 ? ((amount / summary.totalExpenses) * 100).toFixed(1) : '0'
      }));
  }, [summary]);

  const previousMonth = monthlyTrend.length >= 2 ? monthlyTrend[monthlyTrend.length - 2].total : 0;
  const monthlyChange = previousMonth > 0 ? ((summary.monthlyTotal - previousMonth) / previousMonth) * 100 : 0;

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [expenses]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your expenses and spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Total */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.monthlyTotal)}
              </p>
              {monthlyChange !== 0 && (
                <div className={cn(
                  "flex items-center text-sm",
                  monthlyChange > 0 ? "text-red-600" : "text-green-600"
                )}>
                  {monthlyChange > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(monthlyChange).toFixed(1)}% vs last month
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
              <p className="text-sm text-gray-500">
                Avg: {expenses.length > 0 ? formatCurrency(summary.totalExpenses / expenses.length) : '$0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              {summary.topCategories.length > 0 ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.topCategories[0].category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(summary.topCategories[0].amount)} ({summary.topCategories[0].percentage.toFixed(1)}%)
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-gray-900">-</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          {monthlyTrend.some(month => month.total > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>No spending data available</p>
                <p className="text-sm">Add some expenses to see trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.name as keyof typeof COLORS]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <div className="space-y-3">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[category.name as keyof typeof COLORS] }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900">
                        {formatCurrency(category.value)} ({category.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-200 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>No category data available</p>
                <p className="text-sm">Add some expenses to see breakdown</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        </div>
        <div className="p-6">
          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      expense.category === 'Food' && "bg-orange-500",
                      expense.category === 'Transportation' && "bg-blue-500",
                      expense.category === 'Entertainment' && "bg-purple-500",
                      expense.category === 'Shopping' && "bg-pink-500",
                      expense.category === 'Bills' && "bg-red-500",
                      expense.category === 'Other' && "bg-gray-500"
                    )} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {expense.category} • {format(parseISO(expense.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No expenses yet</p>
              <p className="text-sm text-gray-400">Start by adding your first expense!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}