import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    console.log('[Auth] Logging out...');
    
    // 1. Clear Storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('x-admin-key');
    
    // 2. Dispatch event (optional sync)
    window.dispatchEvent(new Event('auth-unauthorized'));

    // 3. Force Navigation
    navigate('/login', { replace: true });
    
  }, [navigate]);

  return { logout };
};