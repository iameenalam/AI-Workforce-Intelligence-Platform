"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Building2, ArrowLeft, Settings as SettingsIcon, X } from "lucide-react";

export default function Sidebar({
    activeTab,
    pageType,
    setActiveTab,
    handleNavigate,
    isMobileMenuOpen,
    setIsMobileMenuOpen
}) {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-sky-400' },
        { id: 'employees', label: 'Employees', icon: Users, color: 'text-purple-400' },
        { id: 'departments', label: 'Departments', icon: Building2, color: 'text-rose-400' },
    ];

    const handleNavClick = (tabId, isMobile = false) => {
        setActiveTab(tabId);
        handleNavigate('');
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    const desktopNavContent = () => (
        <>
            <nav className="flex-1 space-y-2 pt-4">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id, false)}
                        title={item.label}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm font-medium justify-center md:justify-start ${
                            activeTab === item.id && !pageType ? `bg-gradient-to-r from-sky-500/20 to-indigo-500/20 ${item.color} shadow-lg shadow-black/20` : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                        }`}
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="hidden md:inline">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto space-y-2">
                <Link href="/chart">
                    <Button variant="ghost" className="w-full text-slate-400 hover:bg-slate-700/50 hover:text-white justify-center md:justify-start">
                        <ArrowLeft className="h-5 w-5 flex-shrink-0 mr-0 md:mr-2" />
                        <span className="hidden md:inline">Back to Chart</span>
                    </Button>
                </Link>
                <button
                    onClick={() => handleNavClick('settings', false)}
                    title="Settings"
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm font-medium justify-center md:justify-start ${
                        activeTab === 'settings' ? `bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-slate-300 shadow-lg shadow-black/20` : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    }`}
                >
                    <SettingsIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="hidden md:inline">Settings</span>
                </button>
            </div>
        </>
    );

    const mobileNavContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div className="flex flex-col justify-center flex-1 p-6">
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id, true)}
                            className={`flex items-center gap-4 p-4 rounded-lg text-left transition-all duration-200 ${
                                activeTab === item.id && !pageType ? `bg-slate-800 ${item.color}` : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                            }`}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-lg font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 space-y-2 border-t border-slate-700/50">
                <button
                    onClick={() => handleNavClick('settings', true)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all duration-200 ${
                        activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                >
                    <SettingsIcon className="h-6 w-6" />
                    <span className="text-lg font-medium">Settings</span>
                </button>
                <Link href="/chart" className="w-full">
                    <Button variant="ghost" className="w-full flex items-center justify-start gap-4 p-4 text-lg font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                        <span>Back to Chart</span>
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            <aside className="w-16 md:w-64 bg-slate-900/30 border-r border-slate-700/50 flex-col p-2 md:p-4 hidden sm:flex">
                {desktopNavContent()}
            </aside>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/70 z-40 sm:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 sm:hidden"
                        >
                            {mobileNavContent()}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
