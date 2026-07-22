import { useState } from 'react';
import { IoBookOutline } from 'react-icons/io5';
import { LuMoon } from 'react-icons/lu';
import { NavLink } from 'react-router';

export default function Header() {
  const [isOpen, setIsOpen] = useState<true | false>(false);
  const handleOpenMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className="flex items-center justify-between p-4 overflow-hidden bg-background border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-black p-2">
            <IoBookOutline className="text-primary-foreground text-xl cursor-pointer" />
          </div>
          <h1 className="font-bold text-xl">The Codex</h1>
        </div>

        <div className="hidden md:flex md:gap-4 md:text-muted-foreground">
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
        </div>

        <div className="flex items-center gap-4">
          <button aria-label="Toggle theme">
            <LuMoon className="text-xl text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-75" />
          </button>

          <button
            className="md:hidden flex flex-col justify-between w-5 h-4 cursor-pointer"
            aria-label={!isOpen ? 'Open menu' : 'Close menu'}
            onClick={handleOpenMenu}
          >
            <span
              className={`w-full h-0.5 bg-muted-foreground transition-transform duration-300 ${isOpen ? 'translate-y-1.75 rotate-45' : ''}`}
            ></span>
            <span
              className={`w-full h-0.5 bg-muted-foreground transition-transform duration-300 ${isOpen ? 'translate-x-10' : ''}`}
            ></span>
            <span
              className={`w-full h-0.5 bg-muted-foreground transition-transform duration-300 ${isOpen ? '-translate-y-1.75 -rotate-45' : ''}`}
            ></span>
          </button>
        </div>
      </header>

      <nav
        className={`md:hidden bg-background h-0 overflow-hidden transition-all duration-200 ${isOpen ? 'h-auto' : ''}`}
        aria-hidden={!isOpen}
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

          <button
            tabIndex={!isOpen ? -1 : 0}
            className="bg-primary text-primary-foreground py-1 hover:bg-zinc-800 cursor-pointer transition-colors duration-200 outline-muted-foreground outline-offset-3 focus:bg-zinc-800"
          >
            Sign In
          </button>
        </div>
      </nav>
    </>
  );
}
