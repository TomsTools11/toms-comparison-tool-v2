import React, { useReducer, useMemo, useEffect } from 'react';
import { DashboardState, DashboardAction, ComparisonItem, FilterOption, SortOption } from '../types';
import { INITIAL_ITEMS, METRIC_LABELS } from '../constants';
import { exportToCSV, downloadFile } from '../utils/dataUtils';
import { ItemCard } from './ItemCard';
import { ComparisonTable } from './ComparisonTable';
import { DataEntryForm } from './DataEntryForm';
import { DataMigrationModal } from './DataMigrationModal';
import { Button } from './ui/Primitives';
import { SearchIcon, BarChartIcon, PlusIcon, ChevronDownIcon, DownloadIcon, UploadIcon } from './ui/Icons';

// --- State Management ---
const initialState: DashboardState = {
  items: INITIAL_ITEMS, // In a real app, load from localStorage here
  selectedIds: [],
  expandedId: null,
  activeFilter: 'all',
  sortBy: 'score',
  isModalOpen: false,
  isMigrationModalOpen: false,
  editingItemId: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload], isModalOpen: false };
    case 'IMPORT_ITEMS':
      // Merge imported items, avoiding duplicates by ID if possible (or just appending)
      const existingIds = new Set(state.items.map(i => i.id));
      const newItems = action.payload.filter(i => !existingIds.has(i.id));
      return { 
        ...state, 
        items: [...state.items, ...newItems],
        isMigrationModalOpen: false 
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(i => i.id === action.payload.id ? { ...i, ...action.payload.updates } : i),
        isModalOpen: false,
        editingItemId: null
      };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload), selectedIds: state.selectedIds.filter(id => id !== action.payload) };
    case 'TOGGLE_SELECT':
      const isSelected = state.selectedIds.includes(action.payload);
      // Max 4 selections
      if (!isSelected && state.selectedIds.length >= 4) return state;
      return {
        ...state,
        selectedIds: isSelected
          ? state.selectedIds.filter(id => id !== action.payload)
          : [...state.selectedIds, action.payload]
      };
    case 'CLEAR_SELECTION':
      return { ...state, selectedIds: [] };
    case 'SET_EXPANDED':
      return { ...state, expandedId: state.expandedId === action.payload ? null : action.payload };
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true, editingItemId: action.payload || null };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, editingItemId: null };
    case 'TOGGLE_MIGRATION_MODAL':
      return { ...state, isMigrationModalOpen: action.payload };
    default:
      return state;
  }
}

// --- Component ---
export const Dashboard: React.FC = () => {
  // Load initial state from local storage if available
  const savedState = localStorage.getItem('nexus_dashboard_data');
  const initializer = savedState ? JSON.parse(savedState) : initialState;
  
  const [state, dispatch] = useReducer(dashboardReducer, initializer);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('nexus_dashboard_data', JSON.stringify({ items: state.items }));
  }, [state.items]);

  // Derived Data
  const filteredItems = useMemo(() => {
    return state.items.filter(item => {
      if (state.activeFilter === 'all') return true;
      return item.category === state.activeFilter;
    });
  }, [state.items, state.activeFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (state.sortBy === 'score') {
        const scoreA = Object.values(a.metrics).reduce<number>((sum, v) => sum + (v as number), 0);
        const scoreB = Object.values(b.metrics).reduce<number>((sum, v) => sum + (v as number), 0);
        return scoreB - scoreA;
      }
      if (state.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [filteredItems, state.sortBy]);

  const selectedItems = useMemo(() => 
    state.items.filter(i => state.selectedIds.includes(i.id)),
    [state.items, state.selectedIds]
  );

  const activeEditItem = useMemo(() => 
    state.items.find(i => i.id === state.editingItemId),
    [state.items, state.editingItemId]
  );

  // Handlers
  const handleScrollToCompare = () => {
    document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExport = (type: 'json' | 'csv') => {
    if (type === 'json') {
      const jsonStr = JSON.stringify(state.items, null, 2);
      downloadFile(jsonStr, 'nexus_export.json', 'json');
    } else {
      const csvStr = exportToCSV(state.items);
      downloadFile(csvStr, 'nexus_export.csv', 'csv');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header Section */}
      <header className="py-12 px-6 lg:px-12 border-b border-border bg-bg-primary">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-blue/30 bg-brand-blue/10 mb-4">
                  <SearchIcon className="w-3 h-3 text-brand-blue" />
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Comparison Tool V1.0</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-muted">
                 Nexus Dashboard
               </h1>
               <p className="mt-2 text-lg text-text-muted max-w-2xl">
                 Analyze features, metrics, and benchmarks side-by-side to make data-driven decisions.
               </p>
            </div>
            
            <div className="flex gap-2">
              <div className="relative group">
                <Button variant="secondary" className="gap-2">
                  <DownloadIcon className="w-4 h-4" /> Export
                </Button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-bg-elevated border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                   <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover first:rounded-t-lg">JSON</button>
                   <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover last:rounded-b-lg">CSV</button>
                </div>
              </div>
              <Button variant="secondary" onClick={() => dispatch({ type: 'TOGGLE_MIGRATION_MODAL', payload: true })} className="gap-2">
                <UploadIcon className="w-4 h-4" /> Import
              </Button>
              <Button onClick={() => dispatch({ type: 'OPEN_MODAL' })} size="lg" className="shadow-lg shadow-brand-blue/20">
                <PlusIcon className="mr-2" /> Add Item
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Items" value={state.items.length} color="text-brand-blue" />
            <StatCard label="Avg Performance" value={(state.items.reduce((acc, i) => acc + (i.metrics['performance'] || 0), 0) / (state.items.length || 1)).toFixed(1)} color="text-status-success" />
            <StatCard label="Categories" value={new Set(state.items.map(i => i.category)).size} color="text-status-warning" />
            <StatCard label="Selected" value={state.selectedIds.length} color="text-brand-blueSec" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-30 bg-bg-primary/95 backdrop-blur-md py-4 border-b border-border/50 -mx-4 md:-mx-8 px-4 md:px-8">
          <div className="flex p-1 bg-bg-secondary rounded-lg border border-border">
            {(['all', 'enterprise', 'sme', 'startup'] as FilterOption[]).map(filter => (
              <button
                key={filter}
                onClick={() => dispatch({ type: 'SET_FILTER', payload: filter })}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${state.activeFilter === filter ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Sort by:</span>
            <div className="relative">
              <select 
                value={state.sortBy}
                onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value as SortOption })}
                className="appearance-none bg-bg-secondary border border-border rounded-lg pl-4 pr-10 py-2 text-sm text-text-primary focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
              >
                <option value="score">Overall Score</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-2.5 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={state.selectedIds.includes(item.id)}
              isExpanded={state.expandedId === item.id}
              onToggleSelect={() => dispatch({ type: 'TOGGLE_SELECT', payload: item.id })}
              onToggleExpand={() => dispatch({ type: 'SET_EXPANDED', payload: item.id })}
              onEdit={() => dispatch({ type: 'OPEN_MODAL', payload: item.id })}
              onDelete={() => dispatch({ type: 'DELETE_ITEM', payload: item.id })}
              style={{ animationDelay: `${index * 50}ms`, animationName: 'fadeInUp' }}
            />
          ))}
        </div>

        {/* Comparison Section */}
        {selectedItems.length > 0 && (
          <section id="comparison-section" className="pt-8">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                 <BarChartIcon className="text-brand-blue" /> Comparison Analysis
               </h2>
               <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}>
                 Clear Selection
               </Button>
             </div>
             <ComparisonTable 
                items={selectedItems} 
                onRemoveItem={(id) => dispatch({ type: 'TOGGLE_SELECT', payload: id })}
             />
          </section>
        )}

      </main>

      {/* Floating Action Bar */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform ${state.selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <button 
          onClick={handleScrollToCompare}
          className="flex items-center gap-3 bg-gradient-to-r from-brand-blueSec to-brand-blue pl-4 pr-6 py-3 rounded-full shadow-glow text-white font-medium hover:scale-105 transition-transform"
        >
          <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {state.selectedIds.length}
          </div>
          <span>Compare Selected Items</span>
          <ChevronDownIcon className="animate-bounce-slow" />
        </button>
      </div>

      {/* Data Entry Modal */}
      {state.isModalOpen && (
        <DataEntryForm
          initialData={activeEditItem}
          onSubmit={(item) => {
             if (activeEditItem) {
               dispatch({ type: 'UPDATE_ITEM', payload: { id: item.id, updates: item } });
             } else {
               dispatch({ type: 'ADD_ITEM', payload: item });
             }
          }}
          onCancel={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      )}

      {/* Data Migration Modal */}
      {state.isMigrationModalOpen && (
        <DataMigrationModal
          onImport={(items) => dispatch({ type: 'IMPORT_ITEMS', payload: items })}
          onClose={() => dispatch({ type: 'TOGGLE_MIGRATION_MODAL', payload: false })}
        />
      )}
    </div>
  );
};

// Helper Subcomponent
const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div className="bg-bg-secondary p-5 rounded-xl border border-border shadow-sm hover:shadow-card transition-shadow">
    <p className="text-sm text-text-muted mb-1">{label}</p>
    <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
  </div>
);