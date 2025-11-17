'use client';

import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Buscar...",
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`group relative ${className}`}>
      {/* Efecto de brillo en hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      
      <div className="relative">
        {/* Ícono de búsqueda */}
        <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 transition-colors duration-200 ${
          isFocused ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        }`}>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-gray-200 bg-white py-3.5 pl-12 pr-12 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 placeholder:font-normal placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-zinc-600 dark:focus:ring-white/10"
        />

        {/* Botón de limpiar */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4 transition-all duration-200"
          >
            <div className="rounded-lg bg-gray-100 p-1.5 text-gray-500 transition-all hover:bg-gray-900 hover:text-white dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Línea decorativa inferior */}
      <div className={`absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-900 to-transparent transition-all duration-300 dark:via-white ${
        isFocused ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`} />
    </div>
  );
}
