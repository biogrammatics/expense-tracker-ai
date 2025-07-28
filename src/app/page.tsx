'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ExpenseList from '@/components/ExpenseList';
import AddExpenseForm from '@/components/AddExpenseForm';
import EditExpenseModal from '@/components/EditExpenseModal';
import CloudExportHub from '@/components/CloudExportHub';
import { Expense } from '@/types/expense';
import { storageUtils } from '@/lib/storage';

export default function Home() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'expenses'>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloudExportOpen, setIsCloudExportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = () => {
      try {
        const savedExpenses = storageUtils.getExpenses();
        setExpenses(savedExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const handleAddExpense = (expense: Expense) => {
    try {
      storageUtils.addExpense(expense);
      setExpenses(prev => [...prev, expense]);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleSaveExpense = (updatedExpense: Expense) => {
    try {
      storageUtils.updateExpense(updatedExpense);
      setExpenses(prev => 
        prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
      );
      setEditingExpense(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    try {
      storageUtils.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const closeEditModal = () => {
    setEditingExpense(null);
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of your spending habits</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCloudExportOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Cloud Export
                </button>
                <AddExpenseForm onAddExpense={handleAddExpense} />
              </div>
            </div>
            <Dashboard expenses={expenses} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
                <p className="text-gray-600 mt-2">Manage and track all your expenses</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCloudExportOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Cloud Export
                </button>
                <AddExpenseForm onAddExpense={handleAddExpense} />
              </div>
            </div>
            <ExpenseList
              expenses={expenses}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        )}
      </main>

      <EditExpenseModal
        expense={editingExpense}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveExpense}
      />

      {isCloudExportOpen && (
        <CloudExportHub
          expenses={expenses}
          onClose={() => setIsCloudExportOpen(false)}
        />
      )}
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ExpenseTracker. Built with Next.js and TypeScript.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}