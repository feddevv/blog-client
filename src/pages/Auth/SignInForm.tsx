import Label from '@/components/Label';
import Input from '@/components/Input';
import { GoLock } from 'react-icons/go';
import Button from '@/components/Button';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { signInSchema, type SignInRequest } from '@/types/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/components/ErrorMessage';
import { useLogin } from '@/hooks/useAuth';
import { FiGithub, FiUser } from 'react-icons/fi';
import type { AuthResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { FcGoogle } from 'react-icons/fc';
import { NavLink, useNavigate } from 'react-router';

export default function SignInForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending, error: apiError, isError } = useLogin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignInRequest> = (data) => {
    mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: (data: AuthResponse) => {
          localStorage.setItem('token', data.token);
          queryClient.invalidateQueries({ queryKey: ['user'] });
          navigate('/', { replace: true });
        },
      }
    );
  };

  return (
    <section className="p-4 m-auto bg-background max-w-130 w-full backdrop:backdrop-blur-sm backdrop:bg-[rgba(0,0,0,0.4)]">
      <div className="flex flex-col mb-4">
        <h2 className="font-heading font-bold text-xl text-primary">
          Welcome back
        </h2>
        <p className="text-xs text-muted-foreground">
          Sign in to continue reading and save articles
        </p>
      </div>

      <div className="bg-muted p-1 flex gap-2" data-testid="switch-container">
        <NavLink
          to="/login"
          className={
            'w-full flex items-center justify-center bg-background py-1 text-muted-foreground'
          }
        >
          Sign In
        </NavLink>
        <NavLink
          to="/register"
          className={
            'w-full flex items-center justify-center py-1 text-muted-foreground'
          }
        >
          Sign Up
        </NavLink>
      </div>
      <div className="flex gap-4 mt-4">
        <Button
          intent={'secondary'}
          size={'md'}
          className="bg-background flex-1 flex items-center gap-2 px-[clamp(1rem,2vw,2rem)]"
        >
          <FcGoogle />
          Google
        </Button>
        <Button
          intent={'secondary'}
          size={'md'}
          className="bg-background flex-1 flex items-center gap-2 px-[clamp(1rem,2vw,2rem)]"
        >
          <FiGithub />
          GitHub
        </Button>
      </div>
      <div className="h-[.7px] bg-border my-4 relative">
        <p className="text-sm text-muted-foreground absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-3">
          or
        </p>
      </div>

      <form
        className="flex flex-col"
        aria-label="Sign form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Label intent={'secondary'} size={'sm'} htmlFor="text">
            USERNAME
          </Label>
          <div className="bg-muted py-2 px-3 flex items-center gap-2 border border-border mt-1">
            <FiUser className="text-muted-foreground" />
            <Input
              type="text"
              id="text"
              intent={'unstyled'}
              placeholder="johndoe"
              className="placeholder:text-base"
              {...register('username')}
            />
          </div>
        </div>
        {errors.username ? (
          <ErrorMessage size={'sm'} className="mt-1">
            {errors.username.message}
          </ErrorMessage>
        ) : (
          isError && (
            <ErrorMessage size={'sm'} className="mt-1">
              {apiError.message}
            </ErrorMessage>
          )
        )}

        <div className="mt-2">
          <div className="flex items-center justify-between">
            <Label
              intent={'secondary'}
              size={'sm'}
              htmlFor="password"
              className="mt-1 flex items-center"
            >
              PASSWORD
            </Label>

            <a href="#" className="text-accent text-[12px] font-medium">
              Forgot?
            </a>
          </div>

          <div className="bg-muted py-2 px-3 flex items-center gap-2 border border-border mt-1">
            <GoLock className="text-muted-foreground" />
            <Input
              type="password"
              id="password"
              intent={'unstyled'}
              placeholder="••••••••"
              className="placeholder:text-base"
              {...register('password')}
            />
          </div>
        </div>
        {errors.password ? (
          <ErrorMessage size={'sm'} className="mt-1">
            {errors.password.message}
          </ErrorMessage>
        ) : (
          isError && (
            <ErrorMessage size={'sm'} className="mt-1">
              {apiError.message}
            </ErrorMessage>
          )
        )}

        <Button className="w-full mt-4" size={'md'} disabled={isPending}>
          Sign In
        </Button>

        <div className="m-auto mt-2">
          <p className="text-muted-foreground text-sm">
            No account?{' '}
            <NavLink
              to="/register"
              className={'text-accent font-medium cursor-pointer'}
            >
              Sign Up for free
            </NavLink>
          </p>
        </div>
      </form>
    </section>
  );
}
