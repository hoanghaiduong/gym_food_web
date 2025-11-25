import React, { useEffect } from 'react';
import { Mail, User, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { useUI } from '@/core/contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppDispatch, RootState } from '@/redux/store';
import { registerUser, resetError } from '@/features/auth/authSlice';
import AuthLayout from '@/components/layout/AuthLayout';
import AuthInput from '@/features/auth/components/AuthInput';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập Email'),
  username: Yup.string().min(3, 'Username quá ngắn').required('Vui lòng nhập Username'),
  full_name: Yup.string().required('Vui lòng nhập tên đầy đủ'),
  password: Yup.string().min(6, 'Mật khẩu phải hơn 6 ký tự').required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

const RegisterScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { email: '', username: '', full_name: '', password: '', confirmPassword: '' },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        registerUser({
          username: values.username,
          email: values.email,
          full_name: values.full_name,
          password: values.password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        showToast('success', 'Đăng ký thành công! Hãy đăng nhập.');
        navigate('/login');
      } else {
        showToast('error', 'Đăng ký thất bại');
      }
    },
  });

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the workspace to start collaborating."
    >
      <form onSubmit={formik.handleSubmit} className="space-y-1 text-left">
        <AuthInput
          name="full_name"
          placeholder="Full Name"
          icon={User}
          isDarkMode={isDarkMode}
          value={formik.values.full_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.full_name}
          touched={formik.touched.full_name}
        />
        <AuthInput
          name="username"
          placeholder="Username"
          icon={User}
          isDarkMode={isDarkMode}
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.username}
          touched={formik.touched.username}
        />
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
        <AuthInput
          name="password"
          type="password"
          placeholder="Password"
          icon={Lock}
          isDarkMode={isDarkMode}
          isPasswordToggle
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />
        <AuthInput
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          icon={Lock}
          isDarkMode={isDarkMode}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-brand-lime hover:bg-brand-lime-dark hover:scale-[1.02]'
          }`}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full py-3 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1 mt-2"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterScreen;