import React, { useState } from 'react';
import {
  Globe,
  Car,
  Bike,
  Truck,
  ShieldCheck,
  Clock,
  Headphones,
  Check,
  ChevronLeft,
  Moon,
  Sun,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface VehicleLanguageOnboardingProps {
  onBack: () => void;
  onContinue: (config: { language: string; vehicle: string }) => void;
}

const LANGUAGES = [
  { id: 'en', native: 'English', english: 'Default' },
  { id: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { id: 'as', native: 'অসমীয়া', english: 'Assamese' },
  { id: 'bn', native: 'বাংলা', english: 'Bengali' },
  { id: 'mni', native: 'মৈতৈলোন্', english: 'Manipuri' },
  { id: 'brx', native: 'बड़ो', english: 'Bodo' }
];

const VEHICLES = [
  {
    id: 'bicycle',
    label: 'Bicycle',
    emoji: '🚲',
    buttonName: 'BICYCLE',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'bike',
    label: 'Two-wheeler',
    emoji: '🏍️',
    buttonName: 'TWO-WHEELER',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'car',
    label: 'Car',
    emoji: '🚗',
    buttonName: 'CAR',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'truck',
    label: 'Truck',
    emoji: '🚛',
    buttonName: 'TRUCK',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=300&q=80'
  }
];

export const VehicleLanguageOnboarding: React.FC<VehicleLanguageOnboardingProps> = ({
  onBack,
  onContinue
}) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVehicle, setSelectedVehicle] = useState('car');

  const currentVehicleObj = VEHICLES.find((v) => v.id === selectedVehicle) || VEHICLES[2];

  const handleNext = () => {
    onContinue({
      language: selectedLanguage,
      vehicle: selectedVehicle
    });
  };

  return (
    <div className="relative w-full min-h-full flex-1 flex flex-col justify-between selection:bg-blue-600 selection:text-white overflow-y-auto overflow-x-hidden bg-[#040814]">
      {/* 1. Curved Blue Earth from Space Background matching Image 2 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(4, 8, 20, 0.45) 0%, rgba(4, 8, 20, 0.75) 45%, rgba(4, 8, 20, 0.98) 100%), url('/space_earth_bg.jpg')`
        }}
      />

      {/* Ambient Star Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 2. TOP HEADER BAR matching Image 2 */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 shrink-0"
          title="Go Back"
        >
          <ChevronLeft className="w-5 h-5 text-slate-200" />
        </button>

        {/* User Verified Status Pill matching Image 2 */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg">
          <div className="w-7 h-7 rounded-full bg-amber-700/60 border border-amber-500/80 text-amber-200 font-bold text-xs flex items-center justify-center font-mono">
            O
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white leading-tight">Onkar Pawar</div>
            <div className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-[8px]">
                ✓
              </span>
              <span>Verified Driver</span>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-300 transition-all backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 shrink-0"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT: Language + Vehicle + Feature Highlights */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full flex-1 px-4 sm:px-5 py-3 space-y-4">
        {/* SECTION A: Select Language matching Image 2 */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span>Select Language</span>
          </div>

          {/* 3x2 Grid of Languages */}
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`relative p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center min-h-[64px] ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-500 ring-2 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.35)] text-white'
                      : 'bg-slate-950/70 hover:bg-slate-900/80 border-slate-800/90 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {/* Selected Checkmark Badge on top right */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <span className="font-bold text-xs tracking-tight">{lang.native}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">{lang.english}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION B: Select Your Vehicle matching Image 2 */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span>Select Your Vehicle</span>
          </div>

          {/* 4 Circular Vehicle Photo Cards */}
          <div className="grid grid-cols-4 gap-2">
            {VEHICLES.map((veh) => {
              const isSelected = selectedVehicle === veh.id;
              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh.id)}
                  className="flex flex-col items-center cursor-pointer group space-y-1.5"
                >
                  {/* Circular Photo Card */}
                  <div
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden p-0.5 transition-all ${
                      isSelected
                        ? 'ring-3 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
                        : 'border border-slate-700 opacity-70 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                  >
                    <img
                      src={veh.image}
                      alt={veh.label}
                      className="w-full h-full object-cover rounded-full"
                    />

                    {/* Selected Checkmark Pill */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-900">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Vehicle Label Pill */}
                  <div
                    className={`w-full py-1 px-1 rounded-xl text-center text-[10px] font-bold truncate transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {veh.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION C: 3 Trust & Feature Highlights matching Image 2 */}
        <div className="p-3.5 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-3 gap-2 text-left">
            {/* 1. Secure & Verified */}
            <div className="space-y-1">
              <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-bold text-white leading-tight">Secure &amp; Verified</div>
              <div className="text-[9px] text-slate-400 leading-tight">
                All drivers are verified for your safety.
              </div>
            </div>

            {/* 2. Quick Onboarding */}
            <div className="space-y-1">
              <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-bold text-white leading-tight">Quick Onboarding</div>
              <div className="text-[9px] text-slate-400 leading-tight">
                Get started in just a few simple steps.
              </div>
            </div>

            {/* 3. 24/7 Support */}
            <div className="space-y-1">
              <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-bold text-white leading-tight">24/7 Support</div>
              <div className="text-[9px] text-slate-400 leading-tight">
                We're here to help you anytime.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. BOTTOM ACTION BUTTON: "CONTINUE WITH [VEHICLE] 🚗 →" */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full px-4 sm:px-6 pb-6 pt-2 shrink-0">
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-xs tracking-wider shadow-[0_4px_25px_rgba(37,99,235,0.6)] hover:shadow-[0_4px_35px_rgba(37,99,235,0.8)] transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <span>
            CONTINUE WITH {currentVehicleObj.buttonName} {currentVehicleObj.emoji}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
