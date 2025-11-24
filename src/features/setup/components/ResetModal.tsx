// src/features/setup/components/ResetModal.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    onCancel: () => void;
    onConfirm: () => void;
}

export const ResetModal: React.FC<Props> = ({ onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative bg-white dark:bg-gray-900 border border-red-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={24} /></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you absolutely sure?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action will <strong>permanently delete all existing tables</strong> in the database.</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 transition-colors">Yes, Delete</button>
            </div>
        </div>
    </div>
);