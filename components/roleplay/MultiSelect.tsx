'use client';

import { useState } from 'react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onAddNew?: (value: string) => Promise<boolean>;
  showDefaultCheckbox?: boolean;
  defaultCheckboxLabel?: string;
  defaultCheckboxValue?: boolean;
  onDefaultCheckboxChange?: (checked: boolean) => void;
}

export default function MultiSelect({ label, options, selected, onChange, onAddNew, showDefaultCheckbox, defaultCheckboxLabel, defaultCheckboxValue, onDefaultCheckboxChange }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newValue, setNewValue] = useState('');

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleAddNew = async () => {
    if (!newValue.trim() || !onAddNew) return;
    
    const success = await onAddNew(newValue.trim());
    if (success) {
      setNewValue('');
      setIsAddingNew(false);
    }
  };

  const hasSelections = selected.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {hasSelections && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full bg-black p-1.5 text-white transition-transform hover:scale-110 dark:bg-white dark:text-black"
            >
              <svg
                className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-black">
          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-900"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option}
                </span>
              </label>
            ))}
            
            {onAddNew && (
              <div className="border-t border-gray-200 pt-2 dark:border-zinc-800">
                {isAddingNew ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Nuevo valor..."
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
                        autoFocus
                      />
                      <button
                        onClick={handleAddNew}
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingNew(false);
                          setNewValue('');
                        }}
                        className="rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 dark:bg-zinc-700 dark:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>
                    {showDefaultCheckbox && (
                      <label className="flex items-center gap-2 px-3 text-xs text-gray-500 dark:text-gray-400">
                        <input
                          type="checkbox"
                          checked={defaultCheckboxValue}
                          onChange={(e) => onDefaultCheckboxChange?.(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-black focus:ring-black dark:border-zinc-700 dark:bg-zinc-800"
                        />
                        {defaultCheckboxLabel}
                      </label>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar nuevo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-400 dark:hover:border-zinc-600"
        >
          {hasSelections ? (
            <span className="font-medium text-gray-900 dark:text-white">
              {selected.join(', ')}
            </span>
          ) : (
            'Seleccionar opciones...'
          )}
        </button>
      )}
    </div>
  );
}
