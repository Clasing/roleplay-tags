import React from 'react';
import { ToastMessage } from '@/hooks/useToast';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const tone = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/40',
    text: 'text-green-900 dark:text-green-100',
    border: 'border-green-200 dark:border-green-800',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/40',
    text: 'text-red-900 dark:text-red-100',
    border: 'border-red-200 dark:border-red-800',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/40',
    text: 'text-blue-900 dark:text-blue-100',
    border: 'border-blue-200 dark:border-blue-800',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/40',
    text: 'text-amber-900 dark:text-amber-100',
    border: 'border-amber-200 dark:border-amber-800',
  },
};

export function ToastStack({ toasts, onDismiss }: ToastProps) {
  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
      {toasts.map((toast) => {
        const styles = tone[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${styles.bg} ${styles.text} ${styles.border}`}
          >
            <span className="mt-0.5 text-sm font-semibold capitalize">{toast.type}</span>
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              aria-label="Cerrar toast"
              onClick={() => onDismiss(toast.id)}
              className="rounded-md px-2 py-1 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastStack;
