import React from "react";

export default function Popup({ open, onClose, children, width = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-2 sm:px-0">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`relative z-10 bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full ${width} max-h-[95vh] overflow-y-auto animate-popup`}
        style={{
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-3xl font-bold rounded-full bg-gray-100 hover:bg-red-100 w-10 h-10 flex items-center justify-center z-10 shadow"
          style={{ lineHeight: "1" }}
        >
          &times;
        </button>
        <div className="pt-4 sm:pt-0">{children}</div>
      </div>
    </div>
  );
}
