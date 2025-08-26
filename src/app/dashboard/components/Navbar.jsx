"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Network, Menu, Bell } from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar({ onMenuClick }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useSelector((state) => state.user);

    const fetchNotifications = async () => {
        try {
            const token = Cookies.get("token");
            if (!token) return;

            const response = await fetch("/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationIds) => {
        try {
            const token = Cookies.get("token");
            if (!token) return;

            await fetch("/api/notifications", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notificationIds }),
            });

            fetchNotifications();
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = Cookies.get("token");
            if (!token) return;

            await fetch("/api/notifications", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ markAllAsRead: true }),
            });

            fetchNotifications();
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 5000);

            const handleRefreshNotifications = () => {
                fetchNotifications();
            };
            window.addEventListener('refreshNotifications', handleRefreshNotifications);

            return () => {
                clearInterval(interval);
                window.removeEventListener('refreshNotifications', handleRefreshNotifications);
            };
        }
    }, [user]);

    return (
        <header className="flex-shrink-0 bg-white border-b border-slate-200 z-30">
            <div className="flex items-center justify-between h-20 px-4 sm:px-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg flex items-center justify-center border border-indigo-200/30 flex-shrink-0">
                        <Network className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 truncate">Dashboard</h1>
                        <p className="text-xs text-gray-500">HR Management</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-md text-gray-600 hover:bg-slate-100 relative"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="fixed top-20 mt-2 left-4 right-4 sm:absolute sm:w-96 sm:top-auto sm:left-auto sm:right-0 sm:mt-2 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-sm text-indigo-600 hover:text-indigo-800"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.slice(0, 10).map((notification) => (
                                            <div
                                                key={notification._id}
                                                className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                                                    !notification.isRead ? 'bg-indigo-50' : ''
                                                }`}
                                                onClick={() => {
                                                    if (!notification.isRead) {
                                                        markAsRead([notification._id]);
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 text-sm">
                                                            {notification.title}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-gray-400 text-xs mt-2">
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {!notification.isRead && (
                                                        <div className="w-2 h-2 bg-indigo-600 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-md text-gray-600 hover:bg-slate-100 sm:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {showNotifications && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                />
            )}
        </header>
    );
}
