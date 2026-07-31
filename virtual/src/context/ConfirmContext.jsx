import React, { createContext, useCallback, useContext, useState } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);

  const confirm = useCallback(
    ({ title, message, tone = 'danger', confirmText = 'Confirm', cancelText = 'Cancel' }) =>
      new Promise((resolve) => {
        setRequest({ title, message, tone, confirmText, cancelText, resolve });
      }),
    []
  );

  const handle = (result) => {
    request?.resolve(result);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {request && (
        <div className="modal-overlay" onClick={() => handle(false)}>
          <div className="modal-panel" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800 }}>{request.title}</h2>
            <p style={{ color: 'var(--ink-500)', fontSize: 14.5, lineHeight: 1.6 }}>{request.message}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => handle(false)}>{request.cancelText}</button>
              <button
                className={`btn btn-sm ${request.tone === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => handle(true)}
              >
                {request.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
}
