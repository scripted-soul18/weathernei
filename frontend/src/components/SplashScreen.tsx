import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full min-h-full flex-1 flex flex-col justify-between items-center selection:bg-blue-600 selection:text-white overflow-hidden bg-[#030712]">
      {/* 1. Photorealistic Night Satellite View of India */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.2) 0%, rgba(3, 7, 18, 0.4) 40%, rgba(3, 7, 18, 0.85) 100%), url('/india_night_map.jpg')`
        }}
      />

      {/* Subtle Starfield & Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Red Location Pin on Map matching Image 1 */}
      <div className="absolute top-[42%] right-[22%] z-10 flex flex-col items-center pointer-events-none animate-bounce">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-rose-600/40 animate-ping absolute inset-0" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 border-2 border-white shadow-[0_0_15px_rgba(225,29,72,0.8)] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Top Spacer */}
      <div className="pt-12 z-10" />

      {/* 2. Center Branding: "BHARAT नेत्र" matching Image 1 */}
      <div className="relative z-10 text-center space-y-2 px-4 my-auto select-none">
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-widest drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] uppercase font-sans">
          BHARAT
        </h1>
        <div className="text-4xl sm:text-5xl font-black text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.9)] tracking-wider">
          नेत्र
        </div>
      </div>

      {/* 3. Bottom Action Button: "GET STARTED →" matching Image 1 */}
      <div className="relative z-10 w-full px-6 pb-8 pt-4">
        <button
          onClick={onGetStarted}
          className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-sm tracking-wider shadow-[0_4px_25px_rgba(37,99,235,0.6)] hover:shadow-[0_4px_35px_rgba(37,99,235,0.8)] transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <span>GET STARTED</span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};
