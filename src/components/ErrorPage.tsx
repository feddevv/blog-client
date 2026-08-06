import type { ApiError } from '@/types';
import { useNavigate, useRouteError } from 'react-router';
import Button from './Button';

function isApiError(object: any): object is ApiError {
  return object !== null && typeof object === 'object' && 'message' in object;
}

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  let message = 'Something went wrong';

  if (isApiError(error)) {
    message = error.message;
  }

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="m-auto w-full flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.75"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="text-sm text-card-foreground mb-8 leading-relaxed">
          {message}
        </h2>

        <Button
          onClick={handleGoHome}
          className="w-full"
          intent={'primary'}
          size={'md'}
        >
          Go home
        </Button>
      </div>
    </div>
  );
}
