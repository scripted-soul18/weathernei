import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-full min-h-screen flex-1 flex flex-col justify-end items-center selection:bg-blue-600 selection:text-white overflow-hidden bg-[#030712]">
      {/* 1. Original Graphic Image Provided by User */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/bharat_netra_splash.jpg')`
        }}
      />

      {/* 2. Interactive "GET STARTED →" Button Anchored at the Bottom */}
      <div className="relative z-20 w-full px-7 pb-10 pt-4 flex justify-center">
        <button
          onClick={onGetStarted}
          className="w-full max-w-[320px] py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-extrabold text-xs tracking-wider shadow-[0_4px_25px_rgba(37,99,235,0.7)] hover:shadow-[0_4px_35px_rgba(37,99,235,0.9)] transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <span>GET STARTED</span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};
