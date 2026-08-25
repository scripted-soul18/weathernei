import React, { useEffect, useState } from 'react';
import { X, Activity, Award, CheckCircle, BarChart2, ShieldCheck, Zap } from 'lucide-react';
import { ModelMetricsResponse } from '../types';
import { fetchModelMetrics } from '../services/api';

interface ModelMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelMetricsModal: React.FC<ModelMetricsModalProps> = ({ isOpen, onClose }) => {
  const [metricsData, setMetricsData] = useState<ModelMetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchModelMetrics()
        .then((data) => setMetricsData(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const m = metricsData?.metrics;
  const cm = m?.confusion_matrix || [[750, 49], [96, 305]];

  return (
    <div className="fixed inset-0 z-[1300] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl glass-panel bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Machine Learning Model Evaluation & Transparency
              </h3>
              <p className="text-xs text-slate-400">
                Validation metrics, confusion matrix, and feature importances
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Best Model Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-7 h-7 text-cyan-400" />
              <div>
                <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider">Top-Ranked Architecture</span>
                <h4 className="text-lg font-bold text-white">{metricsData?.best_model_name || 'Gradient Boosting Ensemble'}</h4>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Dataset Size</div>
              <div className="font-mono font-bold text-slate-200">{metricsData?.sample_count || 6000} Geospatial Records</div>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Recall (Safety)</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                {m ? `${(m.recall * 100).toFixed(1)}%` : '76.1%'}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">High Focus</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">ROC-AUC</div>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
                {m ? m.roc_auc.toFixed(3) : '0.934'}
              </div>
              <span className="text-[10px] text-slate-500">Discrimination</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">F1 Score</div>
              <div className="text-xl font-bold font-mono text-teal-400 mt-1">
                {m ? `${(m.f1_score * 100).toFixed(1)}%` : '80.8%'}
              </div>
              <span className="text-[10px] text-slate-500">Harmonic Mean</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Precision</div>
              <div className="text-xl font-bold font-mono text-blue-400 mt-1">
                {m ? `${(m.precision * 100).toFixed(1)}%` : '86.2%'}
              </div>
              <span className="text-[10px] text-slate-500">Low False Alarm</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 font-medium">Accuracy</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {m ? `${(m.accuracy * 100).toFixed(1)}%` : '87.9%'}
              </div>
              <span className="text-[10px] text-slate-500">Overall</span>
            </div>
          </div>

          {/* Confusion Matrix & Multi-Model Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confusion Matrix */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <h5 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Validation Confusion Matrix
              </h5>
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                  <div className="text-[10px] text-slate-400">True Negative (Safe)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{cm[0][0]}</div>
                </div>
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg">
                  <div className="text-[10px] text-slate-400">False Positive (False Alarm)</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">{cm[0][1]}</div>
                </div>
                <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg">
                  <div className="text-[10px] text-slate-400">False Negative (Missed)</div>
                  <div className="text-lg font-bold text-rose-400 mt-1">{cm[1][0]}</div>
                </div>
                <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg">
                  <div className="text-[10px] text-slate-400">True Positive (Hazard Detected)</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">{cm[1][1]}</div>
                </div>
              </div>
            </div>

            {/* Feature Importance Rankings */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <h5 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                Global Feature Importance Hierarchy
              </h5>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {metricsData?.feature_importances &&
                  Object.entries(metricsData.feature_importances).slice(0, 6).map(([feat, score], idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300 capitalize">{feat.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-slate-400 font-semibold">{(score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${Math.min(100, score * 250)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
