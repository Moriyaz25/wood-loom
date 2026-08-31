"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ConfirmDialogContext = createContext(null);

export function ConfirmDialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const cancelButtonRef = useRef(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        eyebrow: "Please confirm",
        title: "Are you sure?",
        description: "This action may change your store data.",
        confirmLabel: "Confirm",
        cancelLabel: "Keep it",
        tone: "danger",
        ...options,
      });
    });
  }, []);

  const close = useCallback((result) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setDialog(null);
  }, []);

  useEffect(() => {
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") close(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialog, close]);

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-6" role="presentation">
          <button type="button" aria-label="Close confirmation" onClick={() => close(false)} className="absolute inset-0 cursor-default bg-walnut-dark/55 backdrop-blur-[3px]" />
          <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-white/60 bg-[#fffaf4] shadow-[0_28px_90px_rgba(28,18,12,.35)]">
            <div className={`h-1.5 w-full ${dialog.tone === "danger" ? "bg-red-700" : "bg-sienna"}`} />
            <div className="p-6 sm:p-8">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${dialog.tone === "danger" ? "bg-red-50 text-red-700" : "bg-sienna/10 text-sienna"}`} aria-hidden="true">
                {dialog.tone === "danger" ? <TrashIcon /> : <InfoIcon />}
              </div>
              <p className="mt-6 font-data text-[10px] font-medium uppercase tracking-[.2em] text-sienna">{dialog.eyebrow}</p>
              <h2 id="confirm-dialog-title" className="mt-2 font-display text-3xl leading-tight text-walnut">{dialog.title}</h2>
              <p id="confirm-dialog-description" className="mt-3 font-body text-sm leading-6 text-walnut/62">{dialog.description}</p>
              {dialog.note && <p className="mt-4 rounded-xl border border-walnut/10 bg-sand/45 px-4 py-3 font-body text-xs leading-5 text-walnut/55">{dialog.note}</p>}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button ref={cancelButtonRef} type="button" onClick={() => close(false)} className="focus-ring rounded-full border border-walnut/15 bg-white px-6 py-3 font-body text-xs font-semibold uppercase tracking-[.12em] text-walnut transition hover:border-walnut">{dialog.cancelLabel}</button>
                <button type="button" onClick={() => close(true)} className={`focus-ring rounded-full px-6 py-3 font-body text-xs font-semibold uppercase tracking-[.12em] text-white shadow-lg transition ${dialog.tone === "danger" ? "bg-red-700 hover:bg-red-800" : "bg-walnut hover:bg-sienna"}`}>{dialog.confirmLabel}</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) throw new Error("useConfirmDialog must be used inside ConfirmDialogProvider");
  return context;
}

function TrashIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>;
}

function InfoIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7h.01" /></svg>;
}
