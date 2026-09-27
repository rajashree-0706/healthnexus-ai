import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  ChevronRight,
  Droplet,
  FileSpreadsheet,
  Heart,
  HeartPulse,
  History,
  Scale,
  Thermometer,
  Wind,
} from 'lucide-react';
import { HealthChangeItem, Patient, PatientVitals, TabType } from '../types';

interface DashboardOverviewProps {
  patient: Patient;
  vitals: PatientVitals;
  whatChangedList: HealthChangeItem[];
  onNavigate: (tab: TabType) => void;
  onOpenBreathingModal: () => void;
  emergencyActive: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  patient,
  vitals,
  whatChangedList,
  onNavigate,
  onOpenBreathingModal,
  emergencyActive,
}) => {
  // Score calculations
  const score = emergencyActive ? 42 : patient.healthPulseScore;
  const scoreStatus =
    score >= 85
      ? { text: 'Optimal Stability', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
      : score >= 70
      ? { text: 'Needs Clinical Attention', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
      : { text: 'High Risk Alert', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };

  // 7 core vitals
  const vitalsList = [
    {
      id: 'bp',
      name: 'Blood Pressure',
      value: emergencyActive ? '184/112' : vitals.bloodPressure.combinedDisplay,
      unit: 'mmHg',
      prev: vitals.bloodPressure.systolic.previousValue + '/' + vitals.bloodPressure.diastolic.previousValue,
      status: emergencyActive ? 'critical' : vitals.bloodPressure.systolic.status,
      diff: emergencyActive ? '+36 mmHg' : '+12 mmHg (Stage 2)',
      icon: Heart,
    },
    {
      id: 'hr',
      name: 'Heart Rate',
      value: emergencyActive ? '118' : String(vitals.heartRate.currentValue),
      unit: vitals.heartRate.unit,
      prev: String(vitals.heartRate.previousValue),
      status: emergencyActive ? 'critical' : vitals.heartRate.status,
      diff: emergencyActive ? '+44 bpm spike' : '+10 bpm baseline',
      icon: Activity,
    },
    {
      id: 'bg',
      name: 'Fasting Glucose',
      value: String(vitals.bloodGlucose.currentValue),
      unit: vitals.bloodGlucose.unit,
      prev: String(vitals.bloodGlucose.previousValue),
      status: vitals.bloodGlucose.status,
      diff: '+22 mg/dL (HbA1c 8.2%)',
      icon: Droplet,
    },
    {
      id: 'spo2',
      name: 'Oxygen Saturation (SpO2)',
      value: emergencyActive ? '94' : String(vitals.spO2.currentValue),
      unit: vitals.spO2.unit,
      prev: String(vitals.spO2.previousValue),
      status: emergencyActive ? 'attention' : vitals.spO2.status,
      diff: emergencyActive ? 'Desaturation' : 'Optimal range',
      icon: Wind,
    },
    {
      id: 'wt',
      name: 'Body Weight',
      value: String(vitals.weight.currentValue),
      unit: vitals.weight.unit,
      prev: String(vitals.weight.previousValue),
      status: vitals.weight.status,
      diff: '+1.4 kg (3 wks)',
      icon: Scale,
    },
    {
      id: 'temp',
      name: 'Temperature',
      value: String(vitals.temperature.currentValue),
      unit: vitals.temperature.unit,
      prev: String(vitals.temperature.previousValue),
      status: vitals.temperature.status,
      diff: 'Afebrile (36.8°C)',
      icon: Thermometer,
    },
    {
      id: 'rr',
      name: 'Respiratory Rate',
      value: emergencyActive ? '24' : String(vitals.respiratoryRate.currentValue),
      unit: vitals.respiratoryRate.unit,
      prev: String(vitals.respiratoryRate.previousValue),
      status: emergencyActive ? 'attention' : vitals.respiratoryRate.status,
      diff: emergencyActive ? 'Tachypnea' : '16 br/min normal',
      icon: Wind,
    },
  ];

  const subScores = [
    { label: 'Physical Vitals', val: emergencyActive ? 42 : 68 },
    { label: 'Lab Biomarkers', val: 72 },
    { label: 'Medication Adherence', val: 92 },
    { label: 'Mental Well-Being', val: 64 },
    { label: 'Dynamic Stability', val: emergencyActive ? 30 : 75 },
  ];

  return (
    <div className="space-y-5">
      {/* Top Patient Context Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900">
              {patient.name}
            </h1>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
              MRN #{patient.id.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>{patient.age} yrs • {patient.gender}</span>
            <span>•</span>
            <span>Blood Group: {patient.bloodGroup}</span>
            <span>•</span>
            <span className="text-slate-700 font-medium">{patient.conditions.join(', ')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Upload Lab Report</span>
          </button>

          <button
            onClick={onOpenBreathingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Wind className="w-3.5 h-3.5 text-emerald-700" />
            <span>Guided Reset</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner (when active) */}
      {emergencyActive && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-slate-900 shadow-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-rose-800">
                  Simulated Critical Event: Hypertensive Crisis with Tachycardia
                </h3>
                <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  Level 1 Triage
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Simulated vitals: Blood pressure jumped to <strong>184/112 mmHg</strong>, heart rate surged to <strong>118 bpm</strong>. Critical triage alert broadcasted to readiness engine.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            View Triage &rarr;
          </button>
        </div>
      )}

      {/* Central Intelligence: HealthPulse & What Changed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* HealthPulse Card */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-700" />
                <h2 className="font-semibold text-sm text-slate-900">HealthPulse™ Risk Score</h2>
              </div>
              <button
                onClick={() => onNavigate('healthpulse')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                <span>Full Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Score & Category Tag */}
            <div className="flex items-center gap-4 my-4">
              <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{score}</span>
                <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
              </div>

              <div className="space-y-1">
                <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${scoreStatus.bg} ${scoreStatus.color} ${scoreStatus.border} border`}>
                  {scoreStatus.text}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Synthesizes physical biometrics, longitudinal lab trends, pharmacotherapy adherence, and stress indices.
                </p>
              </div>
            </div>

            {/* Subscore Mini Bars */}
            <div className="space-y-2 pt-2">
              {subScores.map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">{s.label}</span>
                    <span className="font-semibold text-slate-900">{s.val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.val >= 80 ? 'bg-emerald-600' : s.val >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${s.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Deterministic Explainability</span>
            <span className="font-semibold text-emerald-700">Audit Provenance ✓</span>
          </div>
        </div>

        {/* What Changed? Preview Teaser */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-700" />
                <h2 className="font-semibold text-sm text-slate-900">What Changed? (Recent Shifts)</h2>
              </div>
              <button
                onClick={() => onNavigate('whatchanged')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                <span>View All Shifts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 my-3">
              {whatChangedList.slice(0, 2).map((item) => {
                const isCritical = item.severity === 'critical';
                const isAttention = item.severity === 'attention';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCritical ? 'bg-rose-600' : isAttention ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                        />
                        <h4 className="font-semibold text-xs text-slate-900">{item.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                    </div>

                    <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      <div className="bg-white px-2.5 py-1.5 rounded border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-medium">Prior Baseline:</span>
                        <span className="text-slate-700 font-medium text-[11px]">{item.previousState}</span>
                      </div>
                      <div className="bg-white px-2.5 py-1.5 rounded border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-medium">Latest Measurement:</span>
                        <span className={`font-semibold text-[11px] ${isCritical ? 'text-rose-700' : 'text-slate-900'}`}>
                          {item.currentState}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-800 font-medium pt-0.5">
                      💬 Clinician note: {item.whatToDiscuss}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">
              <strong>3</strong> significant shifts detected across records.
            </span>
            <button
              onClick={() => onNavigate('whatchanged')}
              className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-xs"
            >
              <span>Explore longitudinal diff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Vitals Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <h3 className="font-semibold text-sm text-slate-900">Current Vitals & Ambulatory Stream</h3>
          </div>
          <span className="text-xs text-slate-400">Synced from Ambulatory Monitor</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {vitalsList.map((vital) => {
            const Icon = vital.icon;
            const isCritical = vital.status === 'critical';
            const isAttention = vital.status === 'attention';

            return (
              <div
                key={vital.id}
                className={`bg-white rounded-xl p-4 border transition-all ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/20'
                    : isAttention
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">{vital.name}</span>
                  <Icon className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-600' : isAttention ? 'text-amber-600' : 'text-slate-400'}`} />
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900">{vital.value}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{vital.unit}</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Prev: {vital.prev}</span>
                  <span
                    className={`font-semibold ${
                      isCritical ? 'text-rose-700' : isAttention ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {vital.diff}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Whole Health Card */}
          <div
            onClick={() => onNavigate('mental')}
            className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200/70 flex flex-col justify-between cursor-pointer hover:bg-emerald-50 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-emerald-800">Mind-Body Axis</span>
                <Brain className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Stress (7.8/10) directly influences autonomic vascular tone and insulin sensitivity.
              </p>
            </div>
            <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1 group-hover:underline">
              <span>View Well-Being</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
