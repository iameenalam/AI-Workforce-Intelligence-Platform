"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Network, Menu } from "lucide-react";

export default function Navbar({ logoutHandler, onMenuClick }) {
    return (
        <header className="flex-shrink-0 bg-slate-900/30 border-b border-slate-700/50 z-30">
            <div className="flex items-center justify-between h-20 px-4 sm:px-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-lg flex items-center justify-center border border-sky-400/30 flex-shrink-0">
                        <Network className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white truncate">Dashboard</h1>
                        <p className="text-xs text-slate-400">HR Management</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" onClick={logoutHandler} className="hidden sm:flex items-center gap-2 text-slate-400 hover:bg-slate-700/50 hover:text-red-400">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </Button>
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-md text-white sm:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
