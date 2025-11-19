import { Button } from "./ui/button";
import { Music } from "lucide-react";

export const SoundsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-6">
            <Music className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            BLK CAB® Sounds
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Music has always been part of the BLK CAB® identity and community. From the coffee we brew to the moments we share, our carefully curated playlists set the vibe.
          </p>
          
          <div className="pt-4">
            <a
              href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MjM0NTEwMDk0MjkwNjAw?igsh=YTNrb20yOHcxZzM0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="cta" size="lg" className="group">
                EXPLORE PLAYLISTS
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
