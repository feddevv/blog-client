import { useNavigate } from 'react-router';
import { useUser } from './useAuth';

export default function useAuthGuard() {
  const { data: user } = useUser();
  const navigate = useNavigate();

  function execute<T extends (...args: Parameters<T>) => ReturnType<T>>(
    action: T
  ) {
    return (...args: Parameters<T>) => {
      if (!user) return navigate('/login');

      action(...args);
    };
  }

  return execute;
}
