import React, { useState, useEffect } from 'react';
import { ComparisonItem } from '../types';
import { METRIC_LABELS, FEATURE_LABELS } from '../constants';
import { Button } from './ui/Primitives';
import { XIcon, PlusIcon } from './ui/Icons';

interface DataEntryFormProps {
  initialData?: ComparisonItem | null;
  onSubmit: (item: ComparisonItem) => void;
  onCancel: () => void;
}

const DEFAULT_ITEM: ComparisonItem = {
  id: '',
  name: '',
  description: '',
  category: 'startup',
  metrics: { performance: 3, reliability: 3, usability: 3, support: 3, pricing: 3 },
  features: { cloudSync: false, apiAccess: false, sso: false, mobileApp: false, aiAssistant: false },
  highlights: [],
  cons: [],
  accentColor: '#407EC9',
  badge: undefined
};

export const DataEntryForm: React.FC<DataEntryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ComparisonItem>(DEFAULT_ITEM);
  const [highlightInput, setHighlightInput] = useState('');
  const [conInput, setConInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ ...DEFAULT_ITEM, id: crypto.randomUUID() });
    }
  }, [initialData]);

  const handleChange = (field: keyof ComparisonItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMetricChange = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: { ...prev.metrics, [key]: parseFloat(value.toString()) }
    }));
  };

  const handleFeatureChange = (key: string, value: boolean | 'partial') => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [key]: value }
    }));
  };

  const addArrayItem = (field: 'highlights' | 'cons', value: string, setter: (s: string) => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
    setter('');
  };

  const removeArrayItem = (field: 'highlights' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-border animate-fade-in-up">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-bg-secondary border-b border-border">
          <h2 className="text-xl font-display font-bold text-text-primary">
            {initialData ? 'Edit Item' : 'Add New Comparison Item'}
          </h2>
          <button onClick={onCancel} className="text-text-muted hover:text-text-primary">
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary border-l-4 border-brand-blue pl-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Product Name"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="startup">Startup</option>
                  <option value="sme">SME</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-brand-blue outline-none h-20"
                placeholder="Short description..."
              />
            </div>
             <div>
              <label className="block text-sm text-text-muted mb-1">Ideal For</label>
              <input
                type="text"
                value={formData.idealFor || ''}
                onChange={e => handleChange('idealFor', e.target.value)}
                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="e.g. Large teams..."
              />
            </div>
          </section>

          {/* Metrics */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary border-l-4 border-status-success pl-3">Metrics (1-5)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {Object.entries(METRIC_LABELS).map(([key, label]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-text-muted">{label}</label>
                    <span className="text-sm font-bold text-text-primary">{formData.metrics[key] ?? 3}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.metrics[key] ?? 3}
                    onChange={e => handleMetricChange(key, parseFloat(e.target.value))}
                    className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary border-l-4 border-brand-blueSec pl-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg border border-border">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <select
                    value={formData.features[key] === 'partial' ? 'partial' : formData.features[key] ? 'true' : 'false'}
                    onChange={e => handleFeatureChange(key, e.target.value === 'partial' ? 'partial' : e.target.value === 'true')}
                    className="bg-bg-elevated text-xs rounded px-2 py-1 border border-border text-text-primary outline-none focus:border-brand-blue"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              ))}
            </div>
          </section>

          {/* Highlights & Cons */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">Highlights</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={e => setHighlightInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('highlights', highlightInput, setHighlightInput))}
                  className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-status-success"
                  placeholder="Add highlight..."
                />
                <button type="button" onClick={() => addArrayItem('highlights', highlightInput, setHighlightInput)} className="p-2 bg-bg-elevated rounded-lg hover:bg-bg-hover">
                  <PlusIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-status-success/10 text-status-success text-xs">
                    {item}
                    <button type="button" onClick={() => removeArrayItem('highlights', idx)} className="hover:text-white"><XIcon className="w-3 h-3"/></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">Drawbacks</label>
               <div className="flex gap-2">
                <input
                  type="text"
                  value={conInput}
                  onChange={e => setConInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('cons', conInput, setConInput))}
                  className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-status-error"
                  placeholder="Add drawback..."
                />
                <button type="button" onClick={() => addArrayItem('cons', conInput, setConInput)} className="p-2 bg-bg-elevated rounded-lg hover:bg-bg-hover">
                  <PlusIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cons.map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-status-error/10 text-status-error text-xs">
                    {item}
                    <button type="button" onClick={() => removeArrayItem('cons', idx)} className="hover:text-white"><XIcon className="w-3 h-3"/></button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="primary">Save Item</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
