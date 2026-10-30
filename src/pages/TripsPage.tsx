import React from 'react';
import {
  Plus,
  Heart,
  MapPin,
  CalendarDays,
  Users,
  Pencil,
  Trash2,
  Compass,
} from 'lucide-react';
import { Trip } from '../types';
import { formatDateRange } from '../utils/format';

interface TripsPageProps {
  trips: Trip[];
  totalCount: number;
  filter: string;
  setFilter: (f: string) => void;
  sort: string;
  setSort: (s: string) => void;
  query: string;
  onCreateTrip: () => void;
  onOpenTrip: (trip: Trip) => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
  onToggleFavorite: (tripId: string) => void;
  formatMoney: (amountUSD: number) => string;
}

export default function TripsPage({
  trips,
  totalCount,
  filter,
  setFilter,
  sort,
  setSort,
  query,
  onCreateTrip,
  onOpenTrip,
  onEditTrip,
  onDeleteTrip,
  onToggleFavorite,
  formatMoney,
}: TripsPageProps) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'favorites', label: 'Favorites' },
  ];

  const filteredTrips =
    filter === 'favorites'
      ? trips.filter((t) => t.favorite)
      : trips;

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <span className="page-header__eyebrow">My Trips</span>
        <div className="page-header__row">
          <div>
            <h1>Your journeys</h1>
            <p className="page-header__subtitle">
              {totalCount} trip{totalCount !== 1 ? 's' : ''} planned
              {query && ` · showing results for "${query}"`}
            </p>
          </div>
          <button className="btn btn--primary" onClick={onCreateTrip}>
            <Plus size={16} /> New trip
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-bar__tabs">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`filter-bar__tab ${
                filter === f.key ? 'filter-bar__tab--active' : ''
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="filter-bar__sort">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort trips"
          >
            <option value="date">Sort by date</option>
            <option value="name">Sort by name</option>
            <option value="budget">Sort by budget</option>
          </select>
        </div>
      </div>

      {/* Trip grid */}
      {filteredTrips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <Compass size={28} />
          </div>
          <h3 className="empty-state__title">No trips found</h3>
          <p className="empty-state__text">
            {query
              ? 'Try adjusting your search or filters.'
              : 'Start planning your first adventure!'}
          </p>
          <button className="btn btn--primary" onClick={onCreateTrip}>
            <Plus size={16} /> Create a trip
          </button>
        </div>
      ) : (
        <div className="trips-grid">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="card trip-card">
              <div
                className="trip-card__image"
                onClick={() => onOpenTrip(trip)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenTrip(trip)}
                style={{ cursor: 'pointer' }}
              >
                <img src={trip.image} alt={trip.destination} loading="lazy" />
                <span
                  className={`trip-card__badge trip-card__badge--${trip.status}`}
                >
                  {trip.status}
                </span>
                <div className="trip-card__overlay">
                  <button
                    className={`trip-card__overlay-btn ${
                      trip.favorite ? 'trip-card__overlay-btn--fav' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(trip.id);
                    }}
                    aria-label={
                      trip.favorite
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                  >
                    <Heart
                      size={15}
                      fill={trip.favorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    className="trip-card__overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTrip(trip);
                    }}
                    aria-label="Edit trip"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="trip-card__overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrip(trip);
                    }}
                    aria-label="Delete trip"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div
                className="trip-card__body"
                onClick={() => onOpenTrip(trip)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenTrip(trip)}
                style={{ cursor: 'pointer' }}
              >
                <div className="trip-card__destination">
                  <MapPin size={13} />
                  {trip.destination}
                </div>
                <h3 className="trip-card__name">{trip.name}</h3>
                <div className="trip-card__dates">
                  <CalendarDays
                    size={13}
                    style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }}
                  />
                  {formatDateRange(trip.start, trip.end)}
                </div>
                <div className="trip-card__footer">
                  <div className="trip-card__budget">
                    <span className="trip-card__budget-label">Budget </span>
                    <span className="trip-card__budget-value">
                      {formatMoney(trip.budget)}
                    </span>
                  </div>
                  <div className="trip-card__travelers">
                    <Users size={14} />
                    {trip.travelers}
                  </div>
                </div>
                {trip.budget > 0 && (
                  <div className="progress">
                    <div
                      className={`progress__bar ${
                        trip.spent / trip.budget > 0.9
                          ? 'progress__bar--danger'
                          : trip.spent / trip.budget > 0.7
                          ? 'progress__bar--warning'
                          : ''
                      }`}
                      style={{
                        width: `${Math.min(100, (trip.spent / trip.budget) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
