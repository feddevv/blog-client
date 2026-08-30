import { useNavigate } from 'react-router';
import { useUser } from './useAuth';

export default function useAuthGuard() {
  const { data: user } = useUser();
  const navigate = useNavigate();

  function execute<TArgs extends unknown[], TReturn>(
    action: (...args: TArgs) => TReturn
  ) {
    return (...args: TArgs): TReturn | void => {
      if (!user) {
        navigate('/login');
        return;
      }

      return action(...args);
    };
  }

  return execute;
}
