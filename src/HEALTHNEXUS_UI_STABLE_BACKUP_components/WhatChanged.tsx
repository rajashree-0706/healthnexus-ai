import React, { useState } from 'react';
import {
  Clock,
  Filter,
  History,
  Info,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { ChangeSeverity, HealthChangeItem, Patient } from '../types';

interface WhatChangedProps {
  patient: Patient;
  items: HealthChangeItem[];
  emergencyActive: boolean;
}

export const WhatChanged: React.FC<WhatChangedProps> = ({
  patient,
  items,
  emergencyActive,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeSeverity, setActiveSeverity] = useState<string>('All');

  // If emergency is simulated, prepend the acute surge item
  const displayItems = emergencyActive
    ? [
        {
          id: 'wc-emergency',
          category: 'Blood Pressure' as const,
          severity: 'critical' as ChangeSeverity,
          title: 'Critical Surge: Acute Hypertensive Crisis with Tachycardia',
          previousState: 'BP 148/94 mmHg | HR 84 bpm',
          currentState: 'BP 184/112 mmHg | HR 118 bpm',
          whatChanged: 'Blood pressure spiked by +36 mmHg systolic and Heart Rate surged by +34 bpm within minutes.',
          whyItMatters:
            'Acute hypertensive surge with tachycardia poses immediate risk of end-organ shear, acute coronary syndrome, or hypertensive encephalopathy.',
          whatToDiscuss:
            'Immediate triage review, administer emergency antihypertensive protocols, and monitor ECG continuously.',
          detectionSource: 'Nexus Burst Live Deterioration Engine',
          timestamp: 'Just now (Simulated)',
        },
        ...items,
      ]
    : items;

  const categories = ['All', 'Blood Pressure', 'Glucose', 'Mental Well-Being', 'Weight', 'Activity'];

  const filteredItems = displayItems.filter((item) => {
    const matchCat = selectedFilter === 'All' || item.category === selectedFilter;
    const matchSev = activeSeverity === 'All' || item.severity === activeSeverity;
    return matchCat && matchSev;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-700" />
            <h1 className="text-xl font-bold text-slate-900">
              What Changed? Longitudinal Trajectory Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated diff engine detecting physiological shifts between prior clinical baseline and recent observations for {patient.name}.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>{displayItems.length} Tracked Trajectories</span>
        </span>
      </div>

      {/* Severity Legend & Filters */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1">Filter:</span>
          <button
            onClick={() => setActiveSeverity(activeSeverity === 'critical' ? 'All' : 'critical')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSeverity === 'critical' ? 'ring-1 ring-rose-600 bg-rose-100 text-rose-800' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>Critical Shift</span>
          </button>

          <button
            onClick={() => setActiveSeverity(activeSeverity === 'attention' ? 'All' : 'attention')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSeverity === 'attention' ? 'ring-1 ring-amber-600 bg-amber-100 text-amber-800' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Attention</span>
          </button>

          <button
            onClick={() => setActiveSeverity(activeSeverity === 'stable' ? 'All' : 'stable')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSeverity === 'stable' ? 'ring-1 ring-emerald-600 bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Stable</span>
          </button>
        </div>
      </div>

      {/* Main What Changed Comparison List */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => {
          const isCritical = item.severity === 'critical';
          const isAttention = item.severity === 'attention';
          const badgeBg = isCritical ? 'bg-rose-50 text-rose-800 border-rose-200' : isAttention ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200';
          const borderColor = isCritical ? 'border-rose-300' : isAttention ? 'border-amber-300' : 'border-slate-200';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-5 border ${borderColor} shadow-xs space-y-3.5`}
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCritical ? 'bg-rose-600' : isAttention ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                  />
                  <h3 className="font-semibold text-sm text-slate-900">{item.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeBg}`}>
                    {isCritical ? 'Significant Shift' : isAttention ? 'Attention Needed' : 'Stable'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Source: {item.detectionSource}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* State Comparison (Baseline vs Current) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Prior Baseline State
                  </span>
                  <p className="text-xs font-medium text-slate-700">{item.previousState}</p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isCritical
                      ? 'bg-rose-50/40 border-rose-200 text-rose-900'
                      : isAttention
                      ? 'bg-amber-50/40 border-amber-200 text-amber-900'
                      : 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Current Measured State
                  </span>
                  <p className="text-xs font-bold">{item.currentState}</p>
                </div>
              </div>

              {/* 3-Part Intelligence Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* 1. What Changed */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>1. Observed Shift</span>
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.whatChanged}</p>
                </div>

                {/* 2. Why It Matters */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. Clinical Significance</span>
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.whyItMatters}</p>
                </div>

                {/* 3. What to Discuss */}
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                  <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>3. Clinician Discussion</span>
                  </span>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">{item.whatToDiscuss}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
