import React, { useRef, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import Button from '../Button';
import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';

type SignInProps = React.DialogHTMLAttributes<HTMLDialogElement>;

export default function AuthForm({ id, ...props }: SignInProps) {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeModal = () => dialogRef.current?.close();

  return (
    <dialog
      className="m-auto bg-background max-w-130 w-full backdrop:backdrop-blur-sm backdrop:bg-[rgba(0,0,0,0.4)]"
      id={id}
      {...props}
      ref={dialogRef}
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

        {isSignIn ? (
          <SignInForm setIsSignIn={setIsSignIn} closeModal={closeModal} />
        ) : (
          <RegisterForm setIsSignIn={setIsSignIn} />
        )}
      </div>
    </dialog>
  );
}
