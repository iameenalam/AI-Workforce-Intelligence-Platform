"use client";

import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
    return (
        <div className="p-4 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
                 <SettingsIcon className="h-8 w-8 text-slate-400" />
                 <div>
                    <h2 className="text-3xl font-bold text-white">Settings</h2>
                    <p className="text-slate-400">Manage your dashboard settings.</p>
                 </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 min-h-[calc(100vh-250px)] p-8 flex items-center justify-center">
                <div className="text-center text-slate-500">
                    <p>Settings page is under construction.</p>
                </div>
            </div>
        </div>
    );
}
