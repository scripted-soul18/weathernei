import React from 'react';
import {
  Bookmark,
  RefreshCw,
  Sun,
  Moon,
  ArrowLeft,
  Navigation,
  Shield,
  Activity,
  Compass
} from 'lucide-react';
import { LocationSearchBar } from './LocationSearchBar';
import { RiskLevel } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onBackToNavigation: () => void;
  onSelectCoordinates: (lat: number, lon: number, name?: string) => void;
  currentLat: number;
  currentLon: number;
  onOpenSavedLocations: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  alertCount: number;
  currentRiskLevel?: RiskLevel;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBackToNavigation,
  onSelectCoordinates,
  currentLat,
  currentLon,
  onOpenSavedLocations,
  onRefresh,
  isLoading,
  alertCount,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-[1100] w-full border-b border-slate-200 dark:border-slate-800/80 glass-panel bg-white/90 dark:bg-slate-950/85 backdrop-blur-2xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Back Button to Bharat Netra & Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button
            onClick={onBackToNavigation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white transition-all shadow-sm active:scale-95 group text-xs font-bold"
            title="Return to Bharat Netra Safe Road Navigation"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Bharat Netra Nav</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/weather_logo.png"
              alt="Weather Analysis Logo"
              className="w-8 h-8 rounded-xl object-cover shadow-lg border border-slate-200 dark:border-white/10 ring-1 ring-blue-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  Weather Analysis
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mobile Controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenSavedLocations}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 relative transition-colors"
              title="Saved Locations"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {alertCount}
                </span>
              )}
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
          </div>
        </div>

        {/* Center: Location Search Bar matching Image 3 */}
        <div className="w-full md:flex-1 max-w-md flex items-center justify-center">
          <LocationSearchBar
            onSelectCoordinates={onSelectCoordinates}
            currentLat={currentLat}
            currentLon={currentLon}
          />
        </div>

        {/* Right: Desktop Action Controls matching Image 3 */}
        <div className="hidden md:flex items-center gap-2">
          {/* Saved / Bookmarks */}
          <button
            onClick={onOpenSavedLocations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 transition-all shadow-sm active:scale-95 relative"
            title="Saved Locations & Hazard History"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Saved</span>
            {alertCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                {alertCount}
              </span>
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 transition-all shadow-sm active:scale-95"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-300 transition-all shadow-sm active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-cyan-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
