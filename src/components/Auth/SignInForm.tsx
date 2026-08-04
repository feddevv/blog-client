import Label from '../Label';
import Input from '../Input';
import { MdOutlineEmail } from 'react-icons/md';
import { GoLock } from 'react-icons/go';
import Button from '../Button';
import type { Dispatch, SetStateAction } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { signInSchema, type SignInType } from '@/types/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '../ErrorMessage';

interface SignInFormProps {
  setIsSignIn: Dispatch<SetStateAction<boolean>>;
}

export default function SignInForm({ setIsSignIn }: SignInFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInType> = (data) => {
    console.log('Logged in');
  };

  return (
    <form
      className="flex flex-col"
      aria-label="Sign form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label intent={'secondary'} size={'sm'} htmlFor="email">
          EMAIL
        </Label>
        <div className="bg-muted py-2 px-3 flex items-center gap-2 border border-border mt-1">
          <MdOutlineEmail className="text-muted-foreground" />
          <Input
            type="email"
            id="email"
            intent={'unstyled'}
            placeholder="you@example.com"
            className="placeholder:text-base"
            {...register('email')}
          />
        </div>
      </div>
      {errors.email && (
        <ErrorMessage size={'sm'} className="mt-1">
          {errors.email.message}
        </ErrorMessage>
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
      {errors.password && (
        <ErrorMessage size={'sm'} className="mt-1">
          {errors.password.message}
        </ErrorMessage>
      )}

      <Button className="w-full mt-4" size={'md'}>
        Sign In
      </Button>

      <div className="m-auto mt-2">
        <p className="text-muted-foreground text-sm">
          No account?{' '}
          <button
            className="text-accent font-medium cursor-pointer"
            type="button"
            onClick={() => setIsSignIn(false)}
          >
            Sign up for free
          </button>
        </p>
      </div>
    </form>
  );
}
