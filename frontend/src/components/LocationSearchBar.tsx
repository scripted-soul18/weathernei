import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { searchLocations } from '../services/api';

interface LocationSearchBarProps {
  onSelectCoordinates: (lat: number, lon: number, name?: string) => void;
  currentLat: number;
  currentLon: number;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  onSelectCoordinates,
  currentLat,
  currentLon,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSelectCoordinates(
            Number(pos.coords.latitude.toFixed(5)),
            Number(pos.coords.longitude.toFixed(5)),
            'Current GPS Location'
          );
        },
        (err) => {
          console.warn('Geolocation denied, keeping current:', err);
        }
      );
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-cyan-400" />
        <input
          id="location-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, mountain region, or coordinates..."
          className="w-full bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-900 text-slate-100 text-sm pl-10 pr-24 py-2 rounded-xl border border-slate-700/70 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-slate-500"
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {isSearching && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin mr-1" />}
          <button
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700 transition-all shadow-sm active:scale-95"
            title="Use My Current GPS Location"
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[1200] max-h-64 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectCoordinates(item.latitude, item.longitude, item.name);
                setIsOpen(false);
                setQuery(item.name.split(',')[0]);
              }}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-800/80 flex items-start gap-2.5 border-b border-slate-800/60 last:border-0 transition-all text-slate-200"
            >
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-medium text-slate-100">{item.name.split(',')[0]}</span>
                <span className="text-xs text-slate-400 truncate max-w-xs">{item.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
