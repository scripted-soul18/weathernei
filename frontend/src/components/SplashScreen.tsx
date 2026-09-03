import React from 'react';
import { ArrowRight } from 'lucide-react';
import splashImg from '../assets/bharat_netra_splash.jpg';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-full flex-1 flex flex-col justify-end items-center selection:bg-blue-600 selection:text-white overflow-hidden bg-[#030712] min-h-[580px]">
      {/* 1. Bundled Original Graphic Image */}
      <img
        src={splashImg}
        alt="Bharat Netra Splash"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none"
        loading="eager"
      />

      {/* 2. Interactive "GET STARTED →" Button Anchored at the Bottom matching Screenshot */}
      <div className="relative z-20 w-full px-6 pb-8 pt-4 flex justify-center">
        <button
          onClick={onGetStarted}
          className="w-full max-w-[340px] py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm tracking-wider shadow-[0_4px_25px_rgba(37,99,235,0.7)] hover:shadow-[0_4px_35px_rgba(37,99,235,0.9)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>GET STARTED</span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};
