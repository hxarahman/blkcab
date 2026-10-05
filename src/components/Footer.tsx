import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.jpeg";
import stickerBadge from "@/assets/sticker-badge.png";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          <div className="space-y-4">
            <img src={logoWhite} alt="BLK CAB" width={1280} height={640} loading="lazy" className="h-12 w-auto mb-3" />
            <img src={stickerBadge} alt="BC Coffee&People" width={528} height={112} loading="lazy" className="h-10 w-auto" />
            <p className="text-sm text-primary-foreground/80">
              BLK CAB® (Coffee&People)
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
              <a 
                href="https://www.instagram.com/blkcab.london" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://www.tiktok.com/@blkcablondon" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wide">CONTACT</h4>
            <p className="text-sm text-primary-foreground/80">
              info@blackapp.com
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2025 BLK CAB®. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
