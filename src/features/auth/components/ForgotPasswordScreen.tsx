import React, { useEffect } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { useUI } from '@/core/contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppDispatch } from '@/redux/store';
import { resetError } from '@/features/auth/authSlice';
import AuthLayout from '@/components/layout/AuthLayout';
import AuthInput from '@/features/auth/components/AuthInput';

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập Email'),
});

const ForgotPasswordScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: ForgotSchema,
    onSubmit: async (values) => {
      // Giả lập API call
      await new Promise((r) => setTimeout(r, 1000));
      showToast('info', `Link reset đã gửi tới ${values.email}`);
      navigate('/login');
    },
  });

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive a recovery link."
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6 text-left">
        <AuthInput
          name="email"
          placeholder="Email Address"
          icon={Mail}
          isDarkMode={isDarkMode}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
        />

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
            formik.isSubmitting
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-transparent border-brand-lime text-brand-lime-dark dark:text-brand-lime hover:bg-brand-lime-bg hover:border-brand-lime-dark'
          }`}
        >
          {formik.isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;