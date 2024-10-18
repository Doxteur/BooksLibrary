import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

export const useAuth = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return { isAuthenticated };
};
