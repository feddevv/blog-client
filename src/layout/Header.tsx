import Button from '@/components/Button';
import { useState } from 'react';
import { IoBookOutline } from 'react-icons/io5';
import { LuLogOut, LuMoon, LuSun } from 'react-icons/lu';
import { NavLink } from 'react-router';
import Hamburger from './Hamburger';
import { useTheme } from '@/hooks/useTheme';
import { useLogout, useUser } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenMenu = () => setIsOpen(!isOpen);
  const { theme, setTheme } = useTheme();

  const { data: user } = useUser();
  const { mutate: logoutRequest } = useLogout();
  const queryClient = useQueryClient();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const logout = () => {
    localStorage.removeItem('token');

    logoutRequest();

    queryClient.resetQueries();
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between p-4 overflow-hidden bg-background border-b border-border fixed left-0 top-0 right-0 z-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2">
            <IoBookOutline className="text-primary-foreground text-xl cursor-pointer" />
          </div>
          <h1 className="font-bold text-xl text-primary">The Codex</h1>
        </div>

        <nav
          className="hidden md:flex md:gap-4 md:text-muted-foreground"
          aria-label="Main menu"
        >
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
          {user ? (
            <button
              onClick={logout}
              className="hidden md:inline"
              aria-label="Log out"
            >
              <LuLogOut className="text-xl text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-75" />
            </button>
          ) : (
            <NavLink
              to={'/login'}
              className="hidden md:inline bg-primary text-primary-foreground hover:bg-button-hover py-1 px-[clamp(1rem,2vw,1.5rem)] text-[clamp(14px,2vw,16px)]"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </header>

      <nav
        className={`md:hidden bg-background h-0 overflow-hidden transition-all duration-200 fixed z-100 top-16 left-0 right-0 border-b border-b-border ${isOpen ? 'h-auto' : ''}`}
        aria-hidden={!isOpen}
        id="menu-content"
        aria-label="Main menu"
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

          {user ? (
            <Button intent={'secondary'} className="group" onClick={logout}>
              <LuLogOut className="text-xl text-muted-foreground cursor-pointer group-hover:text-primary transition-colors duration-200" />
            </Button>
          ) : (
            <NavLink
              to={'/login'}
              className="text-center bg-primary text-primary-foreground hover:bg-button-hover py-1 px-[clamp(1rem,2vw,1.5rem)] text-[clamp(14px,2vw,16px)]"
              tabIndex={!isOpen ? -1 : 0}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
}
