import React, { useState, useMemo } from 'react';
import {
  Plus,
  CalendarDays,
  ListChecks,
  MapPin,
  Users,
  Wallet,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  ChevronUp,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { Trip, Activity } from '../types';
import {
  formatDate,
  formatDateRange,
  daysBetween,
  daysUntil,
  percentOf,
} from '../utils/format';

interface ItineraryPageProps {
  trip: Trip;
  activities: Activity[];
  query: string;
  onEditTrip: () => void;
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  onToggleActivity: (activityId: string) => void;
  onDeleteActivity: (activityId: string) => void;
  onMoveActivity: (activityId: string, direction: number) => void;
  formatMoney: (amountUSD: number) => string;
}

export default function ItineraryPage({
  trip,
  activities,
  query,
  onEditTrip,
  onAddActivity,
  onEditActivity,
  onToggleActivity,
  onDeleteActivity,
  onMoveActivity,
  formatMoney,
}: ItineraryPageProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const totalDays = daysBetween(trip.start, trip.end);
  const doneCount = activities.filter((a) => a.done).length;
  const completionPct = activities.length > 0 ? percentOf(doneCount, activities.length) : 0;

  // Filter by search query
  const filtered = query
    ? activities.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()) ||
          a.notes.toLowerCase().includes(query.toLowerCase())
      )
    : activities;

  // Group by day
  const dayGroups = useMemo(() => {
    const groups = new Map<number, Activity[]>();
    filtered.forEach((a) => {
      if (!groups.has(a.day)) groups.set(a.day, []);
      groups.get(a.day)!.push(a);
    });
    // Sort activities within each day by time
    groups.forEach((acts) => acts.sort((a, b) => a.time.localeCompare(b.time)));
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [filtered]);

  // Generate date for a given day offset
  function dayDate(dayNum: number): string {
    const d = new Date(trip.start + 'T12:00:00');
    d.setDate(d.getDate() + dayNum);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }

  // Calendar helpers
  function getCalendarData() {
    const startDate = new Date(trip.start + 'T12:00:00');
    const endDate = new Date(trip.end + 'T12:00:00');

    // Start from the beginning of the week containing the trip start
    const calStart = new Date(startDate);
    calStart.setDate(calStart.getDate() - calStart.getDay());

    // End at the end of the week containing the trip end
    const calEnd = new Date(endDate);
    calEnd.setDate(calEnd.getDate() + (6 - calEnd.getDay()));

    const days: Array<{
      date: Date;
      dateStr: string;
      inTrip: boolean;
      isToday: boolean;
      activities: Activity[];
    }> = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = new Date(calStart);
    while (current <= calEnd) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayOffset = Math.round(
        (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const inTrip = current >= startDate && current <= endDate;
      const dayActivities = activities.filter((a) => a.day === dayOffset);

      days.push({
        date: new Date(current),
        dateStr,
        inTrip,
        isToday: current.getTime() === today.getTime(),
        activities: dayActivities,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Trip header */}
      <div className="itinerary-header">
        <div className="itinerary-hero">
          <img
            className="itinerary-hero__image"
            src={trip.image}
            alt={trip.destination}
          />
          <div className="itinerary-hero__destination">{trip.destination}</div>
          <h1 className="itinerary-hero__title">{trip.name}</h1>
          <div className="itinerary-hero__meta">
            <span className="itinerary-hero__meta-item">
              <CalendarDays size={14} />
              {formatDateRange(trip.start, trip.end)}
            </span>
            <span className="itinerary-hero__meta-item">
              <Users size={14} />
              {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
            </span>
            <span className="itinerary-hero__meta-item">
              <MapPin size={14} />
              {totalDays} day{totalDays !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="itinerary-stats">
          <div className="card stat-card">
            <div className="stat-card__icon stat-card__icon--sage">
              <ListChecks size={18} />
            </div>
            <div className="stat-card__label">Activities</div>
            <div className="stat-card__value">{activities.length}</div>
            <div className="stat-card__note">{doneCount} completed</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card__icon stat-card__icon--terracotta">
              <Wallet size={18} />
            </div>
            <div className="stat-card__label">Budget</div>
            <div className="stat-card__value">{formatMoney(trip.budget)}</div>
            <div className="stat-card__note">{formatMoney(trip.spent)} spent</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card__icon stat-card__icon--sage">
              <Clock size={18} />
            </div>
            <div className="stat-card__label">Progress</div>
            <div className="stat-card__value">{completionPct}%</div>
            <div className="progress" style={{ marginTop: 8 }}>
              <div
                className="progress__bar"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-card__icon stat-card__icon--muted">
              <CalendarDays size={18} />
            </div>
            <div className="stat-card__label">Countdown</div>
            <div className="stat-card__value">
              {daysUntil(trip.start) > 0
                ? `${daysUntil(trip.start)}d`
                : trip.status === 'completed'
                ? 'Done'
                : 'Now'}
            </div>
            <div className="stat-card__note">
              {daysUntil(trip.start) > 0 ? 'until departure' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-xl)',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
        }}
      >
        <div className="view-toggle">
          <button
            className={`view-toggle__btn ${
              view === 'list' ? 'view-toggle__btn--active' : ''
            }`}
            onClick={() => setView('list')}
          >
            <ListChecks size={15} /> List
          </button>
          <button
            className={`view-toggle__btn ${
              view === 'calendar' ? 'view-toggle__btn--active' : ''
            }`}
            onClick={() => setView('calendar')}
          >
            <CalendarDays size={15} /> Calendar
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn--secondary btn--sm" onClick={onEditTrip}>
            <Pencil size={14} /> Edit trip
          </button>
          <button className="btn btn--primary btn--sm" onClick={onAddActivity}>
            <Plus size={14} /> Add activity
          </button>
        </div>
      </div>

      {/* List view */}
      {view === 'list' && (
        <>
          {dayGroups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <ListChecks size={28} />
              </div>
              <h3 className="empty-state__title">No activities yet</h3>
              <p className="empty-state__text">
                Start building your day-by-day itinerary.
              </p>
              <button className="btn btn--primary" onClick={onAddActivity}>
                <Plus size={16} /> Add first activity
              </button>
            </div>
          ) : (
            dayGroups.map(([day, acts]) => (
              <div key={day} className="day-section">
                <div className="day-section__header">
                  <span className="day-section__title">Day {day + 1}</span>
                  <span className="day-section__date">{dayDate(day)}</span>
                </div>
                <div className="activity-list">
                  {acts.map((act, idx) => (
                    <div
                      key={act.id}
                      className={`activity-item ${
                        act.done ? 'activity-item--done' : ''
                      }`}
                    >
                      <button
                        className={`activity-item__check ${
                          act.done ? 'activity-item__check--done' : ''
                        }`}
                        onClick={() => onToggleActivity(act.id)}
                        aria-label={
                          act.done ? 'Mark incomplete' : 'Mark complete'
                        }
                      >
                        {act.done ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      <div className="activity-item__content">
                        <div className="activity-item__top-row">
                          <span className="activity-item__time">{act.time}</span>
                          <span className="activity-item__category">
                            {act.category}
                          </span>
                        </div>
                        <div className="activity-item__title">{act.title}</div>
                        {act.notes && (
                          <div className="activity-item__notes">{act.notes}</div>
                        )}
                      </div>
                      <div className="activity-item__actions">
                        <button
                          className="activity-item__action-btn"
                          onClick={() => onMoveActivity(act.id, -1)}
                          aria-label="Move up"
                          disabled={idx === 0}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          className="activity-item__action-btn"
                          onClick={() => onMoveActivity(act.id, 1)}
                          aria-label="Move down"
                          disabled={idx === acts.length - 1}
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          className="activity-item__action-btn"
                          onClick={() => onEditActivity(act)}
                          aria-label="Edit activity"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="activity-item__action-btn"
                          onClick={() => onDeleteActivity(act.id)}
                          aria-label="Delete activity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Calendar view */}
      {view === 'calendar' && (
        <div className="calendar-view">
          <div className="calendar-grid">
            {weekDays.map((d) => (
              <div key={d} className="calendar-grid__header">
                {d}
              </div>
            ))}
            {getCalendarData().map((cell, i) => (
              <div
                key={i}
                className={`calendar-grid__cell ${
                  cell.isToday ? 'calendar-grid__cell--today' : ''
                } ${cell.inTrip ? 'calendar-grid__cell--trip' : ''}`}
              >
                <div className="calendar-grid__date">
                  {cell.date.getDate()}
                </div>
                {cell.activities.slice(0, 3).map((a) => (
                  <div key={a.id} className="calendar-grid__event">
                    {a.time} {a.title}
                  </div>
                ))}
                {cell.activities.length > 3 && (
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    +{cell.activities.length - 3} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
