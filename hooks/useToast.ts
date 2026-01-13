import { useCallback, useState } from 'react';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastKind;
  message: string;
}

// Minimal toast state manager with auto-dismiss
export function useToast(autoHideMs = 3200) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (type: ToastKind, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      if (autoHideMs > 0) {
        setTimeout(() => dismiss(id), autoHideMs);
      }
      return id;
    },
    [autoHideMs, dismiss]
  );

  return { toasts, pushToast, dismiss };
}
