import React, { useState } from "react";
import { Bot, X, Minus, MessageCircle } from "lucide-react";
import Chatbot from "./Chatbot";

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setResetKey((k) => k + 1);
    }, 400);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className={`fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl shadow-indigo-200/50 transition-all duration-300 ease-in-out
          ${isOpen ? "animate-chatbot-open" : "pointer-events-none opacity-0"}
          w-full max-w-full h-full bottom-0 right-0
          sm:rounded-2xl sm:border sm:border-slate-200 sm:w-[440px] sm:max-w-[90vw] sm:h-[clamp(480px,80vh,720px)] sm:bottom-6 sm:right-6`}
      >
        <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-indigo-600 px-5 py-3">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-indigo-600 bg-green-400" />
            </div>
            <div>
              <span className="text-base font-semibold text-white">ReeOrg AI</span>
              <p className="text-xs text-indigo-100">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleMinimize}
              className="rounded-full p-1.5 text-indigo-100 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Minimize Chat"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button
              onClick={handleClose}
              className="rounded-full p-1.5 text-indigo-100 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close and Reset Chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <Chatbot key={resetKey} userId="user-from-session-123" userIdentity="Logged-in User" />
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 group flex transform items-center gap-3 rounded-full bg-indigo-600 px-5 py-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-300/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="Open chatbot"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-12" />
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-green-400" />
          </div>
          <span className="hidden font-medium sm:inline">ReeOrg AI</span>
        </button>
      )}

      <style>{`
        @keyframes chatbotOpen {
          0% { 
            transform: translateY(20px) scale(0.98); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
        .animate-chatbot-open {
          animation: chatbotOpen 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
