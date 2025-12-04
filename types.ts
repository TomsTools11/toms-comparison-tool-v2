
export type BadgeType = 'leader' | 'popular' | 'rising' | 'custom';

export interface ComparisonItem {
  id: string;
  name: string;
  description: string;
  badge?: {
    type: BadgeType;
    text: string;
  };
  // Metrics are scored 1-5
  metrics: Record<string, number>;
  // Features are boolean (true/false) or 'partial'
  features: Record<string, boolean | 'partial'>;
  highlights: string[];
  cons: string[];
  idealFor?: string;
  customFields?: Record<string, string | number>;
  accentColor: string;
  category: string;
}

export type FilterOption = 'all' | 'enterprise' | 'sme' | 'startup';
export type SortOption = 'score' | 'name' | 'popular';

export interface DashboardState {
  items: ComparisonItem[];
  selectedIds: string[];
  expandedId: string | null;
  activeFilter: FilterOption;
  sortBy: SortOption;
  isModalOpen: boolean;
  isMigrationModalOpen: boolean;
  editingItemId: string | null;
}

export type DashboardAction =
  | { type: 'ADD_ITEM'; payload: ComparisonItem }
  | { type: 'IMPORT_ITEMS'; payload: ComparisonItem[] }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<ComparisonItem> } }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'TOGGLE_SELECT'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_EXPANDED'; payload: string | null }
  | { type: 'SET_FILTER'; payload: FilterOption }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'OPEN_MODAL'; payload?: string } // Optional payload for editing
  | { type: 'CLOSE_MODAL' }
  | { type: 'TOGGLE_MIGRATION_MODAL'; payload: boolean };
