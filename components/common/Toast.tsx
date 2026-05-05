import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastOptions {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Config per type ─────────────────────────────────────────────────────────

const CONFIG: Record<
  ToastType,
  { borderColor: string; Icon: React.ElementType; iconColor: string }
> = {
  success: {
    borderColor: 'border-l-green-500',
    Icon: CheckCircle2,
    iconColor: 'text-green-500',
  },
  error: {
    borderColor: 'border-l-red-500',
    Icon: XCircle,
    iconColor: 'text-red-500',
  },
  info: {
    borderColor: 'border-l-blue-500',
    Icon: Info,
    iconColor: 'text-blue-500',
  },
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

const DISMISS_AFTER_MS = 4000;

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const { borderColor, Icon, iconColor } = CONFIG[item.type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(item.id), DISMISS_AFTER_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-start gap-3 bg-white shadow-lg rounded-lg border-l-4 ${borderColor} p-4 w-80 pointer-events-auto`}
      role="alert"
      aria-live="assertive"
    >
      <Icon className={`mt-0.5 shrink-0 h-5 w-5 ${iconColor}`} />
      <p className="flex-1 text-sm text-gray-800 leading-snug">{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Stable counter for unique ids without useId (useId is per-render, not per-call)
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, ...options }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Portal-like fixed container */}
      <div
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}
