
import React, { useRef, useState } from 'react';
import { ComparisonItem } from '../types';
import { parseCSV } from '../utils/dataUtils';
import { Button } from './ui/Primitives';
import { XIcon, UploadIcon, FileIcon, CheckIcon } from './ui/Icons';

interface DataMigrationModalProps {
  onImport: (items: ComparisonItem[]) => void;
  onClose: () => void;
}

export const DataMigrationModal: React.FC<DataMigrationModalProps> = ({ onImport, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setSuccessCount(null);

    const text = await file.text();
    let importedItems: ComparisonItem[] = [];

    try {
      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          importedItems = json; // Basic validation would happen here in prod
        } else if (json.items && Array.isArray(json.items)) {
          importedItems = json.items;
        } else {
          throw new Error('Invalid JSON structure. Expected an array of items.');
        }
      } else if (file.name.endsWith('.csv')) {
        importedItems = parseCSV(text);
      } else {
        throw new Error('Unsupported file type. Please upload .json or .csv');
      }

      if (importedItems.length === 0) {
        throw new Error('No valid items found in file.');
      }

      setSuccessCount(importedItems.length);
      // Small delay to show success state before closing/importing
      setTimeout(() => {
        onImport(importedItems);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-md rounded-xl shadow-2xl border border-border animate-fade-in-up overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-bg-primary">
          <h3 className="text-lg font-display font-bold text-text-primary">Import Data</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <XIcon />
          </button>
        </div>

        <div className="p-6">
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${dragActive ? 'border-brand-blue bg-brand-blue/5' : 'border-border hover:border-text-muted'}`}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={handleDrop}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json,.csv" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
            
            {successCount !== null ? (
              <div className="flex flex-col items-center animate-fade-in-up">
                <div className="w-12 h-12 rounded-full bg-status-success/20 flex items-center justify-center text-status-success mb-3">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <p className="text-text-primary font-medium">Found {successCount} items!</p>
                <p className="text-xs text-text-muted">Importing now...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted mb-3">
                  <UploadIcon className="w-6 h-6" />
                </div>
                <p className="text-text-primary font-medium mb-1">Drag & Drop file here</p>
                <p className="text-xs text-text-muted mb-4">Supports JSON or CSV</p>
                <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-status-error/10 border border-status-error/20 rounded-lg text-xs text-status-error flex items-start gap-2">
              <span className="mt-0.5">⚠️</span> {error}
            </div>
          )}

          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Example Templates</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-bg-elevated border border-border text-xs text-text-secondary">
                <FileIcon className="w-4 h-4 text-brand-blue" />
                <span>backup.json</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-bg-elevated border border-border text-xs text-text-secondary">
                <FileIcon className="w-4 h-4 text-status-success" />
                <span>data.csv</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
