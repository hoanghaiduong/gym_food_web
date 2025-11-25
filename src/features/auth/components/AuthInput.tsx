import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  type?: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ElementType;
  isDarkMode: boolean;
  isPasswordToggle?: boolean;
  error?: string;
  touched?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  icon: Icon,
  isDarkMode,
  isPasswordToggle = false,
  error,
  touched,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  const hasError = touched && error;

  return (
    <div className="mb-4 w-full">
      <div className="relative">
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full rounded-xl px-4 py-3.5 pl-11 text-sm font-medium outline-none transition-all border ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : isDarkMode
              ? 'bg-black/30 border-gray-700 text-white focus:border-[#84CC16] placeholder-gray-600'
              : 'bg-white border-gray-200 text-gray-900 focus:border-[#84CC16] placeholder-gray-400'
          }`}
          placeholder={placeholder}
        />
        
        {/* ICON TRÁI: Căn giữa tuyệt đối bằng top-1/2 -translate-y-1/2 */}
        {Icon && (
          <Icon
            size={20} // Tăng size nhẹ lên 20 cho cân đối với input to
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
              hasError ? 'text-red-500' : 'text-gray-400'
            }`}
          />
        )}

        {/* ICON MẮT (PHẢI): Cũng căn giữa tuyệt đối */}
        {isPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {hasError && (
        <div className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold animate-in slide-in-from-top-1 flex items-center gap-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default AuthInput;