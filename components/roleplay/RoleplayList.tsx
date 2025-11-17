'use client';

import { useState } from 'react';
import { useRoleplaySearch } from '@/hooks/useRoleplaySearch';
import { useModal } from '@/hooks/useModal';
import SearchBar from '@/components/ui/SearchBar';
import RoleplayGrid from '@/components/roleplay/RoleplayGrid';
import Modal from '@/components/ui/Modal';
import RoleplayDetails from '@/components/roleplay/RoleplayDetails';
import { Roleplay } from '@/types/roleplay';

interface RoleplayListProps {
  roleplays: Roleplay[];
}

export default function RoleplayList({ roleplays }: RoleplayListProps) {
  const { filteredRoleplays, handleSearch, filteredCount, totalCount } = useRoleplaySearch(roleplays);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedRoleplay, setSelectedRoleplay] = useState<Roleplay | null>(null);

  const handleViewDetails = (id: string) => {
    const roleplay = roleplays.find((r) => r._id === id);
    if (roleplay) {
      setSelectedRoleplay(roleplay);
      openModal();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-md">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar por título..."
          />
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredCount === totalCount ? (
            <span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> roleplay{totalCount !== 1 ? 's' : ''}
            </span>
          ) : (
            <span>
              <span className="font-semibold text-gray-900 dark:text-white">{filteredCount}</span> de{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> roleplay{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <RoleplayGrid
        roleplays={filteredRoleplays}
        onViewDetails={handleViewDetails}
      />

      {selectedRoleplay && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={selectedRoleplay.name}
        >
          <RoleplayDetails roleplay={selectedRoleplay} />
        </Modal>
      )}
    </div>
  );
}
