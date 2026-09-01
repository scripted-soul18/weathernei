import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  X, 
  ShieldAlert,
  Building2
} from 'lucide-react';
import { generateImdOfficialBulletin } from '../services/imdAlertService';
import { ACTIVE_DISTRICT_ALERTS, ACTIVE_CYCLONE_SIMULATION } from '../data/imdAlertsData';

export default function BulletinGeneratorModal({ isOpen, onClose, weatherData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bulletinText = generateImdOfficialBulletin({
    location: weatherData?.location,
    weather: weatherData,
    alerts: ACTIVE_DISTRICT_ALERTS,
    cyclone: ACTIVE_CYCLONE_SIMULATION
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(bulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([bulletinText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `IMD_Weather_Bulletin_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Official IMD Meteorological Weather Bulletin & SitRep
              </h3>
              <p className="text-xs text-slate-400">
                Government of India • Ministry of Earth Sciences (MoES)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bulletin Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-950/95 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/40">
          {bulletinText}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <span className="text-xs text-slate-400">
            Certified Meteorological Format: <strong>IMD-WMO Standard</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied" : "Copy Text"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download File</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bulletin (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
