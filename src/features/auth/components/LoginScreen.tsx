import React, { useEffect } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { useUI } from '@/core/contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppDispatch, RootState } from '@/redux/store';
import { loginUser, resetError } from '@/features/auth/authSlice';
import AuthLayout from '@/components/layout/AuthLayout';
import AuthInput from '@/features/auth/components/AuthInput';
const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Vui lòng nhập Email hoặc Username'),
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
});

const LoginScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        loginUser({
          username: values.email,
          password: values.password,
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        showToast('success', 'Đăng nhập thành công!');
        navigate('/dashboard', { replace: true });
      } else {
        showToast('error', 'Đăng nhập thất bại');
      }
    },
  });

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to access your dashboard."
    >
      <form onSubmit={formik.handleSubmit} className="space-y-2 text-left">
        <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Email / Username
        </label>
        <AuthInput
          name="email"
          placeholder="admin@example.com"
          icon={Mail}
          isDarkMode={isDarkMode}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
        />

        <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Password
        </label>
        <AuthInput
          name="password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          isDarkMode={isDarkMode}
          isPasswordToggle
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

        <div className="flex justify-between items-center text-xs mt-2 mb-6 px-1">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-bold text-gray-500 hover:text-brand-lime dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="font-bold text-brand-lime-dark dark:text-brand-lime hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-brand-lime hover:bg-brand-lime-dark hover:scale-[1.02]'
          }`}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginScreen;