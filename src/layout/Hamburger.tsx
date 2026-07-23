interface HamburgerProps {
  isOpen: boolean;
  handleOpenMenu: () => void;
}

export default function Hamburger({ isOpen, handleOpenMenu }: HamburgerProps) {
  return (
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
  );
}
