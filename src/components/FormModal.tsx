import React, { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Trip, Activity, Expense, ActivityCategory, ExpenseCategory } from '../types';
import { todayISO } from '../utils/format';
import { PHOTOS } from '../data/seed';

interface FormModalProps {
  type: 'trip' | 'activity' | 'expense';
  data?: Partial<Trip | Activity | Expense>;
  trip?: Trip;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currencySymbol?: string;
  currencyCode?: string;
}

const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  'Food',
  'Sightseeing',
  'Transport',
  'Stay',
  'Adventure',
  'Shopping',
  'Relax',
  'Other',
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Transport',
  'Stay',
  'Food',
  'Activities',
  'Shopping',
  'Other',
];

const DEFAULT_IMAGES = Object.values(PHOTOS);

export default function FormModal({
  type,
  data = {},
  trip,
  onClose,
  onSubmit,
  currencySymbol = '$',
  currencyCode = 'USD',
}: FormModalProps) {
  const isEdit = !!(data as any)?.id;
  const title =
    type === 'trip'
      ? isEdit
        ? 'Edit trip'
        : 'Create a trip'
      : type === 'activity'
      ? isEdit
        ? 'Edit activity'
        : 'Add activity'
      : isEdit
      ? 'Edit expense'
      : 'Add expense';

  // Trip form state
  const [tripName, setTripName] = useState((data as Trip)?.name || '');
  const [destination, setDestination] = useState(
    (data as Trip)?.destination || ''
  );
  const [startDate, setStartDate] = useState(
    (data as Trip)?.start || todayISO()
  );
  const [endDate, setEndDate] = useState(
    (data as Trip)?.end || todayISO()
  );
  const [budget, setBudget] = useState(
    String((data as Trip)?.budget || '')
  );
  const [travelers, setTravelers] = useState(
    String((data as Trip)?.travelers || '1')
  );
  const [tripImage, setTripImage] = useState(
    (data as Trip)?.image || DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)]
  );

  // Activity form state
  const [actTitle, setActTitle] = useState(
    (data as Activity)?.title || ''
  );
  const [actDay, setActDay] = useState(
    String((data as Activity)?.day ?? '0')
  );
  const [actTime, setActTime] = useState(
    (data as Activity)?.time || '09:00'
  );
  const [actCategory, setActCategory] = useState<ActivityCategory>(
    (data as Activity)?.category || 'Sightseeing'
  );
  const [actNotes, setActNotes] = useState(
    (data as Activity)?.notes || ''
  );

  // Expense form state
  const [expTitle, setExpTitle] = useState(
    (data as Expense)?.title || ''
  );
  const [expCategory, setExpCategory] = useState<ExpenseCategory>(
    (data as Expense)?.category || 'Transport'
  );
  const [expAmount, setExpAmount] = useState(
    String((data as Expense)?.amount || '')
  );
  const [expDate, setExpDate] = useState(
    (data as Expense)?.date || todayISO()
  );
  const [expNotes, setExpNotes] = useState(
    (data as Expense)?.notes || ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (type === 'trip') {
      if (!tripName.trim()) errs.tripName = 'Trip name is required';
      if (!destination.trim()) errs.destination = 'Destination is required';
      if (!startDate) errs.startDate = 'Start date is required';
      if (!endDate) errs.endDate = 'End date is required';
      if (endDate < startDate) errs.endDate = 'End date must be after start';
      if (!budget || Number(budget) <= 0) errs.budget = 'Enter a valid budget';
    } else if (type === 'activity') {
      if (!actTitle.trim()) errs.actTitle = 'Activity title is required';
      if (!actTime) errs.actTime = 'Time is required';
    } else {
      if (!expTitle.trim()) errs.expTitle = 'Description is required';
      if (!expAmount || Number(expAmount) <= 0)
        errs.expAmount = 'Enter a valid amount';
      if (!expDate) errs.expDate = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (type === 'trip') {
      onSubmit({
        ...(isEdit ? { id: (data as Trip).id } : {}),
        name: tripName.trim(),
        destination: destination.trim(),
        start: startDate,
        end: endDate,
        budget: Number(budget),
        travelers: Number(travelers) || 1,
        image: tripImage,
        status: (data as Trip)?.status,
      });
    } else if (type === 'activity') {
      onSubmit({
        ...(isEdit ? { id: (data as Activity).id, tripId: (data as Activity).tripId, done: (data as Activity).done } : {}),
        title: actTitle.trim(),
        day: Number(actDay),
        time: actTime,
        category: actCategory,
        notes: actNotes.trim(),
      });
    } else {
      onSubmit({
        ...(isEdit ? { id: (data as Expense).id, tripId: (data as Expense).tripId } : {}),
        title: expTitle.trim(),
        category: expCategory,
        amount: Number(expAmount),
        date: expDate,
        notes: expNotes.trim(),
      });
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <form className="modal" onSubmit={handleSubmit} noValidate>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal__body">
          {type === 'trip' && (
            <>
              <div className="field">
                <label className="field__label" htmlFor="trip-name">
                  Trip name
                </label>
                <input
                  id="trip-name"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g. Summer in Provence"
                />
                {errors.tripName && (
                  <span className="field__error">{errors.tripName}</span>
                )}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="destination">
                  Destination
                </label>
                <input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Provence, France"
                />
                {errors.destination && (
                  <span className="field__error">{errors.destination}</span>
                )}
              </div>
              <div className="field__row">
                <div className="field">
                  <label className="field__label" htmlFor="start-date">
                    Start date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  {errors.startDate && (
                    <span className="field__error">{errors.startDate}</span>
                  )}
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="end-date">
                    End date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {errors.endDate && (
                    <span className="field__error">{errors.endDate}</span>
                  )}
                </div>
              </div>
              <div className="field__row">
                <div className="field">
                  <label className="field__label" htmlFor="budget">
                    Budget ({currencyCode} {currencySymbol})
                  </label>
                  <input
                    id="budget"
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="3000"
                  />
                  {errors.budget && (
                    <span className="field__error">{errors.budget}</span>
                  )}
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="travelers">
                    Travelers
                  </label>
                  <input
                    id="travelers"
                    type="number"
                    min="1"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="field__label">Cover photo</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {DEFAULT_IMAGES.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setTripImage(url)}
                      style={{
                        width: 64,
                        height: 48,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border:
                          tripImage === url
                            ? '2px solid var(--accent-sage)'
                            : '2px solid transparent',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    >
                      <img
                        src={url}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === 'activity' && (
            <>
              <div className="field">
                <label className="field__label" htmlFor="act-title">
                  Activity
                </label>
                <input
                  id="act-title"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="e.g. Visit the Louvre"
                />
                {errors.actTitle && (
                  <span className="field__error">{errors.actTitle}</span>
                )}
              </div>
              <div className="field__row">
                <div className="field">
                  <label className="field__label" htmlFor="act-day">
                    Day
                  </label>
                  <select
                    id="act-day"
                    value={actDay}
                    onChange={(e) => setActDay(e.target.value)}
                  >
                    {trip &&
                      Array.from(
                        {
                          length: Math.max(
                            1,
                            Math.ceil(
                              (new Date(trip.end).getTime() -
                                new Date(trip.start).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          ),
                        },
                        (_, i) => (
                          <option key={i} value={i}>
                            Day {i + 1}
                          </option>
                        )
                      )}
                  </select>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="act-time">
                    Time
                  </label>
                  <input
                    id="act-time"
                    type="time"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                  />
                  {errors.actTime && (
                    <span className="field__error">{errors.actTime}</span>
                  )}
                </div>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="act-cat">
                  Category
                </label>
                <select
                  id="act-cat"
                  value={actCategory}
                  onChange={(e) =>
                    setActCategory(e.target.value as ActivityCategory)
                  }
                >
                  {ACTIVITY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="act-notes">
                  Notes
                </label>
                <textarea
                  id="act-notes"
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  placeholder="Any details, tips, or reminders..."
                />
              </div>
            </>
          )}

          {type === 'expense' && (
            <>
              <div className="field">
                <label className="field__label" htmlFor="exp-title">
                  Description
                </label>
                <input
                  id="exp-title"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g. Hotel booking"
                />
                {errors.expTitle && (
                  <span className="field__error">{errors.expTitle}</span>
                )}
              </div>
              <div className="field__row">
                <div className="field">
                  <label className="field__label" htmlFor="exp-cat">
                    Category
                  </label>
                  <select
                    id="exp-cat"
                    value={expCategory}
                    onChange={(e) =>
                      setExpCategory(e.target.value as ExpenseCategory)
                    }
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="exp-amount">
                    Amount ({currencyCode} {currencySymbol})
                  </label>
                  <input
                    id="exp-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.expAmount && (
                    <span className="field__error">{errors.expAmount}</span>
                  )}
                </div>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="exp-date">
                  Date
                </label>
                <input
                  id="exp-date"
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                />
                {errors.expDate && (
                  <span className="field__error">{errors.expDate}</span>
                )}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="exp-notes">
                  Notes (optional)
                </label>
                <textarea
                  id="exp-notes"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  placeholder="Any additional details..."
                />
              </div>
            </>
          )}
        </div>

        <div className="modal__footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEdit ? 'Save changes' : type === 'trip' ? 'Create trip' : 'Add ' + type}
          </button>
        </div>
      </form>
    </div>
  );
}
