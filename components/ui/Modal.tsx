'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative z-10 flex h-[92vh] w-full max-w-[95vw] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-zinc-800 dark:bg-black"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6 dark:border-zinc-800">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
              {title}
            </h2>
          )}
          
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-zinc-800 dark:bg-black dark:text-gray-400 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
            aria-label="Cerrar modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50 p-8 pb-16 dark:from-black dark:to-zinc-950">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
