import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import Button from './Button';
import { FcGoogle } from 'react-icons/fc';
import { FiGithub, FiUser } from 'react-icons/fi';
import Label from './Label';
import Input from './Input';
import { MdOutlineEmail } from 'react-icons/md';
import { GoLock } from 'react-icons/go';

type SignInProps = React.DialogHTMLAttributes<HTMLDialogElement>;

export default function SignForm({ id, ...props }: SignInProps) {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  return (
    <dialog
      className="m-auto bg-background max-w-130 w-full backdrop:backdrop-blur-sm backdrop:bg-[rgba(0,0,0,0.4)]"
      id={id}
      {...props}
    >
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">
            {isSignIn ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isSignIn
              ? 'Sign in to continue reading and save articles'
              : 'Join thousands of curious readers and practitioners'}
          </p>
        </div>

        <button
          className="group cursor-pointer hover:bg-muted transition-colors duration-200 rounded-full"
          command="close"
          commandfor={id}
          aria-label="Close"
        >
          <IoIosClose className="text-3xl text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        </button>
      </div>

      <div className="p-6">
        <div className="bg-muted p-1 flex" data-testid="switch-container">
          <Button
            onClick={() => setIsSignIn(true)}
            intent={'secondary'}
            className={`border-none flex-1 ${isSignIn ? 'bg-background shadow-sm' : 'bg-transparent text-muted-foreground'}`}
          >
            Sign In
          </Button>
          <Button
            onClick={() => setIsSignIn(false)}
            intent={'secondary'}
            className={`border-none flex-1 ${!isSignIn ? 'bg-background shadow-sm' : 'bg-transparent text-muted-foreground'}`}
          >
            Sign Up
          </Button>
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
        {/* TODO: SWAP PLACEHOLDER FOR USERNAME AND EMAIL. THEY'RE MISMATCHED */}
        <form
          className="flex flex-col"
          aria-label="Sign form"
          onSubmit={(e) => e.preventDefault()}
        >
          {!isSignIn && (
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
                  placeholder="you@example.com"
                  className="placeholder:text-base"
                  name="username"
                />
              </div>
            </div>
          )}

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
                placeholder="johndoe"
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

              {isSignIn && (
                <a href="#" className="text-accent text-[12px] font-medium">
                  Forgot?
                </a>
              )}
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
            {isSignIn ? 'Sign In' : 'Create account'}
          </Button>

          <div className="m-auto mt-2">
            {isSignIn ? (
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
            ) : (
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
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
}
