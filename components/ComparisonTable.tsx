import React from 'react';
import { ComparisonItem } from '../types';
import { METRIC_LABELS, FEATURE_LABELS } from '../constants';
import { FeatureIcon, Badge } from './ui/Primitives';
import { XIcon } from './ui/Icons';

interface ComparisonTableProps {
  items: ComparisonItem[];
  onRemoveItem: (id: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ items, onRemoveItem }) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full bg-bg-secondary rounded-xl border border-border overflow-hidden shadow-elevated animate-fade-in-up">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-48 bg-bg-elevated p-4 border-b border-r border-border shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Feature / Metric</span>
              </th>
              {items.map(item => (
                <th key={item.id} className="min-w-[240px] p-4 bg-bg-secondary border-b border-border border-r last:border-r-0 border-border/50 relative group">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                       <div className="h-1 w-8 rounded-full" style={{ backgroundColor: item.accentColor }} />
                       <button onClick={() => onRemoveItem(item.id)} className="text-text-muted hover:text-status-error opacity-0 group-hover:opacity-100 transition-opacity">
                         <XIcon />
                       </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-text-primary">{item.name}</h3>
                      {item.badge && <Badge type={item.badge.type} className="mt-1 scale-90 origin-left">{item.badge.text}</Badge>}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Metrics Section */}
            <tr className="bg-bg-elevated/30">
              <td className="sticky left-0 bg-bg-elevated p-3 text-xs font-bold text-brand-blue uppercase tracking-wider border-r border-border">Performance & Scoring</td>
              <td colSpan={items.length} className="bg-bg-secondary/50"></td>
            </tr>
            {Object.keys(METRIC_LABELS).map(key => (
              <tr key={key} className="hover:bg-bg-hover/30 transition-colors">
                <td className="sticky left-0 bg-bg-secondary p-4 text-sm font-medium text-text-secondary border-r border-border shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">
                  {METRIC_LABELS[key]}
                </td>
                {items.map(item => {
                  const val = item.metrics[key] || 0;
                  let colorClass = 'text-status-error';
                  if (val >= 4.5) colorClass = 'text-status-success';
                  else if (val >= 3.5) colorClass = 'text-brand-blue';
                  else if (val >= 2.5) colorClass = 'text-status-warning';

                  return (
                    <td key={item.id} className="p-4 border-r border-border/50 last:border-r-0">
                      <div className="flex items-center gap-3">
                         <span className={`text-lg font-bold ${colorClass}`}>{val}</span>
                         <div className="flex-1 h-1.5 bg-bg-primary rounded-full overflow-hidden max-w-[100px]">
                           <div className={`h-full ${colorClass.replace('text-', 'bg-')}`} style={{ width: `${(val / 5) * 100}%` }}></div>
                         </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Features Section */}
            <tr className="bg-bg-elevated/30">
              <td className="sticky left-0 bg-bg-elevated p-3 text-xs font-bold text-brand-blue uppercase tracking-wider border-r border-border">Features</td>
              <td colSpan={items.length} className="bg-bg-secondary/50"></td>
            </tr>
             {Object.keys(FEATURE_LABELS).map(key => (
              <tr key={key} className="hover:bg-bg-hover/30 transition-colors">
                <td className="sticky left-0 bg-bg-secondary p-4 text-sm font-medium text-text-secondary border-r border-border shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">
                  {FEATURE_LABELS[key]}
                </td>
                 {items.map(item => (
                    <td key={item.id} className="p-4 border-r border-border/50 last:border-r-0">
                      <div className="flex justify-start">
                        <FeatureIcon status={item.features[key]} />
                      </div>
                    </td>
                 ))}
              </tr>
             ))}
             
             {/* Highlights */}
             <tr className="bg-bg-elevated/30">
              <td className="sticky left-0 bg-bg-elevated p-3 text-xs font-bold text-brand-blue uppercase tracking-wider border-r border-border">Key Highlights</td>
              <td colSpan={items.length} className="bg-bg-secondary/50"></td>
            </tr>
            <tr>
              <td className="sticky left-0 bg-bg-secondary p-4 text-sm font-medium text-text-secondary border-r border-border shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]">
                Strengths
              </td>
               {items.map(item => (
                  <td key={item.id} className="p-4 border-r border-border/50 last:border-r-0 align-top">
                    <ul className="space-y-1">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                          <span className="text-status-success mt-0.5">✓</span> {h}
                        </li>
                      ))}
                    </ul>
                  </td>
               ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
