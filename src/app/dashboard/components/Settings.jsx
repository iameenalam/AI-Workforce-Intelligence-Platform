"use client";

import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
    return (
        <div className="p-4 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                    <p className="text-slate-500">Manage your dashboard settings.</p>
                 </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-lg min-h-[calc(100vh-250px)] p-8 flex items-center justify-center">
                <div className="text-center text-slate-500">
                    <p>Settings page is under construction.</p>
                </div>
            </div>
        </div>
    );
}
