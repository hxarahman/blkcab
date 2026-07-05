import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";

const About = () => {
  return (
    <div className="min-h-screen">
      <Seo
        title="About — BLK CAB® Coffee & People, Est. 2017"
        description="Est. 2017, BLK CAB® is built for & around people & coffee — a brand with a conscience, strong UK culture and a relentless commitment to community."
        path="/about"
      />
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                About BLK CAB®
              </h1>
              <p className="text-xl md:text-2xl font-light">
                Mind the Cab, Est (2017)
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-16">
              {/* Core Values */}
              <div className="text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
                  Guided by a strong set of values
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  A brand with strong UK culture. A place built on compassion and ethics.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-card border border-border rounded-lg p-8 md:p-12 space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Aiming to influence society in both coffee and social responsibility
                </h3>
                <p className="text-xl text-muted-foreground">
                  A brand with a conscience: <span className="font-semibold text-foreground">( a brand that cares. )</span>
                </p>
              </div>

              {/* Culture */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-8 space-y-4">
                  <h3 className="text-2xl font-bold">A productive and fast-paced culture</h3>
                  <p className="text-lg text-muted-foreground">
                    A healthy work ethic.
                  </p>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-8 space-y-4">
                  <h3 className="text-2xl font-bold">Committed to society</h3>
                  <p className="text-lg text-muted-foreground font-semibold">
                    ( a place for people )
                  </p>
                </div>
              </div>

              {/* Commitment */}
              <div className="text-center py-12">
                <p className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
                  Our commitment is relentless.
                </p>
              </div>

              {/* Story Section */}
              <div className="prose prose-lg max-w-none space-y-6">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Since 2017, BLK CAB® has been more than just a coffee shop. We're a movement built 
                  for and around people and coffee. Every cup we serve, every conversation we host, 
                  and every community we build reflects our core belief that great coffee should bring 
                  people together.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our journey started with a simple vision: create spaces where quality coffee meets 
                  genuine human connection. Today, we continue to honor that vision by sourcing the 
                  finest beans, training passionate baristas, and fostering an environment where 
                  everyone feels welcome.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Built for & around (People & Coffee) isn't just our tagline—it's our promise to 
                  you and our commitment to the communities we serve.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
