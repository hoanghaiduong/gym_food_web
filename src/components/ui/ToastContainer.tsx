import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUI, ToastMessage } from '@/core/contexts/UIContext';

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={20} className="text-[#84CC16]" />, // Lime
          border: 'border-[#84CC16]/30',
          bg: 'bg-[#84CC16]/10',
          glow: 'shadow-[0_0_20px_-5px_rgba(132,204,22,0.3)]'
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} className="text-red-500" />,
          border: 'border-red-500/30',
          bg: 'bg-red-500/10',
          glow: 'shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} className="text-yellow-500" />,
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-500/10',
          glow: 'shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)]'
        };
      case 'info':
      default:
        return {
          icon: <Info size={20} className="text-blue-500" />,
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/10',
          glow: 'shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]'
        };
    }
  };

  const styles = getStyles();

  return (
    <div 
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} ${styles.glow}
        backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-2xl transition-all duration-300 animate-in slide-in-from-right-full fade-in
        flex items-start gap-3 p-4 mb-3
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {styles.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight capitalize">
          {toast.type}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed font-medium">
          {toast.message}
        </p>
      </div>
      <button 
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useUI();

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col items-end w-full max-w-sm pointer-events-none p-4 md:p-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

export default ToastContainer;