import { Expense } from '@/types/expense';

export function exportToCSV(expenses: Expense[], filename: string = 'expenses'): void {
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      expense.date,
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.category,
      expense.amount.toString()
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const finalFilename = filename || `expenses_${new Date().toISOString().split('T')[0]}`;
    link.setAttribute('href', url);
    link.setAttribute('download', `${finalFilename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToJSON(expenses: Expense[], filename: string = 'expenses'): void {
  const jsonContent = JSON.stringify(expenses, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const finalFilename = filename || `expenses_${new Date().toISOString().split('T')[0]}`;
    link.setAttribute('href', url);
    link.setAttribute('download', `${finalFilename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}