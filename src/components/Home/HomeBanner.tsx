import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

export const HomeBanner: React.FC = () => {
  const { config } = useSiteConfig();
  const banners = config.banners;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [banners.length]);

  if (banners.length === 0) {
    return <div className="h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">暂无轮播图</div>;
  }

  return (
    <div className="max-w-container mx-auto mt-0">
      <div className="relative h-[250px] md:h-[380px] w-full bg-gray-200 overflow-hidden group">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((src, index) => (
            <img
              key={index}
              src={src}
              className="w-full h-full object-cover flex-shrink-0"
              alt={`Slider ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === index ? 'bg-primary ring-2 ring-white scale-110' : 'bg-white/50 hover:bg-white'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
        >
          &#10094;
        </button>
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};