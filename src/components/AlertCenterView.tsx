import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Heart,
  HelpCircle,
  History,
  PhoneCall,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { NexusAlert, Patient } from '../types';

interface AlertCenterViewProps {
  patient: Patient;
  alerts: NexusAlert[];
  emergencyActive: boolean;
  onToggleEmergency: () => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  patient,
  alerts,
  emergencyActive,
  onToggleEmergency,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'attention' | 'stable'>('all');

  const emergencyAlert: NexusAlert = {
    id: 'alt-emergency-active',
    patientId: patient.id,
    patientName: patient.name,
    severity: 'critical',
    title: '🔴 EMERGENCY ALERT: Acute Hypertensive Crisis & Tachycardia',
    reason:
      'Simulated live vital telemetry detected sudden systolic spike to 184 mmHg and heart rate at 118 bpm. Immediate clinical triage required.',
    category: 'Emergency Simulation',
    createdAt: 'Just now (Simulated Live)',
    status: 'active',
    relatedData: ['BP: 184/112 mmHg', 'HR: 118 bpm', 'SpO2: 94%'],
    recommendedNextStep:
      'Activate Emergency Rapid Response Team, prep IV labetalol/hydralazine, and hold telemetry bed.',
    triagePriority: 1,
  };

  const currentAlerts = emergencyActive ? [emergencyAlert, ...alerts] : alerts;

  const filteredAlerts =
    selectedFilter === 'all'
      ? currentAlerts
      : currentAlerts.filter((a) => a.severity === selectedFilter);

  const timelineSteps = [
    { time: '00:00', title: 'Vital Shift Detected', desc: 'Ambulatory sensor/telemetry records sudden BP spike to 184/112 mmHg', icon: Activity, done: emergencyActive },
    { time: '00:05', title: 'AI Risk Stratification', desc: 'Nexus Burst Engine flags acute end-organ hypertensive risk', icon: Zap, done: emergencyActive },
    { time: '00:10', title: 'Nexus Alert Dispatched', desc: 'Level 1 Critical triage ticket generated with biomarker provenance', icon: AlertTriangle, done: emergencyActive },
    { time: '00:15', title: 'Care Team Paging', desc: 'On-duty cardiologist & emergency triage physician notified via dashboard', icon: PhoneCall, done: emergencyActive },
    { time: '00:20', title: 'Hospital Readiness Sync', desc: 'Telemetry bed hold confirmed at Metro City Memorial Hospital', icon: ShieldAlert, done: emergencyActive },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-[#DC5A5A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">
              NEXUS ALERTS &bull; Triage & Emergency Deterioration Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Rule-based and predictive safety triggers that surface clinical escalations before adverse outcomes occur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Emergency Deterioration Trigger Button */}
          <button
            onClick={onToggleEmergency}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all ${
              emergencyActive
                ? 'bg-[#DC5A5A] text-white animate-pulse'
                : 'bg-[#FEE2E2] text-[#DC5A5A] hover:bg-[#fed2d2] border border-[#DC5A5A]/30'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{emergencyActive ? '🔴 Emergency Active (Click to Reset)' : 'Simulate Acute Deterioration'}</span>
          </button>
        </div>
      </div>

      {/* Emergency Scenario Simulation Showcase Box */}
      <div
        className={`rounded-2xl p-6 border transition-all ${
          emergencyActive
            ? 'bg-gradient-to-r from-[#FEE2E2] via-white to-[#FEF3C7] border-[#DC5A5A]'
            : 'bg-white border-[#E5EAEA] shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                emergencyActive ? 'bg-[#DC5A5A] text-white animate-bounce' : 'bg-[#F8FAFA] text-[#64748B]'
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#16302A]">
                {emergencyActive
                  ? '⚡ Live Deterioration Scenario in Progress'
                  : 'Interactive Judge Demo: Emergency Scenario Simulator'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {emergencyActive
                  ? 'Patient Ananya Sharma is experiencing acute hypertensive surge. See automated response timeline below.'
                  : 'Click the button above to simulate sudden patient deterioration and watch the automated 5-step response unfold.'}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              emergencyActive ? 'bg-[#DC5A5A] text-white' : 'bg-[#E8F7F1] text-[#168A6A]'
            }`}
          >
            {emergencyActive ? 'SIMULATION RUNNING' : 'STANDBY READY'}
          </span>
        </div>

        {/* 5-Step Emergency Timeline */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {timelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  step.done
                    ? 'bg-white border-[#DC5A5A]/50 shadow-xs ring-1 ring-[#DC5A5A]/20'
                    : 'bg-[#F8FAFA] border-[#E5EAEA] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#64748B]">{step.time}</span>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      step.done ? 'bg-[#FEE2E2] text-[#DC5A5A]' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="font-bold text-xs text-[#16302A] mb-1">{step.title}</h4>
                <p className="text-[11px] text-[#64748B] leading-snug">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-[#E5EAEA] shadow-xs">
        <span className="text-xs font-bold text-[#64748B] mr-2">Filter Alerts:</span>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            selectedFilter === 'all' ? 'bg-[#168A6A] text-white' : 'bg-[#F8FAFA] text-[#64748B] hover:bg-[#E8F7F1]'
          }`}
        >
          All ({currentAlerts.length})
        </button>
        <button
          onClick={() => setSelectedFilter('critical')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            selectedFilter === 'critical' ? 'bg-[#DC5A5A] text-white' : 'bg-[#FEE2E2] text-[#DC5A5A]'
          }`}
        >
          Critical ({currentAlerts.filter((a) => a.severity === 'critical').length})
        </button>
        <button
          onClick={() => setSelectedFilter('attention')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            selectedFilter === 'attention' ? 'bg-[#D97706] text-white' : 'bg-[#FEF3C7] text-[#D97706]'
          }`}
        >
          Attention ({currentAlerts.filter((a) => a.severity === 'attention').length})
        </button>
        <button
          onClick={() => setSelectedFilter('stable')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            selectedFilter === 'stable' ? 'bg-[#168A6A] text-white' : 'bg-[#E8F7F1] text-[#168A6A]'
          }`}
        >
          Stable ({currentAlerts.filter((a) => a.severity === 'stable').length})
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isAttention = alert.severity === 'attention';
          const borderStyle = isCritical ? 'border-[#DC5A5A]/50 bg-white' : isAttention ? 'border-[#F59E0B]/40 bg-white' : 'border-[#E5EAEA] bg-white';

          return (
            <div
              key={alert.id}
              className={`rounded-2xl p-5 border ${borderStyle} shadow-xs space-y-3 hover:shadow-md transition-all`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E5EAEA]">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isCritical ? 'bg-[#DC5A5A] animate-ping' : isAttention ? 'bg-[#F59E0B]' : 'bg-[#168A6A]'
                    }`}
                  />
                  <h3 className="font-bold text-sm text-[#16302A]">{alert.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isCritical ? 'bg-[#FEE2E2] text-[#DC5A5A]' : isAttention ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#E8F7F1] text-[#168A6A]'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span>Category: <strong>{alert.category}</strong></span>
                  <span>&bull;</span>
                  <span>{alert.createdAt}</span>
                </div>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">{alert.reason}</p>

              <div className="p-3 rounded-xl bg-[#E8F7F1]/60 border border-[#168A6A]/20 flex items-start gap-2 text-xs text-[#16302A]">
                <span className="font-bold text-[#168A6A] shrink-0">💡 Suggested Clinical Action:</span>
                <span>{alert.recommendedNextStep}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
