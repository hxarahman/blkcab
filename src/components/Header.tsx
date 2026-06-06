import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import blkCabLogo from "@/assets/blk-cab-logo.png";
import blkCabSticker from "@/assets/blk-cab-sticker.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="BLK CAB Coffee & People — Home">
          <img src={blkCabLogo} alt="BLK CAB" className="h-5 md:h-7 w-auto" />
          <img src={blkCabSticker} alt="BC® (Coffee & People)" className="h-7 md:h-9 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/menu" className="text-sm font-medium hover:text-accent transition-colors">
            MENU
          </Link>
          <Link to="/locations" className="text-sm font-medium hover:text-accent transition-colors">
            LOCATIONS
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-accent transition-colors">
            ABOUT
          </Link>
          <Link to="/mind-the-cab" className="text-sm font-medium hover:text-accent transition-colors">
            GAME
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://blkcablondon.square.site/#most-popular" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex">
            <Button variant="cta">
              ORDER NOW
            </Button>
          </a>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/menu"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              MENU
            </Link>
            <Link
              to="/locations"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              LOCATIONS
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              to="/mind-the-cab"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              GAME
            </Link>
            <a href="https://blkcablondon.square.site/#most-popular" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="cta" className="w-full">
                ORDER NOW
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
