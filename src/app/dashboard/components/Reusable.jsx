"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, Eye } from "lucide-react";

export const InputField = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label className="text-sm font-medium text-slate-300 block mb-1.5">{label}</label>
        <input type={type} name={name} value={value || ''} onChange={onChange} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors" />
    </div>
);

export const SelectField = ({ label, name, value, onChange, children }) => (
    <div>
        <label className="text-sm font-medium text-slate-300 block mb-1.5">{label}</label>
        <select name={name} value={value || ''} onChange={onChange} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors">
            {children}
        </select>
    </div>
);

export const AddItemButton = ({ onClick, children }) => (
    <Button
        onClick={onClick}
        variant="outline"
        className="w-full justify-center py-2 px-4 rounded-full border-0 text-sm font-semibold bg-sky-900/50 text-sky-300 hover:bg-sky-900 transition-colors flex items-center gap-2"
    >
        <PlusCircle size={16} />
        {children}
    </Button>
);

export const BackButton = ({ onClick }) => (
    <div className="mb-6">
        <button onClick={onClick} className="group inline-flex items-center text-slate-400 transition-colors hover:text-sky-300 font-medium">
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back
        </button>
    </div>
);

export const ViewProfileButton = ({ onClick }) => (
    <Button onClick={onClick} variant="ghost" size="sm" className="text-sky-400 hover:bg-sky-900/50 hover:text-sky-300">
        <Eye className="h-4 w-4" />
    </Button>
);
