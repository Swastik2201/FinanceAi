import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Receipt, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { addSampleTransaction } from '../services/dashboardService';

export const ExpensesPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('Groceries');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    try {
      await addSampleTransaction({
        amount: parseFloat(amount),
        type,
        category,
        description: description || `${type} record`,
      });
      setSuccessMsg(`Successfully added ${type} of ₹${amount}!`);
      setAmount('');
      setDescription('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout pageTitle="Expenses & Income">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">Add New Transaction</h2>
              <p className="text-xs text-muted-foreground">Record an expense or income entry into your financial ledger.</p>
            </div>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      type === 'expense'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'border-border bg-card text-muted-foreground'
                    }`}
                  >
                    <ArrowDownRight className="h-4 w-4" />
                    Expense
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      type === 'income'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-border bg-card text-muted-foreground'
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Salary">Salary</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Dining">Dining out</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Travel">Travel & Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly grocery run"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              Save Transaction
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
