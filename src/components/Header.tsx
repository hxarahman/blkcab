import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-bold tracking-tight">BLK CAB®</span>
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
        </div>

        <div className="flex items-center gap-4">
          <Button variant="cta" className="hidden md:inline-flex">
            ORDER NOW
          </Button>
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
            <Button variant="cta" className="w-full">
              ORDER NOW
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
