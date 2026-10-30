import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  Star,
  Search,
  Plus,
  Landmark,
  Globe2,
  Check,
  ChevronRight,
  Sun,
  Flame,
} from 'lucide-react';
import { FAMOUS_PLACES, FamousPlace } from '../data/famousPlaces';
import { Trip } from '../types';

interface ExplorePageProps {
  onPlanTripFromPlace: (place: FamousPlace) => void;
  onAddPlaceToItinerary?: (place: FamousPlace) => void;
  formatMoney: (amountUSD: number) => string;
  activeTrip?: Trip;
}

export default function ExplorePage({
  onPlanTripFromPlace,
  onAddPlaceToItinerary,
  formatMoney,
  activeTrip,
}: ExplorePageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<FamousPlace | null>(null);

  // Extract unique countries
  const countries = ['all', ...Array.from(new Set(FAMOUS_PLACES.map((p) => p.country)))];

  const filteredPlaces = FAMOUS_PLACES.filter((place) => {
    // Category filter
    if (activeCategory === 'wonders' && place.category !== 'wonders') return false;
    if (activeCategory === 'temple' && place.category !== 'temple') return false;
    if (activeCategory === 'heritage' && place.category !== 'heritage') return false;
    if (activeCategory === 'nature' && place.category !== 'nature') return false;

    // Country filter
    if (selectedCountry !== 'all' && place.country !== selectedCountry) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        place.name.toLowerCase().includes(q) ||
        place.city.toLowerCase().includes(q) ||
        place.country.toLowerCase().includes(q) ||
        place.tagline.toLowerCase().includes(q) ||
        place.highlights.some((h) => h.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="explore-page">
      {/* Header */}
      <div className="page-header">
        <span className="page-header__eyebrow">
          <Sparkles size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
          Worldwide Wonders &amp; Sacred Temples
        </span>
        <div className="page-header__row">
          <div>
            <h1>Famous Places of the World</h1>
            <p className="page-header__subtitle">
              Explore the 7 Wonders of the World, sacred temples of India, and timeless global heritage. One-click plan your dream journey.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Banner / Quick Pill Links */}
      <div className="explore-highlights-bar">
        <button
          className={`explore-pill ${activeCategory === 'all' && selectedCountry === 'all' ? 'explore-pill--active' : ''}`}
          onClick={() => { setActiveCategory('all'); setSelectedCountry('all'); }}
        >
          <Globe2 size={15} /> All Destinations ({FAMOUS_PLACES.length})
        </button>
        <button
          className={`explore-pill ${activeCategory === 'wonders' ? 'explore-pill--active' : ''}`}
          onClick={() => { setActiveCategory('wonders'); setSelectedCountry('all'); }}
        >
          <Sparkles size={15} /> 7 Wonders of the World
        </button>
        <button
          className={`explore-pill ${activeCategory === 'temple' || selectedCountry === 'India' ? 'explore-pill--active' : ''}`}
          onClick={() => { setActiveCategory('temple'); setSelectedCountry('India'); }}
        >
          <Landmark size={15} /> Sacred Temples of India
        </button>
        <button
          className={`explore-pill ${activeCategory === 'heritage' ? 'explore-pill--active' : ''}`}
          onClick={() => { setActiveCategory('heritage'); setSelectedCountry('all'); }}
        >
          <Compass size={15} /> Global Heritage Icons
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="filter-bar__tabs">
          <button
            className={`filter-bar__tab ${activeCategory === 'all' ? 'filter-bar__tab--active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Categories
          </button>
          <button
            className={`filter-bar__tab ${activeCategory === 'wonders' ? 'filter-bar__tab--active' : ''}`}
            onClick={() => setActiveCategory('wonders')}
          >
            7 Wonders
          </button>
          <button
            className={`filter-bar__tab ${activeCategory === 'temple' ? 'filter-bar__tab--active' : ''}`}
            onClick={() => setActiveCategory('temple')}
          >
            Indian Temples
          </button>
          <button
            className={`filter-bar__tab ${activeCategory === 'heritage' ? 'filter-bar__tab--active' : ''}`}
            onClick={() => setActiveCategory('heritage')}
          >
            Heritage
          </button>
          <button
            className={`filter-bar__tab ${activeCategory === 'nature' ? 'filter-bar__tab--active' : ''}`}
            onClick={() => setActiveCategory('nature')}
          >
            Nature
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            aria-label="Filter by country"
            style={{ width: 'auto', paddingRight: '32px' }}
          >
            <option value="all">🌍 All Countries</option>
            {countries
              .filter((c) => c !== 'all')
              .map((c) => (
                <option key={c} value={c}>
                  {c === 'India' ? '🇮🇳 India' : c === 'Italy' ? '🇮🇹 Italy' : c === 'China' ? '🇨🇳 China' : c === 'Egypt' ? '🇪🇬 Egypt' : c === 'France' ? '🇫🇷 France' : c === 'Japan' ? '🇯🇵 Japan' : c === 'Jordan' ? '🇯🇴 Jordan' : c === 'Peru' ? '🇵🇪 Peru' : c === 'Brazil' ? '🇧🇷 Brazil' : c === 'Mexico' ? '🇲🇽 Mexico' : c === 'UAE' ? '🇦🇪 UAE' : `📍 ${c}`}
                </option>
              ))}
          </select>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input
              style={{ paddingLeft: '34px' }}
              placeholder="Search temple, wonder, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid of famous places */}
      {filteredPlaces.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <Compass size={28} />
          </div>
          <h3 className="empty-state__title">No famous places found</h3>
          <p className="empty-state__text">Try clearing your search query or selecting "All Categories".</p>
          <button
            className="btn btn--secondary"
            onClick={() => { setActiveCategory('all'); setSelectedCountry('all'); setSearchQuery(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="famous-grid">
          {filteredPlaces.map((place) => (
            <div key={place.id} className="card famous-card">
              <div
                className="famous-card__image-wrap"
                onClick={() => setSelectedPlace(place)}
                style={{ cursor: 'pointer' }}
              >
                <img src={place.image} alt={place.name} loading="lazy" />
                <span className={`famous-card__badge ${place.category === 'wonders' ? 'famous-card__badge--wonder' : place.category === 'temple' ? 'famous-card__badge--temple' : ''}`}>
                  {place.badge}
                </span>
                <div className="famous-card__rating">
                  <Star size={12} fill="#F39C12" color="#F39C12" /> {place.rating}
                </div>
              </div>

              <div className="famous-card__body">
                <div className="famous-card__location">
                  <MapPin size={13} /> {place.city}, {place.country}
                </div>
                <h3
                  className="famous-card__title"
                  onClick={() => setSelectedPlace(place)}
                  style={{ cursor: 'pointer' }}
                >
                  {place.name}
                </h3>
                <p className="famous-card__tagline">{place.tagline}</p>

                {/* Highlights tags */}
                <div className="famous-card__highlights">
                  {place.highlights.slice(0, 2).map((h, i) => (
                    <span key={i} className="famous-card__tag">
                      {h}
                    </span>
                  ))}
                  {place.highlights.length > 2 && (
                    <span className="famous-card__tag famous-card__tag--more">
                      +{place.highlights.length - 2} more
                    </span>
                  )}
                </div>

                {/* Footer with budget & action buttons */}
                <div className="famous-card__footer">
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Est. Trip Budget
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-heading)' }}>
                      {formatMoney(place.estimatedBudgetUSD)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn--secondary btn--sm"
                      onClick={() => setSelectedPlace(place)}
                      title="View Details"
                    >
                      Details
                    </button>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => onPlanTripFromPlace(place)}
                      title="Plan a trip to this destination"
                    >
                      <Plus size={14} /> Plan trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal for Selected Place */}
      {selectedPlace && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPlace(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                className="modal__close"
                onClick={() => setSelectedPlace(null)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  borderRadius: '50%',
                }}
              >
                ✕
              </button>
              <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
                <span className="famous-card__badge famous-card__badge--wonder">
                  {selectedPlace.badge}
                </span>
              </div>
            </div>

            <div className="modal__body" style={{ gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-sage)', fontSize: '0.8125rem' }}>
                <MapPin size={15} />
                <b>{selectedPlace.city}, {selectedPlace.country}</b>
              </div>

              <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{selectedPlace.name}</h2>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{selectedPlace.tagline}</p>
              <p style={{ lineHeight: 1.7, color: 'var(--text-body)' }}>{selectedPlace.description}</p>

              <div style={{ background: 'var(--bg-input)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 8, color: 'var(--text-heading)' }}>
                  ✨ Top Experiences &amp; Highlights:
                </div>
                <ul style={{ paddingLeft: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.8125rem' }}>
                  {selectedPlace.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 4 }}>
                <div className="card" style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BEST SEASON</div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', marginTop: 2 }}>{selectedPlace.bestTimeToVisit.split('(')[0]}</div>
                </div>
                <div className="card" style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RECOMMENDED</div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', marginTop: 2 }}>{selectedPlace.suggestedDurationDays} Days</div>
                </div>
                <div className="card" style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EST. BUDGET</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--accent-sage)', marginTop: 2 }}>
                    {formatMoney(selectedPlace.estimatedBudgetUSD)}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal__footer" style={{ justifyContent: 'space-between' }}>
              {activeTrip && onAddPlaceToItinerary ? (
                <button
                  className="btn btn--secondary"
                  onClick={() => {
                    onAddPlaceToItinerary(selectedPlace);
                    setSelectedPlace(null);
                  }}
                >
                  <Plus size={15} /> Add to "{activeTrip.name.slice(0, 15)}..."
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn--secondary" onClick={() => setSelectedPlace(null)}>
                  Close
                </button>
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    onPlanTripFromPlace(selectedPlace);
                    setSelectedPlace(null);
                  }}
                >
                  <Plus size={15} /> Plan this trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
