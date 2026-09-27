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
      diff: 'Afebrile',
      icon: Thermometer,
    },
    {
      id: 'resp',
      name: 'Respiratory Rate',
      value: emergencyActive ? '26' : String(vitals.respiratoryRate.currentValue),
      unit: vitals.respiratoryRate.unit,
      prev: String(vitals.respiratoryRate.previousValue),
      status: emergencyActive ? 'critical' : vitals.respiratoryRate.status,
      diff: emergencyActive ? 'Tachypneic' : 'Normal pattern',
      icon: Wind,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Header Identity Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={patient.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
            alt={patient.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100 shadow-2xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">{patient.name}</h1>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md font-semibold">
                {patient.age}y &bull; {patient.gender}
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2 py-0.5 rounded-md font-bold">
                MRN: {patient.mrn}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {patient.conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="bg-sky-50 text-sky-800 border border-sky-200/70 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => onNavigate('whatchanged')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>What Changed?</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Upload Lab Report</span>
          </button>
        </div>
      </div>

      {/* Emergency Crisis Alert if Active */}
      {emergencyActive && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-900">
                CRITICAL ALERT: Acute Hypertensive Crisis &amp; Tachycardia
              </h3>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                HIGH RISK
              </span>
            </div>
            <p className="text-xs text-rose-800">
              Systolic BP spiked to 184 mmHg with HR 118 bpm. Immediate clinical triage and ICU protocol recommendation triggered.
            </p>
          </div>
        </div>
      )}

      {/* HealthPulse Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main HealthPulse Score Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">HealthPulse™ Index</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${scoreStatus.bg} ${scoreStatus.color} ${scoreStatus.border}`}>
                {scoreStatus.text}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{score}</span>
              <span className="text-xs text-slate-400 font-medium">/ 100 Stability Score</span>
            </div>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Composite telemetry aggregating 7 vital channels, biomarker drift, and prescription adherence.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('healthpulse')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View score breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* What Changed Highlight Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Changes</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {whatChangedList.length} updates
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {whatChangedList.slice(0, 2).map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{item.parameter}</span>
                    <span className="text-[11px] text-rose-600 font-bold">{item.delta}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.clinicalNote}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('whatchanged')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <span>See full delta report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mindful Well-Being & Reset Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mindful Well-Being</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Stress: 4/10
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Bi-directional vagal pacing can immediately stabilize blood pressure surges and improve HRV.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
              <div className="text-xs">
                <div className="font-bold text-sky-900">2-Min Box Breathing</div>
                <div className="text-[11px] text-slate-500">4s Inhale &bull; 4s Hold &bull; 4s Exhale</div>
              </div>
              <button
                onClick={onOpenBreathingModal}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Start
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('mental')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Open Well-Being check-in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Core Telemetry Vitals Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">7-Channel Continuous Telemetry</h2>
          <span className="text-xs text-slate-400">Live synchronized sensor data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {vitalsList.map((v) => {
            const Icon = v.icon;
            const isCrit = v.status === 'critical';
            const isAttn = v.status === 'attention';

            return (
              <div
                key={v.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs ${
                  isCrit
                    ? 'border-rose-300 bg-rose-50/30'
                    : isAttn
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 truncate">{v.name}</span>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isCrit
                        ? 'bg-rose-100 text-rose-600'
                        : isAttn
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-900">{v.value}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{v.unit}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Prev: {v.prev}</span>
                  <span
                    className={`font-bold ${
                      isCrit ? 'text-rose-600' : isAttn ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {v.diff}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
