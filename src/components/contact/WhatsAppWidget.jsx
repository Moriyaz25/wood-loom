"use client";
import { useState } from "react";
export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    "Hello! I want to know more about your handcrafted products.",
  );
  const number = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917452905405"
  ).replace(/\D/g, "");
  function send() {
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message + "\n\n" + window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-6 md:right-6">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
          <div className="flex items-center justify-between bg-[#075e54] px-5 py-4 text-white">
            <div>
              <p className="font-body text-sm font-semibold">WOODLOOM</p>
              <p className="font-body text-[11px] text-white/70">
                Typically replies within a few hours
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <div className="min-h-40 bg-[#efeae2] p-5">
            <div className="max-w-[85%] rounded-xl bg-white p-3 font-body text-sm text-walnut shadow-sm">
              Namaste 👋
              <br />
              How can we help with your product enquiry?
            </div>
          </div>
          <div className="flex gap-2 p-3">
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 resize-none rounded-2xl bg-gray-100 px-4 py-3 font-body text-sm outline-none"
            />
            <button
              onClick={send}
              className="h-11 w-11 rounded-full bg-[#128c7e] text-white"
            >
              ➤
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </button>
    </div>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="29" height="29" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 3a12 12 0 0 0-10.3 18.2L4 28l7-1.7A12 12 0 1 0 16 3Zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.1 1 1.1-4-.3-.4A9.7 9.7 0 1 1 16 24.8Zm5.3-7.2c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.2-.7.1-2.8-1.4-4.6-2.5-5.9-5.6-.1-.3 0-.5.1-.6l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 3s1.3 3.5 1.5 3.7c.2.2 2.5 3.9 6.2 5.4 2.3 1 3.2 1.1 4.4.9.7-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.4-.2-.7-.3Z" />
    </svg>
  );
}
