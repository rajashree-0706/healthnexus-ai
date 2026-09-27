import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  HeartPulse,
  Pill,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { HealthPulseBreakdown, Patient } from '../types';

interface HealthPulseViewProps {
  patient: Patient;
  healthPulse: HealthPulseBreakdown;
  emergencyActive: boolean;
}

export const HealthPulseView: React.FC<HealthPulseViewProps> = ({
  patient,
  healthPulse,
  emergencyActive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('physicalHealth');

  const currentScore = emergencyActive ? 42 : healthPulse.overallScore;
  const currentStatus =
    emergencyActive
      ? { text: 'Critical Clinical Review', bg: 'bg-rose-50', textCol: 'text-rose-700', border: 'border-rose-200' }
      : currentScore >= 85
      ? { text: 'Optimal Stability', bg: 'bg-emerald-50', textCol: 'text-emerald-700', border: 'border-emerald-200' }
      : currentScore >= 70
      ? { text: 'Needs Attention', bg: 'bg-amber-50', textCol: 'text-amber-700', border: 'border-amber-200' }
      : { text: 'Elevated Risk', bg: 'bg-rose-50', textCol: 'text-rose-700', border: 'border-rose-200' };

  const radarData = [
    { subject: 'Physical Vitals', score: emergencyActive ? 40 : healthPulse.categories.physicalHealth.score, fullMark: 100 },
    { subject: 'Lab Biomarkers', score: healthPulse.categories.labTrends.score, fullMark: 100 },
    { subject: 'Medication', score: healthPulse.categories.medication.score, fullMark: 100 },
    { subject: 'Mental Well-Being', score: healthPulse.categories.mentalWellBeing.score, fullMark: 100 },
    { subject: 'Recent Trends', score: emergencyActive ? 30 : healthPulse.categories.recentChanges.score, fullMark: 100 },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-700" />
            <h1 className="text-xl font-bold text-slate-900">
              HealthPulse™ Multi-Axial Risk Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic risk calculation combining real-time vitals, lab biomarkers, pharmacotherapy adherence, and stress indices for {patient.name}.
          </p>
        </div>

        <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Explainable AI Model</span>
        </span>
      </div>

      {/* Main Score & Radar Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Score Gauge Card */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Composite Health Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900">{currentScore}</span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>

            <div className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStatus.bg} ${currentStatus.textCol} ${currentStatus.border}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{currentStatus.text}</span>
            </div>

            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              HealthPulse reflects acute shifts across all monitored physiological pathways. When a category scores below 75, clinical review is recommended.
            </p>
          </div>

          {/* Radar Chart */}
          <div className="h-52 w-full -my-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                <Radar
                  name="HealthPulse"
                  dataKey="score"
                  stroke="#047857"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
            <strong>Transparent Scoring:</strong> Every point deduction is mathematically linked to an underlying biomarker or vital measurement.
          </div>
        </div>

        {/* Right 5 Category Breakdown List */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-sm text-slate-900">5-Layer Score Breakdown</h3>
            <span className="text-xs text-slate-400">Click to expand clinical rationale</span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'physicalHealth',
                name: 'Physical Health & Vitals',
                score: emergencyActive ? 40 : healthPulse.categories.physicalHealth.score,
                details: healthPulse.categories.physicalHealth.details,
                icon: Activity,
              },
              {
                id: 'labTrends',
                name: 'Lab & Biomarker Trends',
                score: healthPulse.categories.labTrends.score,
                details: healthPulse.categories.labTrends.details,
                icon: FileSpreadsheet,
              },
              {
                id: 'medication',
                name: 'Medication & Regimen Adherence',
                score: healthPulse.categories.medication.score,
                details: healthPulse.categories.medication.details,
                icon: Pill,
              },
              {
                id: 'mentalWellBeing',
                name: 'Mental Well-Being & Stress',
                score: healthPulse.categories.mentalWellBeing.score,
                details: healthPulse.categories.mentalWellBeing.details,
                icon: Brain,
              },
              {
                id: 'recentChanges',
                name: 'Recent Dynamic Shift',
                score: emergencyActive ? 30 : healthPulse.categories.recentChanges.score,
                details: healthPulse.categories.recentChanges.details,
                icon: Zap,
              },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const isLow = cat.score < 70;
              const isMed = cat.score >= 70 && cat.score < 85;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 border-emerald-600/60'
                      : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-slate-900">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-xs ${isLow ? 'text-rose-700' : isMed ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {cat.score} / 100
                      </span>
                      {isSelected ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 text-xs text-slate-600">
                      <p className="text-slate-700 font-medium">{cat.details}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* "Why this score?" Explainability Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-semibold text-sm text-slate-900">Score Explainability & Signal Attribution</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Detailed list of reasons */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Observed Clinical Signals
            </span>
            <ul className="space-y-1.5">
              {healthPulse.whyThisScoreExplanation.map((exp, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Itemized Weighted Impact Factors */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Weighted Factor Attribution
            </span>
            <div className="space-y-1.5">
              {healthPulse.contributingFactors.map((factor, idx) => {
                const isPositive = factor.impact === 'positive';
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {isPositive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span className="font-medium text-slate-700">{factor.factor}</span>
                    </div>
                    <span
                      className={`font-semibold ${
                        isPositive ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {isPositive ? `+${factor.weight} buffer` : `-${factor.weight} impact`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
