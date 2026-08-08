import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
  Users,
  Plus,
  CheckCircle2,
  AlertCircle,
  Trash2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  UserX,
  Receipt,
} from 'lucide-react';
import {
  fetchBillSplits,
  addBillSplit,
  toggleMemberSettled,
  deleteBillSplit,
  BillSplit,
} from '../services/billSplitService';

export const BillSplitPage: React.FC = () => {
  const [billSplits, setBillSplits] = useState<BillSplit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dining');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState('Swastik');
  const [memberNamesInput, setMemberNamesInput] = useState('Swastik, Aarav, Riya, Priya');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchBillSplits();
      setBillSplits(data);
    } catch (err) {
      console.error('Failed to load bill splits', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !totalAmount || !memberNamesInput) return;

    const names = memberNamesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    const total = parseFloat(totalAmount);
    const splitAmount = Math.round(total / names.length);

    const members = names.map((name) => ({
      name,
      amount: splitAmount,
      settled: name.toLowerCase() === paidBy.toLowerCase(),
    }));

    try {
      await addBillSplit({
        title,
        category,
        totalAmount: total,
        date: new Date().toISOString().split('T')[0],
        paidBy,
        members,
      });
      setSuccessMsg('Bill split created successfully!');
      setShowAddModal(false);
      setTitle('');
      setTotalAmount('');
      loadData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSettled = async (billSplitId: string, memberId: string) => {
    try {
      await toggleMemberSettled(billSplitId, memberId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBillSplit(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Net Balances
  let youAreOwed = 0;
  let youOwe = 0;

  billSplits.forEach((bs) => {
    const userPaid = bs.paidBy.toLowerCase() === 'swastik';
    bs.members.forEach((m) => {
      if (userPaid && m.name.toLowerCase() !== 'swastik' && !m.settled) {
        youAreOwed += m.amount;
      } else if (!userPaid && m.name.toLowerCase() === 'swastik' && !m.settled) {
        youOwe += m.amount;
      }
    });
  });

  const netBalance = youAreOwed - youOwe;

  return (
    <DashboardLayout pageTitle="Bill Splitter">
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Group Bill Splitter
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Split dinners, vacation rent, and group trips effortlessly with clear balance tracking.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
          >
            <Plus className="h-4 w-4" />
            Split New Bill
          </button>
        </div>

        {successMsg && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {successMsg}
          </div>
        )}

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">You Are Owed</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
              +₹{youAreOwed.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Pending payments from friends</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">You Owe</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <ArrowDownRight className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
              -₹{youOwe.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Your share in group bills</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">Net Group Balance</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p
              className={`text-2xl font-black mt-2 ${
                netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {netBalance >= 0 ? `+₹${netBalance.toLocaleString()}` : `-₹${Math.abs(netBalance).toLocaleString()}`}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Overall group settlement status</p>
          </div>
        </div>

        {/* Active Bills Ledger */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 rounded-2xl bg-muted/40 animate-pulse border border-border" />
            ))}
          </div>
        ) : billSplits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">No Shared Bills</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Create a group bill split to keep track of shared costs with flatmates or friends.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {billSplits.map((bs) => (
              <div
                key={bs.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-foreground">{bs.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Paid by <span className="font-bold text-foreground">{bs.paidBy}</span> on {bs.date} • {bs.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-foreground">
                      ₹{bs.totalAmount.toLocaleString()}
                    </span>

                    <button
                      onClick={() => handleDelete(bs.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Delete Bill Split"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Member Split Status */}
                <div className="mt-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-2.5">
                    Participants Share Status
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {bs.members.map((m) => (
                      <button
                        key={m.id || m.name}
                        onClick={() => m.id && handleToggleSettled(bs.id, m.id)}
                        className={`flex items-center justify-between gap-2 rounded-xl border p-3 text-left transition-all ${
                          m.settled
                            ? 'border-emerald-500/30 bg-emerald-500/5 text-foreground'
                            : 'border-amber-500/30 bg-amber-500/5 text-foreground'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{m.name}</p>
                          <p className="text-[11px] font-extrabold text-muted-foreground">₹{m.amount.toLocaleString()}</p>
                        </div>

                        {m.settled ? (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                            <UserCheck className="h-3.5 w-3.5" />
                            Paid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                            <UserX className="h-3.5 w-3.5" />
                            Pending
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Bill Split Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-lg font-extrabold text-foreground mb-4">Create New Bill Split</h3>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Bill / Expense Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weekend Villa Stay, Team Dinner"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Total Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 4800"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Paid By
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Swastik"
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Participants (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Swastik, Aarav, Riya, Priya"
                    value={memberNamesInput}
                    onChange={(e) => setMemberNamesInput(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Total amount will be split equally among all listed participants.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    Create Split
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
