import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Expense, ExpenseFilters, ExpenseSummary, CategorySummary, ExpenseCategory } from '@/types/expense';
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

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM dd, yyyy');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter(expense => {
    if (filters.category && expense.category !== filters.category) {
      return false;
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (!expense.description.toLowerCase().includes(searchLower) && 
          !expense.category.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    if (filters.startDate || filters.endDate) {
      const expenseDate = parseISO(expense.date);
      
      if (filters.startDate && filters.endDate) {
        const start = parseISO(filters.startDate);
        const end = parseISO(filters.endDate);
        
        if (!isWithinInterval(expenseDate, { start, end })) {
          return false;
        }
      } else if (filters.startDate) {
        const start = parseISO(filters.startDate);
        if (expenseDate < start) {
          return false;
        }
      } else if (filters.endDate) {
        const end = parseISO(filters.endDate);
        if (expenseDate > end) {
          return false;
        }
      }
    }

    return true;
  });
}

export function calculateExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
  
  const monthlySpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  expenses.forEach(expense => {
    const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
    categoryMap.set(expense.category, {
      total: existing.total + expense.amount,
      count: existing.count + 1
    });
  });
  
  const categorySummary: CategorySummary[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category: category as ExpenseCategory,
    total: data.total,
    count: data.count,
    percentage: totalSpending > 0 ? (data.total / totalSpending) * 100 : 0
  })).sort((a, b) => b.total - a.total);
  
  return {
    totalSpending,
    monthlySpending,
    categorySummary,
    expenseCount: expenses.length
  };
}