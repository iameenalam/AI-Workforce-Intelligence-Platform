"use client";

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
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-indigo-600', activeBg: 'bg-indigo-50' },
        { id: 'employees', label: 'Employees', icon: Users, color: 'text-purple-500', activeBg: 'bg-purple-50' },
        { id: 'departments', label: 'Departments', icon: Building2, color: 'text-rose-500', activeBg: 'bg-rose-50' },
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
                            activeTab === item.id && !pageType ? `${item.activeBg} ${item.color}` : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
                        }`}
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="hidden md:inline">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto space-y-2">
                <a href="/chart">
                    <Button variant="ghost" className="w-full text-gray-600 hover:bg-slate-100 hover:text-gray-900 justify-center md:justify-start">
                        <ArrowLeft className="h-5 w-5 flex-shrink-0 mr-0 md:mr-2" />
                        <span className="hidden md:inline">Back to Chart</span>
                    </Button>
                </a>
                <button
                    onClick={() => handleNavClick('settings', false)}
                    title="Settings"
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm font-medium justify-center md:justify-start ${
                        activeTab === 'settings' ? `bg-slate-100 text-gray-800` : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
                    }`}
                >
                    <SettingsIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="hidden md:inline">Settings</span>
                </button>
            </div>
        </>
    );

    const mobileNavContent = () => (
        <div className="flex flex-col h-full bg-white text-gray-800">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-800">
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
                                activeTab === item.id && !pageType ? `${item.activeBg} ${item.color}` : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-lg font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 space-y-2 border-t border-slate-200">
                <button
                    onClick={() => handleNavClick('settings', true)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all duration-200 ${
                        activeTab === 'settings' ? 'bg-slate-100 text-gray-800' : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                    }`}
                >
                    <SettingsIcon className="h-6 w-6" />
                    <span className="text-lg font-medium">Settings</span>
                </button>
                <a href="/chart" className="w-full">
                    <Button variant="ghost" className="w-full flex items-center justify-start gap-4 p-4 text-lg font-medium text-gray-600 hover:bg-slate-100 hover:text-gray-900">
                        <ArrowLeft className="h-6 w-6" />
                        <span>Back to Chart</span>
                    </Button>
                </a>
            </div>
        </div>
    );

    return (
        <>
            <aside className="w-16 md:w-64 bg-white border-r border-slate-200 flex-col p-2 md:p-4 hidden sm:flex">
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
                            className="fixed inset-0 bg-black/60 z-40 sm:hidden"
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
