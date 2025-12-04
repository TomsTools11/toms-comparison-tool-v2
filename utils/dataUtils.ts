
import { ComparisonItem, BadgeType } from '../types';

// Helper to clean strings for CSV
const safeString = (str: string | undefined) => {
  if (!str) return '';
  // Escape quotes and wrap in quotes if contains comma
  const escaped = str.replace(/"/g, '""');
  if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')) {
    return `"${escaped}"`;
  }
  return escaped;
};

// Flatten object for CSV export
const flattenItem = (item: ComparisonItem): Record<string, any> => {
  const flat: Record<string, any> = {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    accentColor: item.accentColor,
    idealFor: item.idealFor,
    badgeType: item.badge?.type || '',
    badgeText: item.badge?.text || '',
    highlights: item.highlights.join('|'), // Use pipe as array separator
    cons: item.cons.join('|'),
  };

  // Flatten Metrics
  Object.entries(item.metrics).forEach(([k, v]) => {
    flat[`metric_${k}`] = v;
  });

  // Flatten Features
  Object.entries(item.features).forEach(([k, v]) => {
    flat[`feature_${k}`] = v;
  });

  return flat;
};

export const exportToCSV = (items: ComparisonItem[]): string => {
  if (items.length === 0) return '';

  // Get all unique keys from all items to build headers
  const allKeys = new Set<string>();
  const flatItems = items.map(flattenItem);
  
  flatItems.forEach(item => {
    Object.keys(item).forEach(k => allKeys.add(k));
  });

  const headers = Array.from(allKeys).sort();
  
  const csvRows = [
    headers.join(','),
    ...flatItems.map(item => {
      return headers.map(header => safeString(String(item[header] ?? ''))).join(',');
    })
  ];

  return csvRows.join('\n');
};

export const parseCSV = (csvText: string): ComparisonItem[] => {
  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length < 2) return [];

  // Simple CSV parser (assumes headers are in first row)
  const headers = lines[0].split(',').map(h => h.trim());
  
  const result: ComparisonItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic split logic (Note: This is a simple implementation. 
    // Production app should use a robust parser like PapaParse to handle internal commas in quotes)
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));

    if (cleanValues.length === 0) continue;

    const row: Record<string, any> = {};
    headers.forEach((h, idx) => {
      row[h] = cleanValues[idx];
    });

    // Reconstruct nested object
    const newItem: ComparisonItem = {
      id: row.id || crypto.randomUUID(),
      name: row.name || 'Untitled',
      description: row.description || '',
      category: row.category || 'startup',
      accentColor: row.accentColor || '#407EC9',
      idealFor: row.idealFor,
      badge: row.badgeType ? { type: row.badgeType as BadgeType, text: row.badgeText } : undefined,
      highlights: row.highlights ? row.highlights.split('|') : [],
      cons: row.cons ? row.cons.split('|') : [],
      metrics: {},
      features: {}
    };

    Object.keys(row).forEach(key => {
      if (key.startsWith('metric_')) {
        const metricName = key.replace('metric_', '');
        newItem.metrics[metricName] = parseFloat(row[key]) || 0;
      } else if (key.startsWith('feature_')) {
        const featureName = key.replace('feature_', '');
        const val = row[key];
        if (val === 'true') newItem.features[featureName] = true;
        else if (val === 'false') newItem.features[featureName] = false;
        else if (val === 'partial') newItem.features[featureName] = 'partial';
      }
    });

    result.push(newItem);
  }

  return result;
};

export const downloadFile = (content: string, filename: string, type: 'csv' | 'json') => {
  const mimeType = type === 'json' ? 'application/json' : 'text/csv';
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
