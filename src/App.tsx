import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  LayoutDashboard,
  ListChecks,
  Wallet,
  Plus,
  Search,
  Moon,
  Sun,
  Menu,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Globe2,
  ChevronDown,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Trip, Activity, Expense, ThemeMode } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { useCurrency } from './hooks/useCurrency';
import { SEED_TRIPS, SEED_ACTIVITIES, SEED_EXPENSES } from './data/seed';
import { CURRENCIES } from './data/currencies';
import { FamousPlace } from './data/famousPlaces';
import { formatDate } from './utils/format';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import TripsPage from './pages/TripsPage';
import ItineraryPage from './pages/ItineraryPage';
import ExpensesPage from './pages/ExpensesPage';
import FormModal from './components/FormModal';

type Page = 'landing' | 'dashboard' | 'explore' | 'trips' | 'itinerary' | 'expenses';

interface ModalState {
  type: 'trip' | 'activity' | 'expense';
  data?: any;
}

function getInitialPage(): Page {
  const path = window.location.pathname.split('/').filter(Boolean)[0];
  if (path === 'welcome') return 'landing';
  if (path === 'explore') return 'explore';
  if (path === 'trips') return 'trips';
  if (path === 'itinerary') return 'itinerary';
  if (path === 'expenses') return 'expenses';
  if (path === 'dashboard') return 'dashboard';
  return 'dashboard';
}

function getInitialTripId(): string {
  return window.location.pathname.split('/')[2] || 'trip-kyoto';
}

export default function App() {
  // ───── State ─────
  const [trips, setTrips] = useLocalStorage<Trip[]>('wf.trips', SEED_TRIPS);
  const [activities, setActivities] = useLocalStorage<Activity[]>(
    'wf.activities',
    SEED_ACTIVITIES
  );
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    'wf.expenses',
    SEED_EXPENSES
  );
  const [theme, setTheme] = useLocalStorage<ThemeMode>('wf.theme', 'light');

  const [page, setPage] = useState<Page>(getInitialPage);
  const [currentTripId, setCurrentTripId] = useState<string>(getInitialTripId);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { message: toastMsg, toast } = useToast();

  // ───── Real-Time Multi-Currency ─────
  const {
    currency,
    setCurrencyCode,
    ratesLoading,
    lastUpdated,
    formatMoney,
    refreshRates,
    exchangeRateText,
  } = useCurrency();

  const currentTrip = trips.find((t) => t.id === currentTripId) || trips[0];

  // ───── Theme ─────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // ───── Navigation ─────
  const navigate = useCallback(
    (p: Page, tripId?: string) => {
      setPage(p);
      if (tripId) setCurrentTripId(tripId);
      setMobileOpen(false);

      const url =
        p === 'dashboard'
          ? '/'
          : p === 'landing'
          ? '/welcome'
          : p === 'explore'
          ? '/explore'
          : p === 'trips'
          ? '/trips'
          : `/${p}/${tripId || currentTripId}`;
      window.history.pushState({}, '', url);
    },
    [currentTripId]
  );

  useEffect(() => {
    const onPop = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const p = parts[0];
      setPage(
        p === 'welcome'
          ? 'landing'
          : p === 'explore'
          ? 'explore'
          : p === 'trips'
          ? 'trips'
          : p === 'itinerary'
          ? 'itinerary'
          : p === 'expenses'
          ? 'expenses'
          : 'dashboard'
      );
      if (parts[1]) setCurrentTripId(parts[1]);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Close currency dropdown when clicking elsewhere
  useEffect(() => {
    if (!currencyOpen) return;
    const close = () => setCurrencyOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [currencyOpen]);

  // ───── CRUD: Trips ─────
  const saveTrip = (data: Partial<Trip>) => {
    if (data.id) {
      setTrips((prev) =>
        prev.map((t) => (t.id === data.id ? { ...t, ...data } : t))
      );
    } else {
      const newTrip: Trip = {
        id: uuidv4(),
        name: data.name || 'Untitled Trip',
        destination: data.destination || '',
        start: data.start || new Date().toISOString().slice(0, 10),
        end: data.end || new Date().toISOString().slice(0, 10),
        budget: data.budget || 0,
        spent: 0,
        image: data.image || '',
        travelers: data.travelers || 1,
        status: 'upcoming',
        favorite: false,
        progress: 0,
      };
      setTrips((prev) => [newTrip, ...prev]);
      setCurrentTripId(newTrip.id);
    }
    setModal(null);
    toast('Trip saved');
  };

  const deleteTrip = (trip: Trip) => {
    if (!window.confirm('Delete this trip and all its activities and expenses?'))
      return;
    setTrips((prev) => prev.filter((t) => t.id !== trip.id));
    setActivities((prev) => prev.filter((a) => a.tripId !== trip.id));
    setExpenses((prev) => prev.filter((e) => e.tripId !== trip.id));
    toast('Trip deleted');
  };

  const toggleFavorite = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, favorite: !t.favorite } : t))
    );
  };

  // ───── One-click Plan from Famous Place ─────
  const planTripFromPlace = (place: FamousPlace) => {
    const today = new Date();
    const futureStart = new Date(today.getTime() + 14 * 86400000).toISOString().slice(0, 10);
    const futureEnd = new Date(today.getTime() + (14 + place.suggestedDurationDays) * 86400000)
      .toISOString()
      .slice(0, 10);

    setModal({
      type: 'trip',
      data: {
        name: `Journey to ${place.name}`,
        destination: `${place.city}, ${place.country}`,
        budget: place.estimatedBudgetUSD,
        image: place.image,
        start: futureStart,
        end: futureEnd,
        travelers: 2,
      },
    });
  };

  // ───── One-click Add Famous Place to Itinerary ─────
  const addPlaceToItinerary = (place: FamousPlace) => {
    if (!currentTrip) return;
    const newActs: Activity[] = place.highlights.map((h, i) => ({
      id: uuidv4(),
      tripId: currentTrip.id,
      day: Math.min(i, 2),
      title: `${place.name}: ${h}`,
      time: i === 0 ? '09:00' : i === 1 ? '14:00' : '17:30',
      category: 'Sightseeing',
      done: false,
      notes: `${place.tagline} (Best: ${place.bestTimeToVisit})`,
    }));

    setActivities((prev) => [...prev, ...newActs]);
    toast(`Added ${place.highlights.length} activities to ${currentTrip.name}`);
    navigate('itinerary', currentTrip.id);
  };

  // ───── CRUD: Activities ─────
  const saveActivity = (data: Partial<Activity>) => {
    if (data.id) {
      setActivities((prev) =>
        prev.map((a) => (a.id === data.id ? { ...a, ...data } as Activity : a))
      );
    } else {
      const newAct: Activity = {
        id: uuidv4(),
        tripId: currentTripId,
        day: data.day || 0,
        title: data.title || '',
        time: data.time || '09:00',
        category: data.category || 'Other',
        done: false,
        notes: data.notes || '',
      };
      setActivities((prev) => [...prev, newAct]);
    }
    setModal(null);
    toast('Activity saved');
  };

  const toggleActivity = (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === activityId ? { ...a, done: !a.done } : a))
    );
  };

  const deleteActivity = (activityId: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
    toast('Activity removed');
  };

  const moveActivity = (activityId: string, direction: number) => {
    setActivities((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((a) => a.id === activityId);
      if (idx < 0) return prev;
      const target = idx + direction;
      if (
        target < 0 ||
        target >= arr.length ||
        arr[target].tripId !== arr[idx].tripId ||
        arr[target].day !== arr[idx].day
      )
        return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  // ───── CRUD: Expenses ─────
  const saveExpense = (data: Partial<Expense>) => {
    if (data.id) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === data.id ? { ...e, ...data } as Expense : e))
      );
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id !== currentTripId) return t;
          const tripExpenses = expenses.map((e) =>
            e.id === data.id ? { ...e, ...data } : e
          ).filter((e) => e.tripId === currentTripId);
          const totalSpent = tripExpenses.reduce(
            (sum, e) => sum + (e.amount as number),
            0
          );
          return { ...t, spent: totalSpent };
        })
      );
    } else {
      const newExp: Expense = {
        id: uuidv4(),
        tripId: currentTripId,
        title: data.title || '',
        category: data.category || 'Other',
        amount: data.amount || 0,
        date: data.date || new Date().toISOString().slice(0, 10),
        notes: data.notes,
      };
      setExpenses((prev) => [...prev, newExp]);
      const currentExpenses = expenses.filter(
        (e) => e.tripId === currentTripId
      );
      const newTotal =
        currentExpenses.reduce((sum, e) => sum + e.amount, 0) + newExp.amount;
      setTrips((prev) =>
        prev.map((t) =>
          t.id === currentTripId ? { ...t, spent: newTotal } : t
        )
      );
    }
    setModal(null);
    toast('Expense saved');
  };

  const deleteExpense = (expenseId: string) => {
    const exp = expenses.find((e) => e.id === expenseId);
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    if (exp) {
      setTrips((prev) =>
        prev.map((t) =>
          t.id === currentTripId
            ? { ...t, spent: Math.max(0, t.spent - exp.amount) }
            : t
        )
      );
    }
    toast('Expense removed');
  };

  // ───── Filtered + sorted trips ─────
  const filteredTrips = trips
    .filter((t) => {
      if (filter !== 'all' && filter !== 'favorites' && t.status !== filter) return false;
      if (
        query &&
        !(t.name + ' ' + t.destination)
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'budget') return b.budget - a.budget;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });

  // ───── Nav items ─────
  const navItems: Array<{
    key: Page;
    label: string;
    icon: typeof Compass;
  }> = [
    { key: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { key: 'explore', label: 'Famous Wonders', icon: Sparkles },
    { key: 'trips', label: 'My trips', icon: Compass },
    { key: 'itinerary', label: 'Itinerary', icon: ListChecks },
    { key: 'expenses', label: 'Expenses', icon: Wallet },
  ];

  // ───── Helpers ─────
  function timeAgo(iso: string | null): string {
    if (!iso) return 'live';
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    return `${hrs}h ago`;
  }

  // ───── Render ─────
  if (page === 'landing') {
    return (
      <div data-theme={theme}>
        <LandingPage
          onStart={() => navigate('dashboard')}
          onExplore={() => navigate('explore')}
        />
        {toastMsg && (
          <div className="toast">
            <CheckCircle2 size={16} />
            {toastMsg}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand" onClick={() => navigate('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="sidebar__brand-icon">
            <Compass size={18} />
          </div>
          <span className="sidebar__brand-text">Wayfarer</span>
        </div>

        <div className="sidebar__section-label">Workspace</div>
        <nav className="sidebar__nav">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`sidebar__nav-item ${
                page === key ? 'sidebar__nav-item--active' : ''
              }`}
              onClick={() => navigate(key)}
            >
              <Icon size={17} />
              {label}
              {key === 'explore' && (
                <span className="sidebar__nav-badge" style={{ background: 'var(--accent-terracotta-light)', color: 'var(--accent-terracotta)' }}>
                  Wonders
                </span>
              )}
              {key === 'trips' && (
                <span className="sidebar__nav-badge">{trips.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar__trips-header">
          Your trips
          <button
            onClick={() => setModal({ type: 'trip' })}
            aria-label="Create new trip"
          >
            <Plus size={15} />
          </button>
        </div>
        {trips.slice(0, 5).map((t) => (
          <button
            key={t.id}
            className={`sidebar__trip-item ${
              currentTripId === t.id ? 'sidebar__trip-item--active' : ''
            }`}
            onClick={() => navigate('itinerary', t.id)}
          >
            <span className="sidebar__trip-dot" />
            {t.destination.split(',')[0]}
            <span className="sidebar__trip-date">
              {formatDate(t.start).split(' ')[0]}
            </span>
          </button>
        ))}

        <div className="sidebar__bottom">
          {/* Currency picker in sidebar */}
          <div className="currency-picker" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>
              Display Currency
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <select
                className="currency-select"
                value={currency.code}
                onChange={(e) => {
                  setCurrencyCode(e.target.value);
                  toast(`Currency changed to ${e.target.value}`);
                }}
                aria-label="Choose currency"
                style={{
                  background: 'var(--bg-input)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid var(--border-light)',
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>

              <button
                className="btn--icon"
                onClick={async () => {
                  await refreshRates();
                  toast('Live exchange rates updated');
                }}
                title={`Refresh live rates. ${exchangeRateText}`}
                aria-label="Refresh live rates"
              >
                <RefreshCw size={14} className={ratesLoading ? 'spin' : ''} />
              </button>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--accent-sage)', marginTop: 4, fontWeight: 500 }}>
              {exchangeRateText}
            </div>
          </div>

          <button className="sidebar__theme-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <div className="sidebar__profile">
            <div className="sidebar__avatar">HN</div>
            <div>
              <div className="sidebar__profile-name">Harsha Naveen</div>
              <div className="sidebar__profile-role">Personal workspace</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile scrim */}
      {mobileOpen && (
        <div className="scrim" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <button
            className="topbar__menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="topbar__breadcrumb">
            Workspace <ChevronRight size={14} />
            <b>{navItems.find((n) => n.key === page)?.label || 'Overview'}</b>
          </div>
          <div className="topbar__right">
            <div className="topbar__search">
              <Search size={15} />
              <input
                placeholder="Search trips, places..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
              />
            </div>

            {/* Prominent Quick-Switch Currency in Topbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                className="topbar__currency-select"
                value={currency.code}
                onChange={(e) => {
                  setCurrencyCode(e.target.value);
                  toast(`Switched currency to ${e.target.value}`);
                }}
                aria-label="Change display currency"
                style={{
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 28px 6px 12px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-heading)',
                  height: '36px',
                  width: 'auto',
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="topbar__icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="topbar__avatar">HN</div>
          </div>
        </header>

        <div className="page-content">
          {page === 'dashboard' && (
            <DashboardPage
              trips={trips}
              activities={activities}
              onCreateTrip={() => setModal({ type: 'trip' })}
              onViewTrips={() => navigate('trips')}
              onOpenTrip={(id) => navigate('itinerary', id)}
              onToggleActivity={toggleActivity}
              onGoLanding={() => navigate('landing')}
              formatMoney={formatMoney}
              onExplore={() => navigate('explore')}
            />
          )}

          {page === 'explore' && (
            <ExplorePage
              onPlanTripFromPlace={planTripFromPlace}
              onAddPlaceToItinerary={addPlaceToItinerary}
              formatMoney={formatMoney}
              activeTrip={currentTrip}
            />
          )}

          {page === 'trips' && (
            <TripsPage
              trips={filteredTrips}
              totalCount={trips.length}
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
              query={query}
              onCreateTrip={() => setModal({ type: 'trip' })}
              onOpenTrip={(t) => navigate('itinerary', t.id)}
              onEditTrip={(t) => setModal({ type: 'trip', data: t })}
              onDeleteTrip={deleteTrip}
              onToggleFavorite={toggleFavorite}
              formatMoney={formatMoney}
            />
          )}

          {page === 'itinerary' && currentTrip && (
            <ItineraryPage
              trip={currentTrip}
              activities={activities.filter(
                (a) => a.tripId === currentTrip.id
              )}
              query={query}
              onEditTrip={() =>
                setModal({ type: 'trip', data: currentTrip })
              }
              onAddActivity={() => setModal({ type: 'activity' })}
              onEditActivity={(a) =>
                setModal({ type: 'activity', data: a })
              }
              onToggleActivity={toggleActivity}
              onDeleteActivity={deleteActivity}
              onMoveActivity={moveActivity}
              formatMoney={formatMoney}
            />
          )}

          {page === 'expenses' && currentTrip && (
            <ExpensesPage
              trips={trips}
              trip={currentTrip}
              expenses={expenses.filter(
                (e) => e.tripId === currentTrip.id
              )}
              onChooseTrip={(id) => setCurrentTripId(id)}
              onAddExpense={() => setModal({ type: 'expense' })}
              onEditExpense={(e) =>
                setModal({ type: 'expense', data: e })
              }
              onDeleteExpense={deleteExpense}
              formatMoney={formatMoney}
              currencySymbol={currency.symbol}
            />
          )}
        </div>
      </main>

      {/* Toast */}
      {toastMsg && (
        <div className="toast">
          <CheckCircle2 size={16} />
          {toastMsg}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <FormModal
          type={modal.type}
          data={modal.data}
          trip={currentTrip}
          onClose={() => setModal(null)}
          onSubmit={
            modal.type === 'trip'
              ? saveTrip
              : modal.type === 'activity'
              ? saveActivity
              : saveExpense
          }
          currencySymbol={currency.symbol}
          currencyCode={currency.code}
        />
      )}
    </div>
  );
}
