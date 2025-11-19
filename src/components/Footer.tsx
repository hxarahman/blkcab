import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">BLK CAB</h3>
            <p className="text-sm text-primary-foreground/80">
              Black Cab Coffee and People
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wide">EXPLORE</h4>
            <div className="flex flex-col gap-2">
              <Link to="/menu" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Menu
              </Link>
              <Link to="/locations" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Locations
              </Link>
              <Link to="/about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                About Us
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wide">CONNECT</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Instagram
              </a>
              <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Facebook
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wide">CONTACT</h4>
            <p className="text-sm text-primary-foreground/80">
              hello@blkcab.coffee
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2025 BLK Cab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
