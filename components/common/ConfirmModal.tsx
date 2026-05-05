import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isDangerous?: boolean;
}

// ─── Focusable selectors ──────────────────────────────────────────────────────

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  isDangerous = true,
}: ConfirmModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    // Move focus into panel on open
    const firstFocusable = panel.querySelector<HTMLElement>(FOCUSABLE);
    firstFocusable?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (!panel) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  const confirmBtnClass = isDangerous
    ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    : 'bg-green-700 hover:bg-green-800 text-white focus:ring-green-500';

  return (
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          key="confirm-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50"
          onClick={onCancel}
          aria-hidden="true"
        >
          {/* Panel — stop click propagation so backdrop click doesn't fire inside */}
          <motion.div
            key="confirm-modal-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-message"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="confirm-modal-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              {title}
            </h2>
            <p id="confirm-modal-message" className="text-sm text-gray-600 mb-6">
              {message}
            </p>

            <div className="flex justify-end gap-3">
              {/* Cancel */}
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${confirmBtnClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
