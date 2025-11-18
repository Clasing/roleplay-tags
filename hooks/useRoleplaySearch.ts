'use client';

import { useState, useMemo, useCallback } from 'react';
import { Roleplay } from '@/types/roleplay';

export function useRoleplaySearch(roleplays: Roleplay[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoleplays = useMemo(() => {
    if (!searchQuery.trim()) {
      return roleplays;
    }

    const query = searchQuery.toLowerCase().trim();
    return roleplays.filter((roleplay) =>
      roleplay.name.toLowerCase().includes(query)
    );
  }, [roleplays, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    filteredRoleplays,
    handleSearch,
    totalCount: roleplays.length,
    filteredCount: filteredRoleplays.length,
  };
}
