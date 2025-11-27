import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Xóa", 
  cancelText = "Hủy",
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    // Overlay backdrop
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Content */}
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700 transform scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Ngăn click xuyên qua
      >
        <div className="flex flex-col items-center text-center gap-3">
          {/* Icon cảnh báo */}
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-2">
            <AlertCircle size={24} />
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full mt-5">
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            
            <button 
              onClick={onConfirm} 
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading ? 'Đang xử lý...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;