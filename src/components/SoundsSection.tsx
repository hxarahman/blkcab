import { Button } from "./ui/button";


export const SoundsSection = () => {
  return (
    <section className="bg-background">
      {/* Hero Video */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/sounds-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center space-y-5 px-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-foreground">
              BLK CAB® Sounds
            </h2>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
              Music has always been part of the BLK CAB® identity and community. From the coffee we brew to the moments we share, our carefully curated playlists set the vibe.
            </p>
            
            <div className="pt-4">
              <a
                href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MjM0NTEwMDk0MjkwNjAw?igsh=YTNrb20yOHcxZzM0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="lg" className="group">
                  EXPLORE PLAYLISTS
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
