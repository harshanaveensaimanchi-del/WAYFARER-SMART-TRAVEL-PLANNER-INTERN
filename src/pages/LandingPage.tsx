import React from 'react';
import { Compass, Map, Wallet, CalendarDays, ArrowRight, Sparkles, Landmark, Globe2 } from 'lucide-react';
import { FAMOUS_PLACES } from '../data/famousPlaces';

interface LandingPageProps {
  onStart: () => void;
  onExplore?: () => void;
}

export default function LandingPage({ onStart, onExplore }: LandingPageProps) {
  const featuredWonders = FAMOUS_PLACES.slice(0, 6);

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing__nav">
        <div className="landing__brand">
          <div className="landing__brand-icon">
            <Compass size={20} />
          </div>
          <span className="landing__brand-text">Wayfarer</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {onExplore && (
            <button className="btn btn--secondary" onClick={onExplore}>
              <Sparkles size={16} /> Explore Wonders
            </button>
          )}
          <button className="btn btn--primary" onClick={onStart}>
            Start planning <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-content">
          <div className="landing__hero-eyebrow">
            <Sparkles size={14} />
            7 Wonders · Sacred Indian Temples · World Heritage
          </div>
          <h1 className="landing__hero-title">
            Every great journey begins with a quiet plan
          </h1>
          <p className="landing__hero-subtitle">
            Wayfarer helps you shape trips that feel effortless — from iconic 7 Wonders of the World and sacred Indian temples to serene coastal escapes. Multi-currency real-time budgets, daily itineraries, and timeless memories.
          </p>
          <div className="landing__hero-actions">
            <button className="btn btn--primary btn--lg" onClick={onStart}>
              Plan your trip <ArrowRight size={18} />
            </button>
            <button className="btn btn--secondary btn--lg" onClick={onExplore || onStart}>
              <Globe2 size={18} /> Explore famous places
            </button>
          </div>
        </div>
        <div className="landing__hero-image">
          <img
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
            alt="Taj Mahal in Agra India at sunrise"
          />
        </div>
      </section>

      {/* Famous Places Showcase Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-2xl) var(--space-2xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <span className="page-header__eyebrow">
            <Landmark size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
            Iconic Destinations
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
            From the 7 Wonders to India’s Ancient Temples
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
            Discover the Taj Mahal, Kashi Vishwanath, Golden Temple, Roman Colosseum, and more. Choose any wonder to instantly plan your itinerary.
          </p>
        </div>

        <div className="famous-grid">
          {featuredWonders.map((place) => (
            <div
              key={place.id}
              className="card famous-card"
              onClick={onExplore || onStart}
              style={{ cursor: 'pointer' }}
            >
              <div className="famous-card__image-wrap">
                <img src={place.image} alt={place.name} loading="lazy" />
                <span className="famous-card__badge famous-card__badge--wonder">
                  {place.badge}
                </span>
              </div>
              <div className="famous-card__body">
                <div className="famous-card__location">
                  {place.city}, {place.country}
                </div>
                <h3 className="famous-card__title">{place.name}</h3>
                <p className="famous-card__tagline">{place.tagline}</p>
                <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
                    {place.suggestedDurationDays} days recommended
                  </span>
                  <span className="btn btn--secondary btn--sm">
                    Plan <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
          <button className="btn btn--primary btn--lg" onClick={onExplore || onStart}>
            Explore all {FAMOUS_PLACES.length} famous landmarks &amp; temples <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="landing__features">
        <h2 className="landing__features-title">Everything you need, thoughtfully planned</h2>
        <p className="landing__features-subtitle">
          A handful of thoughtful tools to keep your travels organized and your mind at ease.
        </p>
        <div className="landing__features-grid">
          <div className="card landing__feature-card">
            <div className="landing__feature-icon landing__feature-icon--sage">
              <CalendarDays size={24} />
            </div>
            <h3 className="landing__feature-title">Day-by-day itineraries</h3>
            <p className="landing__feature-text">
              Build detailed daily plans with times, categories, and notes. 
              Check activities off as you go and rearrange with ease.
            </p>
          </div>
          <div className="card landing__feature-card">
            <div className="landing__feature-icon landing__feature-icon--terracotta">
              <Wallet size={24} />
            </div>
            <h3 className="landing__feature-title">Real-Time Multi-Currency</h3>
            <p className="landing__feature-text">
              Track spending in Indian Rupees (₹), US Dollars ($), British Pounds (£), Euros (€), and more with live conversion rates.
            </p>
          </div>
          <div className="card landing__feature-card">
            <div className="landing__feature-icon landing__feature-icon--sage">
              <Map size={24} />
            </div>
            <h3 className="landing__feature-title">Famous Places &amp; Temples</h3>
            <p className="landing__feature-text">
              Browse the 7 Wonders of the World and sacred heritage temples with ready-made highlights and estimated budgets.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing__cta">
        <h2 className="landing__cta-title">Ready to plan your next adventure?</h2>
        <p className="landing__cta-text">
          Start with one trip — choose an iconic temple, a world wonder, or your secret haven, and let the excitement unfold.
        </p>
        <button className="btn btn--primary btn--lg" onClick={onStart}>
          Get started free <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}
