import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, ExpenseCategory, ExpenseSummary } from '@/types/expense';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function calculateExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyExpenses = expenses.filter(expense => {
    try {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    } catch {
      return false;
    }
  });
  
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categorySummary = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const topCategories = Object.entries(categorySummary)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalExpenses,
    monthlyTotal,
    categorySummary,
    topCategories,
  };
}

export function filterExpenses(
  expenses: Expense[],
  filters: {
    category?: ExpenseCategory | 'All';
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }
): Expense[] {
  return expenses.filter(expense => {
    if (filters.category && filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    if (filters.dateFrom) {
      try {
        const expenseDate = parseISO(expense.date);
        const fromDate = parseISO(filters.dateFrom);
        if (expenseDate < fromDate) return false;
      } catch {
        // Invalid date, skip filter
      }
    }

    if (filters.dateTo) {
      try {
        const expenseDate = parseISO(expense.date);
        const toDate = parseISO(filters.dateTo);
        if (expenseDate > toDate) return false;
      } catch {
        // Invalid date, skip filter
      }
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(searchLower);
      const matchesCategory = expense.category.toLowerCase().includes(searchLower);
      if (!matchesDescription && !matchesCategory) return false;
    }

    return true;
  });
}

export function exportExpensesToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const rows = expenses.map(expense => [
    formatDate(expense.date),
    expense.amount.toString(),
    expense.category,
    expense.description.replace(/,/g, ';') // Replace commas to avoid CSV issues
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string = 'expenses.csv'): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}