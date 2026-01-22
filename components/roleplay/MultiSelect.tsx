'use client';

import { useState } from 'react';

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onAddNew?: (value: string) => Promise<boolean>;
  showDefaultCheckbox?: boolean;
  defaultCheckboxLabel?: string;
  defaultCheckboxValue?: boolean;
  onDefaultCheckboxChange?: (checked: boolean) => void;
  singleSelect?: boolean;
}

export default function MultiSelect({ label, options, selected, onChange, onAddNew, showDefaultCheckbox, defaultCheckboxLabel, defaultCheckboxValue, onDefaultCheckboxChange, singleSelect }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const optionLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    options.forEach((option) => {
      map.set(option.value, option.label);
    });
    return map;
  }, [options]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOption = (optionValue: string) => {
    if (singleSelect) {
      // En modo single-select, solo permite seleccionar uno y cierra automáticamente
      onChange(selected.includes(optionValue) ? [] : [optionValue]);
      setIsOpen(false);
    } else {
      // En modo multi-select, permite múltiples selecciones
      if (selected.includes(optionValue)) {
        onChange(selected.filter(item => item !== optionValue));
      } else {
        onChange([...selected, optionValue]);
      }
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
        >
          {isOpen ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>Cerrar</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>Abrir</span>
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {/* Barra de búsqueda */}
          <div className="border-b border-gray-200 p-3 dark:border-zinc-800">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {filteredOptions.length > 0 && (
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="space-y-0.5">
                {singleSelect ? (
                  // Modo single-select: usar botones simples sin checkboxes
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleOption(option.value)}
                      className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                        selected.includes(option.value)
                          ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100'
                          : 'hover:bg-gray-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <span className={`text-sm font-medium ${selected.includes(option.value) ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {option.label}
                      </span>
                      {selected.includes(option.value) && (
                        <svg
                          className="ml-auto h-4 w-4 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))
                ) : (
                  // Modo multi-select: usar checkboxes
                  filteredOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                        selected.includes(option.value)
                          ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100'
                          : 'hover:bg-gray-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(option.value)}
                          onChange={() => toggleOption(option.value)}
                          className="h-4 w-4 cursor-pointer rounded border-2 border-gray-300 text-blue-600 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:border-zinc-600 dark:bg-zinc-800"
                        />
                        {selected.includes(option.value) && (
                          <svg
                            className="pointer-events-none absolute left-0.5 h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${selected.includes(option.value) ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {option.label}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {filteredOptions.length === 0 && (
            <div className="px-4 py-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                No se encontraron resultados
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Intenta con otro término de búsqueda
              </p>
            </div>
          )}
          
          {onAddNew && (
            <div className="border-t border-gray-200 p-2 dark:border-zinc-800">
              {isAddingNew ? (
                <div className="space-y-2.5 p-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Escribe el nuevo valor..."
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
                      autoFocus
                    />
                    <button
                      onClick={handleAddNew}
                      className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95"
                      title="Guardar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingNew(false);
                        setNewValue('');
                      }}
                      className="flex items-center justify-center rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-300 active:scale-95 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                      title="Cancelar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {showDefaultCheckbox && (
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5 transition-colors hover:bg-gray-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
                      <input
                        type="checkbox"
                        checked={defaultCheckboxValue}
                        onChange={(e) => onDefaultCheckboxChange?.(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-2 border-gray-300 text-blue-600 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:border-zinc-600 dark:bg-zinc-800"
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {defaultCheckboxLabel}
                      </span>
                    </label>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md active:scale-98"
                >
                  <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Agregar nuevo</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-3 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 dark:hover:border-blue-800"
        >
          {hasSelections ? (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-900 dark:bg-blue-950/50 dark:text-blue-100"
                >
                  {optionLabelMap.get(item) ?? item}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Haz clic para seleccionar
            </span>
          )}
        </button>
      )}
    </div>
  );
}
