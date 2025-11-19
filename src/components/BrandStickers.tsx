import stickerBrown from "@/assets/stickers-brown.png";
import stickerTagline from "@/assets/sticker-tagline.png";

export const BrandStickers = () => {
  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <img 
              src={stickerBrown} 
              alt="BLK CAB Coffee & People Est 2017" 
              className="w-64 md:w-80 h-auto"
            />
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <img 
              src={stickerTagline} 
              alt="Built for & around people and coffee" 
              className="w-64 md:w-80 h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
