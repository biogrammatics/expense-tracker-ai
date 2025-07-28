import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense } from '@/types/expense';
import { formatCurrency } from './utils';

export async function exportToPDF(expenses: Expense[], filename: string = 'expenses'): Promise<void> {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Expense Report', 20, 20);
  
  // Add date and summary info
  doc.setFontSize(12);
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Generated on: ${currentDate}`, 20, 35);
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  doc.text(`Total Records: ${expenses.length}`, 20, 45);
  doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 20, 55);
  
  // Date range
  if (expenses.length > 0) {
    const dates = expenses.map(e => new Date(e.date)).sort((a, b) => a.getTime() - b.getTime());
    const earliestDate = dates[0].toLocaleDateString();
    const latestDate = dates[dates.length - 1].toLocaleDateString();
    doc.text(`Date Range: ${earliestDate} - ${latestDate}`, 20, 65);
  }
  
  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  if (Object.keys(categoryBreakdown).length > 0) {
    let yPosition = 80;
    doc.text('Category Breakdown:', 20, yPosition);
    yPosition += 10;
    
    Object.entries(categoryBreakdown).forEach(([category, amount]) => {
      doc.text(`${category}: ${formatCurrency(amount)}`, 25, yPosition);
      yPosition += 8;
    });
  }
  
  // Prepare data for the table
  const tableData = expenses.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    expense.description,
    expense.category,
    formatCurrency(expense.amount)
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: tableData,
    startY: Math.max(120, Object.keys(categoryBreakdown).length * 8 + 90),
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Date column
      1: { cellWidth: 'auto' }, // Description column
      2: { cellWidth: 30 }, // Category column  
      3: { cellWidth: 25, halign: 'right' } // Amount column
    }
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
}