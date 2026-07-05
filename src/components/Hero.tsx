export const Hero = () => {
  return (
    <section className="relative min-h-[72svh] w-full overflow-hidden bg-primary md:min-h-screen md:flex md:items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/posters/hero-video-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-primary/10" />
    </section>
  );
};
