import { Expense } from '@/types/expense';
import { format, parseISO } from 'date-fns';

export function exportExpensesToCSV(expenses: Expense[]): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  const headers = ['Date', 'Category', 'Amount', 'Description'];
  
  const csvData = expenses.map(expense => [
    format(parseISO(expense.date), 'yyyy-MM-dd'),
    expense.category,
    expense.amount.toString(),
    `"${expense.description.replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}