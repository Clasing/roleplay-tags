'use client';

import { useState, useMemo, useCallback } from 'react';
import { Roleplay } from '@/types/roleplay';

export function useRoleplaySearch(roleplays: Roleplay[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const filteredRoleplays = useMemo(() => {
    let filtered = roleplays;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((roleplay) =>
        roleplay.name.toLowerCase().includes(query)
      );
    }

    // Filter by language level
    if (selectedLevel) {
      filtered = filtered.filter((roleplay) =>
        roleplay.languageLevel?.toUpperCase() === selectedLevel.toUpperCase()
      );
    }

    return filtered;
  }, [roleplays, searchQuery, selectedLevel]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleLevelChange = useCallback((level: string) => {
    setSelectedLevel(level);
  }, []);

  return {
    searchQuery,
    selectedLevel,
    filteredRoleplays,
    handleSearch,
    handleLevelChange,
    totalCount: roleplays.length,
    filteredCount: filteredRoleplays.length,
  };
}
