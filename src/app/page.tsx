'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import AddExpenseForm from '@/components/AddExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { Expense } from '@/types/expense';
import { storage } from '@/lib/storage';
import { exportExpensesToCSV, downloadCSV } from '@/lib/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'list'>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = () => {
      const savedExpenses = storage.getExpenses();
      setExpenses(savedExpenses);
      setIsLoading(false);
    };

    loadExpenses();
  }, []);

  const handleAddExpense = (expense: Expense) => {
    storage.addExpense(expense);
    setExpenses(prev => [...prev, expense]);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    storage.updateExpense(updatedExpense);
    setExpenses(prev => prev.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    ));
  };

  const handleDeleteExpense = (id: string) => {
    storage.deleteExpense(id);
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleExport = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }

    const csvContent = exportExpensesToCSV(expenses);
    const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onExport={handleExport}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard expenses={expenses} />}
        {activeTab === 'add' && (
          <AddExpenseForm 
            onAddExpense={handleAddExpense}
            onSuccess={() => setActiveTab('list')}
          />
        )}
        {activeTab === 'list' && (
          <ExpenseList 
            expenses={expenses}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </main>
    </div>
  );
}
