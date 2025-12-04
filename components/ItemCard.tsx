import React from 'react';
import { ComparisonItem } from '../types';
import { Badge, Button, RatingBar, FeatureIcon } from './ui/Primitives';
import { EditIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from './ui/Icons';
import { FEATURE_LABELS } from '../constants';

interface ItemCardProps {
  item: ComparisonItem;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  style
}) => {
  return (
    <div 
      className={`group relative flex flex-col bg-bg-secondary rounded-xl overflow-hidden transition-all duration-300 border ${isSelected ? 'border-brand-blue shadow-glow translate-y-[-4px]' : 'border-border hover:border-bg-hover hover:shadow-card hover:translate-y-[-4px]'}`}
      style={style}
    >
      {/* Accent Bar */}
      <div 
        className="h-1 w-full opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: item.accentColor }}
      />

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            {item.badge && (
              <Badge type={item.badge.type} className="mb-2">{item.badge.text}</Badge>
            )}
            <h3 className="text-xl font-display font-bold text-text-primary">{item.name}</h3>
          </div>
          <div className="relative">
             <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="appearance-none w-6 h-6 rounded-md border-2 border-border checked:bg-brand-blue checked:border-brand-blue transition-colors cursor-pointer"
            />
            {isSelected && (
              <svg className="absolute top-1 left-1 w-4 h-4 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </div>

        <p className="text-sm text-text-muted line-clamp-2 min-h-[2.5rem]">{item.description}</p>

        {/* Top 3 Metrics Preview */}
        <div className="space-y-3 pt-2">
          {Object.entries(item.metrics).slice(0, 3).map(([key, value]) => (
            <RatingBar key={key} label={key} value={value} />
          ))}
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2 pt-2">
          {item.highlights.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-1 rounded bg-bg-primary border border-border text-[10px] uppercase font-bold tracking-wider text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Section */}
      <div 
        className={`bg-bg-elevated overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] border-t border-border' : 'max-h-0'}`}
      >
        <div className="p-5 space-y-6">
          {/* Remaining Metrics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-muted uppercase">Additional Metrics</h4>
            {Object.entries(item.metrics).slice(3).map(([key, value]) => (
              <RatingBar key={key} label={key} value={value} />
            ))}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-text-muted uppercase">Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.features).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <FeatureIcon status={value} size={14} />
                  <span className={`text-xs ${value ? 'text-text-primary' : 'text-text-muted'}`}>
                    {FEATURE_LABELS[key] || key}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pros/Cons */}
          <div className="grid grid-cols-1 gap-4">
             {item.cons.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Drawbacks</h4>
                <ul className="space-y-1">
                  {item.cons.map((con, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                      <span className="text-status-error">•</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
             {item.idealFor && (
              <div className="bg-bg-primary p-3 rounded-lg border border-border">
                <h4 className="text-xs font-bold text-brand-blue uppercase mb-1">Best For</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{item.idealFor}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1 gap-2">
              <EditIcon className="w-4 h-4" /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={onDelete} className="flex-1 gap-2">
              <TrashIcon className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Expand Toggle Button */}
      <button 
        onClick={onToggleExpand}
        className="w-full py-2 flex items-center justify-center bg-bg-hover/50 hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors text-xs font-medium uppercase tracking-wide border-t border-border"
      >
        {isExpanded ? (
          <span className="flex items-center gap-1">Show Less <ChevronUpIcon className="w-4 h-4" /></span>
        ) : (
          <span className="flex items-center gap-1">View Details <ChevronDownIcon className="w-4 h-4" /></span>
        )}
      </button>
    </div>
  );
};
