import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, MessageSquare, Camera } from 'lucide-react';

interface MobileAppWrapperProps {
  children: React.ReactNode;
}

export const MobileAppWrapper: React.FC<MobileAppWrapperProps> = ({ children }) => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-[#03060E] flex items-center justify-center sm:p-4 selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      {/* Mobile Smartphone Frame Wrapper */}
      <div className="w-full sm:max-w-[440px] md:max-w-[460px] min-h-screen sm:min-h-[860px] sm:max-h-[94vh] bg-white dark:bg-[#070E1A] sm:rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.95)] sm:border-[5px] sm:border-slate-300 dark:border-slate-800/90 flex flex-col justify-between relative overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10 transition-colors duration-300">
        {/* Top Native Mobile Status Bar */}
        <div className="w-full px-5 pt-2 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white/95 dark:bg-[#070E1A]/95 border-b border-slate-200/60 dark:border-transparent backdrop-blur-md select-none shrink-0 z-50 transition-colors duration-300">
          {/* Left: Clock & Notifications */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-900 dark:text-white font-bold">{timeStr}</span>
            <div className="flex items-center gap-1 opacity-70 text-slate-600 dark:text-slate-300">
              <MessageSquare className="w-2.5 h-2.5" />
              <Camera className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Center Speaker Notch */}
          <div className="w-20 h-3.5 bg-slate-200 dark:bg-slate-950/90 rounded-full border border-slate-300 dark:border-slate-800 flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-400 dark:bg-slate-800 rounded-full" />
          </div>

          {/* Right: Network & Battery Indicators */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">VoLTE</span>
            <Signal className="w-3 h-3 text-slate-600 dark:text-slate-300" />
            <span className="text-[10px]">98%</span>
            <Battery className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
          </div>
        </div>

        {/* Dynamic Screen View Content */}
        <div className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>

        {/* Bottom Smartphone Gesture Indicator Bar */}
        <div className="w-full py-1 bg-white dark:bg-[#060C16] border-t border-slate-200/60 dark:border-transparent flex justify-center shrink-0 z-50 transition-colors duration-300">
          <div className="w-32 h-1 bg-slate-300 dark:bg-slate-600/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
