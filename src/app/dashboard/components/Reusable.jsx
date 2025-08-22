"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, Eye } from "lucide-react";

export const InputField = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400" 
        />
    </div>
);

export const SelectField = ({ label, name, value, onChange, children }) => (
    <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
        <select 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
            {children}
        </select>
    </div>
);

export const AddItemButton = ({ onClick, children }) => (
    <Button
        onClick={onClick}
        variant="outline"
        className="w-full justify-center py-2 px-4 rounded-lg border-2 border-dashed border-indigo-200 text-sm font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-colors flex items-center gap-2"
    >
        <PlusCircle size={16} />
        {children}
    </Button>
);

export const BackButton = ({ onClick }) => (
    <div className="mb-6">
        <button onClick={onClick} className="group inline-flex items-center text-gray-500 transition-colors hover:text-indigo-600 font-medium">
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back
        </button>
    </div>
);

export const ViewProfileButton = ({ onClick }) => (
    <Button onClick={onClick} variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700">
        <Eye className="h-4 w-4" />
    </Button>
);
