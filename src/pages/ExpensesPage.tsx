import React from 'react';
import {
  Plus,
  Wallet,
  Pencil,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Trip, Expense, ExpenseCategory } from '../types';
import { formatDate, percentOf } from '../utils/format';

interface ExpensesPageProps {
  trips: Trip[];
  trip: Trip;
  expenses: Expense[];
  onChooseTrip: (tripId: string) => void;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  formatMoney: (amountUSD: number) => string;
  currencySymbol: string;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Transport: 'var(--cat-transport)',
  Stay: 'var(--cat-stay)',
  Food: 'var(--cat-food)',
  Activities: 'var(--cat-activities)',
  Shopping: 'var(--cat-shopping)',
  Other: 'var(--cat-other)',
};

export default function ExpensesPage({
  trips,
  trip,
  expenses,
  onChooseTrip,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  formatMoney,
  currencySymbol,
}: ExpensesPageProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = trip.budget - totalSpent;
  const utilizationPct = percentOf(totalSpent, trip.budget);

  // Category breakdown
  const breakdown = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  )
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percent: percentOf(amount, totalSpent),
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <span className="page-header__eyebrow">Expenses</span>
        <div className="page-header__row">
          <div>
            <h1>Budget &amp; spending</h1>
            <p className="page-header__subtitle">
              Track every expense in real-time and keep your travel budget on course.
            </p>
          </div>
          <button className="btn btn--primary" onClick={onAddExpense}>
            <Plus size={16} /> Add expense
          </button>
        </div>
      </div>

      {/* Trip selector */}
      <div className="trip-selector">
        <label
          htmlFor="trip-select"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--text-heading)',
          }}
        >
          Trip:
        </label>
        <select
          id="trip-select"
          value={trip.id}
          onChange={(e) => onChooseTrip(e.target.value)}
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.destination}
            </option>
          ))}
        </select>
      </div>

      {/* Budget summary row */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--sage">
            <Wallet size={18} />
          </div>
          <div className="stat-card__label">Total Budget</div>
          <div className="stat-card__value">{formatMoney(trip.budget)}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--terracotta">
            <TrendingUp size={18} />
          </div>
          <div className="stat-card__label">Spent</div>
          <div className="stat-card__value">{formatMoney(totalSpent)}</div>
          <div className="stat-card__note">
            {utilizationPct}% of budget
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--muted">
            <Wallet size={18} />
          </div>
          <div className="stat-card__label">Remaining</div>
          <div
            className="stat-card__value"
            style={{ color: remaining < 0 ? '#C0392B' : undefined }}
          >
            {formatMoney(remaining)}
          </div>
          <div className="stat-card__note">
            {remaining < 0 ? 'Over budget!' : 'left to spend'}
          </div>
        </div>
      </div>

      {/* Budget bar */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
        <div className="budget-progress">
          <div className="budget-progress__header">
            <span className="budget-progress__spent">
              {formatMoney(totalSpent)} of {formatMoney(trip.budget)}
            </span>
            <span className="budget-progress__remaining">
              {utilizationPct}% used
            </span>
          </div>
          <div className="progress" style={{ height: 8 }}>
            <div
              className={`progress__bar ${
                utilizationPct > 100
                  ? 'progress__bar--danger'
                  : utilizationPct > 80
                  ? 'progress__bar--warning'
                  : ''
              }`}
              style={{ width: `${Math.min(100, utilizationPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expense summary: breakdown */}
      {breakdown.length > 0 && (
        <div className="expense-summary">
          <div className="card expense-summary__breakdown">
            <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Spending by category
            </h3>
            {breakdown.map((item) => (
              <div key={item.category} className="expense-breakdown__item">
                <span
                  className="expense-breakdown__dot"
                  style={{
                    background:
                      CATEGORY_COLORS[item.category] || 'var(--cat-other)',
                  }}
                />
                <span className="expense-breakdown__label">{item.category}</span>
                <span className="expense-breakdown__amount">
                  {formatMoney(item.amount)}
                </span>
                <span className="expense-breakdown__percent">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
          <div className="card expense-summary__chart">
            <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Visual breakdown
            </h3>
            {/* Simple horizontal bar chart */}
            {breakdown.map((item) => (
              <div key={item.category} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: 'var(--text-body)' }}>{item.category}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                    {item.percent}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.percent}%`,
                      background:
                        CATEGORY_COLORS[item.category] || 'var(--cat-other)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense table */}
      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <Wallet size={28} />
          </div>
          <h3 className="empty-state__title">No expenses recorded</h3>
          <p className="empty-state__text">
            Start logging your trip expenses to keep track of spending.
          </p>
          <button className="btn btn--primary" onClick={onAddExpense}>
            <Plus size={16} /> Add expense
          </button>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>
                    {exp.title}
                  </td>
                  <td>
                    <span className="expense-table__category">
                      <span
                        className="expense-table__category-dot"
                        style={{
                          background:
                            CATEGORY_COLORS[exp.category] || 'var(--cat-other)',
                        }}
                      />
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {formatDate(exp.date)}
                  </td>
                  <td className="expense-table__amount" style={{ textAlign: 'right' }}>
                    {formatMoney(exp.amount)}
                  </td>
                  <td>
                    <div className="expense-table__actions">
                      <button
                        className="btn--icon"
                        onClick={() => onEditExpense(exp)}
                        aria-label="Edit expense"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn--icon btn--danger"
                        onClick={() => onDeleteExpense(exp.id)}
                        aria-label="Delete expense"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
