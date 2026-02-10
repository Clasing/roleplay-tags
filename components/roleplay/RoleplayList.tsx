'use client';

import { useState } from 'react';
import { useRoleplaySearch } from '@/hooks/useRoleplaySearch';
import { useModal } from '@/hooks/useModal';
import SearchBar from '@/components/ui/SearchBar';
import LevelFilter from '@/components/ui/LevelFilter';
import RoleplayGrid from '@/components/roleplay/RoleplayGrid';
import Modal from '@/components/ui/Modal';
import RoleplayDetails from '@/components/roleplay/RoleplayDetails';
import TagAdminModal from '@/components/admin/TagAdminModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { ToastStack } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { Roleplay } from '@/types/roleplay';
import { deleteRoleplay } from '@/lib/api/skillsApi';

interface RoleplayListProps {
  roleplays: Roleplay[];
}

export default function RoleplayList({ roleplays: initialRoleplays }: RoleplayListProps) {
  const [roleplaysList, setRoleplaysList] = useState<Roleplay[]>(initialRoleplays);
  const { filteredRoleplays, handleSearch, handleLevelChange, selectedLevel, filteredCount, totalCount } = useRoleplaySearch(roleplaysList);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isAdminOpen, openModal: openAdmin, closeModal: closeAdmin } = useModal();
  const [selectedRoleplay, setSelectedRoleplay] = useState<Roleplay | null>(null);

  // Confirmation modal state
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [roleplayToDelete, setRoleplayToDelete] = useState<string | null>(null);

  // Toast notifications
  const { toasts, pushToast, dismiss } = useToast();

  const handleDelete = async (id: string) => {
    setRoleplayToDelete(id);
    setConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleplayToDelete) return;

    const success = await deleteRoleplay(roleplayToDelete);
    if (success) {
      setRoleplaysList((prev) => prev.filter((r) => (r._id || r.id) !== roleplayToDelete));
      pushToast('success', 'Roleplay eliminado correctamente');
    } else {
      pushToast('error', 'Error al eliminar el roleplay');
    }

    setRoleplayToDelete(null);
  };

  const handleViewDetails = (id: string) => {
    const sourceList = filteredRoleplays.length ? filteredRoleplays : roleplaysList;
    const roleplay = sourceList.find((r) => (r._id || r.id) === id);
    if (roleplay) {
      setSelectedRoleplay(roleplay);
      openModal();
    }
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedRoleplay(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 sm:max-w-md">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar por título..."
            />
          </div>
          <LevelFilter
            selectedLevel={selectedLevel}
            onLevelChange={handleLevelChange}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openAdmin}
            className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl active:scale-95"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>Administrar Tags</span>
          </button>

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
      </div>

      <RoleplayGrid
        roleplays={filteredRoleplays}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={selectedRoleplay?.name || 'Detalle del roleplay'}
      >
        {selectedRoleplay && (
          <RoleplayDetails
            key={selectedRoleplay._id || selectedRoleplay.id}
            roleplay={selectedRoleplay}
          />
        )}
      </Modal>

      <TagAdminModal
        isOpen={isAdminOpen}
        onClose={closeAdmin}
      />

      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmDelete}
        title="¿Estás seguro de que quieres eliminar este roleplay?"
        message="Esta acción no se puede deshacer."
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
