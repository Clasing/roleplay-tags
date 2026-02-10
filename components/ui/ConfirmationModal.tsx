'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = '¿Estás seguro?',
    message
}: ConfirmationModalProps) {
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

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 dark:bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div
                className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-zinc-800 dark:bg-black"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-zinc-800">
                    <h2 className="text-xl font-bold tracking-tight text-black dark:text-white">
                        {title}
                    </h2>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-gray-200 px-6 py-4 dark:border-zinc-800">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
