export const Hero = () => {
  return (
    <section className="relative min-h-[72svh] w-full overflow-hidden bg-secondary md:min-h-screen md:flex md:items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-contain md:object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/45 via-primary/20 to-primary/60" />
    </section>
  );
};
