import Label from '@/components/Label';
import Input from '@/components/Input';
import { MdOutlineEmail } from 'react-icons/md';
import { GoLock } from 'react-icons/go';
import Button from '@/components/Button';
import { FiUser } from 'react-icons/fi';
import { type Dispatch, type SetStateAction } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { registerSchema, type RegisterType } from '@/types/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/components/ErrorMessage';
import { useRegister } from '@/hooks/useAuth';

interface RegisterProps {
  setIsSignIn: Dispatch<SetStateAction<boolean>>;
}

export default function RegisterForm({ setIsSignIn }: RegisterProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useRegister();

  const onSubmit: SubmitHandler<RegisterType> = (data) => {
    mutate(
      {
        email: data.email,
        password: data.password,
        username: data.username,
      },
      {
        onSuccess: () => {
          alert("You're successfully registered!");
          setIsSignIn(true);
        },
      }
    );
  };

  return (
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
      {errors.username && (
        <ErrorMessage size={'sm'} className="mt-1">
          {errors.username.message}
        </ErrorMessage>
      )}

      <div className="mt-2">
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

      <Button className="w-full mt-4" size={'md'} disabled={isPending}>
        Create account
      </Button>

      <div className="m-auto mt-2">
        <p className="text-muted-foreground text-sm">
          Already have one?{' '}
          <button
            className="text-accent font-medium cursor-pointer"
            type="button"
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
}
