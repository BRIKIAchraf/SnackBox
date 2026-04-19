"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Info, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export type ToastType = "info" | "success" | "error" | "order";

interface ToastProps {
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

export const Toast = ({ id, message, type = "info", duration = 5000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        info: <Info className="w-5 h-5 text-blue-400" />,
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        order: <Bell className="w-5 h-5 text-amber-400" />,
    };

    const colors = {
        info: "bg-blue-500/10 border-blue-500/20",
        success: "bg-green-500/10 border-green-500/20",
        error: "bg-red-500/10 border-red-500/20",
        order: "bg-amber-500/10 border-amber-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${colors[type]} pointer-events-auto`}
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium text-white/90 pr-4">{message}</p>
            <button 
                onClick={() => onClose(id)}
                className="ml-auto text-white/40 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export const ToastContainer = ({ toasts, removeToast }: { toasts: any[], removeToast: (id: string) => void }) => {
    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast 
                        key={toast.id} 
                        {...toast} 
                        onClose={removeToast} 
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
