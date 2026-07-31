import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);
let idCounter = 0;

const ICONS = { success: '✓', error: '✕', info: 'ℹ' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    (title, message, tone = 'info') => {
      const id = ++idCounter;
      setToasts((t) => [...t, { id, title, message, tone }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={toastStackStyle}>
        {toasts.map((t) => (
          <div key={t.id} className={`alert alert-${t.tone === 'info' ? 'info' : t.tone}`} style={toastStyle} onClick={() => dismiss(t.id)}>
            <span style={{ fontWeight: 800 }}>{ICONS[t.tone] || ICONS.info}</span>
            <div>
              <div style={{ fontWeight: 700 }}>{t.title}</div>
              {t.message && <div style={{ fontWeight: 400, opacity: 0.9 }}>{t.message}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const toastStackStyle = {
  position: 'fixed',
  top: 84,
  right: 24,
  zIndex: 200,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  width: 320,
  maxWidth: 'calc(100vw - 32px)',
};

const toastStyle = {
  margin: 0,
  cursor: 'pointer',
  boxShadow: 'var(--shadow-lg)',
  animation: 'toast-in 0.2s ease',
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
