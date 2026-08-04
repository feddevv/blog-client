import Label from '../Label';
import Input from '../Input';
import { MdOutlineEmail } from 'react-icons/md';
import { GoLock } from 'react-icons/go';
import Button from '../Button';
import { FiUser } from 'react-icons/fi';
import { type Dispatch, type SetStateAction } from 'react';

interface RegisterProps {
  setIsSignIn: Dispatch<SetStateAction<boolean>>;
}

export default function RegisterForm({ setIsSignIn }: RegisterProps) {
  return (
    <form className="flex flex-col" aria-label="Sign form">
      <div className="mb-2">
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
          />
        </div>
      </div>

      <div className="mb-2">
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
            name="email"
          />
        </div>
      </div>

      <div>
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
            name="password"
          />
        </div>
      </div>

      <Button className="w-full mt-4" size={'md'}>
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
