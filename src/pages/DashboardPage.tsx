import React from 'react';
import {
  Compass,
  MapPin,
  CalendarDays,
  Wallet,
  Users,
  ArrowRight,
  CheckCircle2,
  Circle,
  Plus,
  ChevronRight,
  Sparkles,
  Landmark,
} from 'lucide-react';
import { Trip, Activity } from '../types';
import { formatDateRange, daysUntil, daysBetween } from '../utils/format';
import { FAMOUS_PLACES } from '../data/famousPlaces';

interface DashboardPageProps {
  trips: Trip[];
  activities: Activity[];
  onCreateTrip: () => void;
  onViewTrips: () => void;
  onOpenTrip: (tripId: string) => void;
  onToggleActivity: (activityId: string) => void;
  onGoLanding: () => void;
  formatMoney: (amountUSD: number) => string;
  onExplore?: () => void;
}

export default function DashboardPage({
  trips,
  activities,
  onCreateTrip,
  onViewTrips,
  onOpenTrip,
  onToggleActivity,
  formatMoney,
  onExplore,
}: DashboardPageProps) {
  const upcoming = trips.filter((t) => t.status !== 'completed');
  const nextTrip = upcoming.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  )[0];

  const totalBudget = trips.reduce((s, t) => s + t.budget, 0);
  const totalSpent = trips.reduce((s, t) => s + t.spent, 0);
  const totalTravelers = new Set(trips.map((t) => t.travelers)).size
    ? trips.reduce((s, t) => s + t.travelers, 0)
    : 0;

  const nextActivities = nextTrip
    ? activities.filter((a) => a.tripId === nextTrip.id).slice(0, 5)
    : [];

  const featuredWonders = FAMOUS_PLACES.slice(0, 4);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <span className="page-header__eyebrow">Dashboard</span>
        <div className="page-header__row">
          <div>
            <h1>Welcome back</h1>
            <p className="page-header__subtitle">
              Here's an overview of your travel plans, budget, and inspiring world wonders.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {onExplore && (
              <button className="btn btn--secondary" onClick={onExplore}>
                <Sparkles size={16} /> Explore Wonders
              </button>
            )}
            <button className="btn btn--primary" onClick={onCreateTrip}>
              <Plus size={16} /> New trip
            </button>
          </div>
        </div>
      </div>

      {/* Hero card — next trip */}
      {nextTrip && (
        <div
          className="dashboard-hero card--interactive"
          onClick={() => onOpenTrip(nextTrip.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOpenTrip(nextTrip.id)}
        >
          <img
            className="dashboard-hero__image"
            src={nextTrip.image}
            alt={nextTrip.destination}
          />
          <div className="dashboard-hero__overlay">
            <span className="dashboard-hero__eyebrow">Next adventure</span>
            <h2 className="dashboard-hero__title">{nextTrip.name}</h2>
            <p className="dashboard-hero__subtitle">
              {nextTrip.destination} · {formatDateRange(nextTrip.start, nextTrip.end)} ·{' '}
              {daysUntil(nextTrip.start) > 0
                ? `${daysUntil(nextTrip.start)} days away`
                : 'Happening now'}
            </p>
          </div>
        </div>
      )}

      {/* Stats with real-time currency conversion */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--sage">
            <Compass size={18} />
          </div>
          <div className="stat-card__label">Total trips</div>
          <div className="stat-card__value">{trips.length}</div>
          <div className="stat-card__note">
            {upcoming.length} upcoming
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--terracotta">
            <Wallet size={18} />
          </div>
          <div className="stat-card__label">Total budget</div>
          <div className="stat-card__value">{formatMoney(totalBudget)}</div>
          <div className="stat-card__note">
            {formatMoney(totalSpent)} spent
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--sage">
            <CalendarDays size={18} />
          </div>
          <div className="stat-card__label">Trip days</div>
          <div className="stat-card__value">
            {trips.reduce((s, t) => s + daysBetween(t.start, t.end), 0)}
          </div>
          <div className="stat-card__note">across all trips</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--muted">
            <Users size={18} />
          </div>
          <div className="stat-card__label">Travelers</div>
          <div className="stat-card__value">{totalTravelers}</div>
          <div className="stat-card__note">total across trips</div>
        </div>
      </div>

      {/* Two-column sections */}
      <div className="dashboard-sections">
        {/* Upcoming trips */}
        <div className="card dashboard-section">
          <div className="dashboard-section__header">
            <span className="dashboard-section__title">Upcoming trips</span>
            <button className="dashboard-section__link" onClick={onViewTrips}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <p className="empty-state__text">No upcoming trips yet.</p>
              <button className="btn btn--primary btn--sm" onClick={onCreateTrip}>
                <Plus size={14} /> Plan a trip
              </button>
            </div>
          ) : (
            upcoming.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="dashboard-trip-mini"
                onClick={() => onOpenTrip(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenTrip(t.id)}
              >
                <img
                  className="dashboard-trip-mini__image"
                  src={t.image}
                  alt={t.destination}
                />
                <div className="dashboard-trip-mini__info">
                  <div className="dashboard-trip-mini__name">{t.name}</div>
                  <div className="dashboard-trip-mini__detail">
                    {t.destination} · {formatDateRange(t.start, t.end)} · {formatMoney(t.budget)}
                  </div>
                </div>
                <ChevronRight size={16} className="dashboard-trip-mini__arrow" />
              </div>
            ))
          )}
        </div>

        {/* Next activities */}
        <div className="card dashboard-section">
          <div className="dashboard-section__header">
            <span className="dashboard-section__title">
              {nextTrip ? `${nextTrip.destination.split(',')[0]} plan` : 'Activities'}
            </span>
            {nextTrip && (
              <button
                className="dashboard-section__link"
                onClick={() => onOpenTrip(nextTrip.id)}
              >
                Full itinerary <ChevronRight size={14} />
              </button>
            )}
          </div>
          {nextActivities.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <p className="empty-state__text">No activities planned yet.</p>
            </div>
          ) : (
            nextActivities.map((a) => (
              <div key={a.id} className="dashboard-activity">
                <button
                  className={`dashboard-activity__check ${
                    a.done ? 'dashboard-activity__check--done' : ''
                  }`}
                  onClick={() => onToggleActivity(a.id)}
                  aria-label={a.done ? 'Mark incomplete' : 'Mark complete'}
                >
                  {a.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <span
                  className={`dashboard-activity__text ${
                    a.done ? 'dashboard-activity__text--done' : ''
                  }`}
                >
                  {a.title}
                </span>
                <span className="dashboard-activity__time">{a.time}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Inspiring Wonders & Temples Section */}
      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="page-header__eyebrow">
              <Landmark size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
              Must-Visit Wonders &amp; Indian Temples
            </span>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Famous Destinations to Explore</h3>
          </div>
          {onExplore && (
            <button className="dashboard-section__link" onClick={onExplore} style={{ fontSize: '0.875rem' }}>
              Explore all ({FAMOUS_PLACES.length}) <ChevronRight size={15} />
            </button>
          )}
        </div>

        <div className="famous-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {featuredWonders.map((place) => (
            <div
              key={place.id}
              className="card famous-card"
              onClick={onExplore}
              style={{ cursor: 'pointer' }}
            >
              <div className="famous-card__image-wrap" style={{ height: '140px' }}>
                <img src={place.image} alt={place.name} loading="lazy" />
                <span className="famous-card__badge famous-card__badge--wonder">
                  {place.badge}
                </span>
              </div>
              <div className="famous-card__body" style={{ padding: 'var(--space-md)' }}>
                <div className="famous-card__location" style={{ fontSize: '0.75rem' }}>
                  <MapPin size={12} /> {place.city}, {place.country}
                </div>
                <h4 style={{ fontSize: '1rem', margin: '4px 0', fontFamily: 'DM Serif Display, Georgia, serif' }}>
                  {place.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-sm)' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-sage)' }}>
                    Est. {formatMoney(place.estimatedBudgetUSD)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {place.suggestedDurationDays} days
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
