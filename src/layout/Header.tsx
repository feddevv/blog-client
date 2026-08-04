import Button from '@/components/Button';
import { useState } from 'react';
import { IoBookOutline } from 'react-icons/io5';
import { LuMoon, LuSun } from 'react-icons/lu';
import { NavLink } from 'react-router';
import Hamburger from './Hamburger';
import { useTheme } from '@/hooks/useTheme';
import SignForm from '@/components/Auth/AuthForm';

export default function Header() {
  const [isOpen, setIsOpen] = useState<true | false>(false);
  const handleOpenMenu = () => setIsOpen(!isOpen);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return (
    <>
      <header className="h-16 flex items-center justify-between p-4 overflow-hidden bg-background border-b border-border fixed left-0 top-0 right-0 z-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2">
            <IoBookOutline className="text-primary-foreground text-xl cursor-pointer" />
          </div>
          <h1 className="font-bold text-xl text-primary">The Codex</h1>
        </div>

        <nav className="hidden md:flex md:gap-4 md:text-muted-foreground">
          <NavLink
            to={'/'}
            className={(state) =>
              `${state.isActive ? 'text-accent' : 'text-muted-foreground'} hover:text-accent`
            }
          >
            Home
          </NavLink>
          <NavLink
            to={'/about'}
            className={(state) =>
              `${state.isActive ? 'text-accent' : 'text-muted-foreground'} hover:text-accent`
            }
          >
            About
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Toggle theme" onClick={toggleTheme}>
            {theme === 'light' ? (
              <LuMoon className="text-xl text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-75" />
            ) : (
              <LuSun className="text-xl text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-75" />
            )}
          </button>

          <Hamburger
            isOpen={isOpen}
            handleOpenMenu={handleOpenMenu}
            controlsId={'menu-content'}
          />
          <Button
            command="show-modal"
            commandfor="account-modal"
            intent={'primary'}
            size={'sm'}
            className="hidden md:inline"
          >
            Sign In
          </Button>
        </div>
      </header>

      <nav
        className={`md:hidden bg-background h-0 overflow-hidden transition-all duration-200 fixed z-100 top-16 left-0 right-0 border-b border-b-border ${isOpen ? 'h-auto' : ''}`}
        aria-hidden={!isOpen}
        id="menu-content"
      >
        <div className="flex flex-col p-4 gap-4">
          <NavLink
            className={(state) =>
              `${state.isActive ? 'text-accent' : 'text-muted-foreground'} border-b border-border p-1`
            }
            tabIndex={!isOpen ? -1 : 0}

            to={'/'}
          >
            Home
          </NavLink>
          <NavLink
            className={(state) =>
              `${state.isActive ? 'text-accent' : 'text-muted-foreground'} border-b border-border p-1`
            }
            tabIndex={!isOpen ? -1 : 0}

            to={'/about'}
          >
            About
          </NavLink>

          <Button
            command="show-modal"
            commandfor="account-modal"
            tabIndex={!isOpen ? -1 : 0}
            intent={'primary'}
            size={'sm'}
          >
            Sign In
          </Button>
        </div>
      </nav>

      <SignForm id="account-modal" closedby="any" />
    </>
  );
}
