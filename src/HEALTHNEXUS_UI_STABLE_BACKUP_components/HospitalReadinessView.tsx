import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  HeartPulse,
  HelpCircle,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { HospitalReadinessMetrics } from '../types';
import { api } from '../services/api';

interface HospitalReadinessViewProps {
  metrics: HospitalReadinessMetrics;
  emergencyActive: boolean;
}

export const HospitalReadinessView: React.FC<HospitalReadinessViewProps> = ({
  metrics,
  emergencyActive,
}) => {
  const [surgePercentage, setSurgePercentage] = useState<number>(emergencyActive ? 30 : 15);
  const [whatIfResult, setWhatIfResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const icuAvailable = emergencyActive ? 4 : metrics.icuBeds.available;
  const generalAvailable = emergencyActive ? 18 : metrics.generalBeds.available;
  const readinessScore = emergencyActive ? 74 : metrics.overallReadinessScore;

  const handleRunWhatIf = async (surge: number) => {
    setIsSimulating(true);
    setSurgePercentage(surge);
    try {
      const res = await api.simulateHospitalWhatIf({
        surgePercentage: surge,
        activeBedCapacity: metrics.generalBeds.total,
        icuCapacity: metrics.icuBeds.total,
      });
      setWhatIfResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#168A6A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">
              HEALTHCARE READINESS &bull; Regional Capacity Command
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Translating individualized patient risk signals into macro healthcare infrastructure and hospital surge readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#E8F7F1] text-[#168A6A] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Facility: {metrics.facilityName}</span>
          </span>
        </div>
      </div>

      {/* Real-Time Readiness Capacity Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Readiness Index */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAEA] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            Readiness Index
          </span>
          <div className="text-2xl font-extrabold text-[#168A6A]">{readinessScore} / 100</div>
          <span className="text-[10px] text-[#168A6A] font-semibold mt-1 block">
            {readinessScore >= 80 ? 'Optimal Reserve' : 'Surge Alert'}
          </span>
        </div>

        {/* ICU Beds */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAEA] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            ICU Capacity
          </span>
          <div className="text-2xl font-extrabold text-[#DC5A5A]">
            {icuAvailable} <span className="text-xs font-normal text-[#64748B]">/ {metrics.icuBeds.total}</span>
          </div>
          <span className="text-[10px] text-[#DC5A5A] font-semibold mt-1 block">
            {metrics.icuBeds.total - icuAvailable} Occupied ({(
              ((metrics.icuBeds.total - icuAvailable) / metrics.icuBeds.total) *
              100
            ).toFixed(0)}%)
          </span>
        </div>

        {/* General Beds */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAEA] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            General Beds
          </span>
          <div className="text-2xl font-extrabold text-[#3B82C4]">
            {generalAvailable} <span className="text-xs font-normal text-[#64748B]">/ {metrics.generalBeds.total}</span>
          </div>
          <span className="text-[10px] text-[#3B82C4] font-semibold mt-1 block">
            {metrics.generalBeds.total - generalAvailable} In Use
          </span>
        </div>

        {/* Rapid Response Teams */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAEA] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            Triage Teams
          </span>
          <div className="text-2xl font-extrabold text-[#16302A]">{metrics.emergencyTeams.activeOnDuty}</div>
          <span className="text-[10px] text-[#168A6A] font-semibold mt-1 block">Active on-shift</span>
        </div>

        {/* Ambulance Fleet */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAEA] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            Ambulances
          </span>
          <div className="text-2xl font-extrabold text-[#16302A]">
            {metrics.ambulanceFleet.available} <span className="text-xs font-normal text-[#64748B]">/ {metrics.ambulanceFleet.total}</span>
          </div>
          <span className="text-[10px] text-[#168A6A] font-semibold mt-1 block">Telemetry equipped</span>
        </div>

        {/* Oxygen Reserve */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAEA] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            Oxygen Supply
          </span>
          <div className="text-2xl font-extrabold text-[#16302A]">
            {metrics.oxygenReserves.hoursRemaining} <span className="text-xs font-normal text-[#64748B]">hrs</span>
          </div>
          <span className="text-[10px] text-[#168A6A] font-semibold mt-1 block">Cryogenic tank safe</span>
        </div>
      </div>

      {/* Interactive Hospital What-If Surge Capacity Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5EAEA]">
          <div>
            <h3 className="font-bold text-base text-[#16302A] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D97706]" />
              <span>Interactive &quot;What-If?&quot; Hospital Capacity Stress Simulator</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Simulate an influx of acute cardiovascular / metabolic patient surges to predict operational bottlenecks.
            </p>
          </div>

          <span className="text-xs bg-[#FEF3C7] text-[#D97706] font-bold px-3 py-1 rounded-full">
            Surge Factor: +{surgePercentage}%
          </span>
        </div>

        {/* Slider Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#16302A]">
            <span>Simulate Patient Influx Surge:</span>
            <span className="text-sm font-extrabold text-[#168A6A]">+{surgePercentage}% Patient Volume</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={surgePercentage}
            onChange={(e) => handleRunWhatIf(Number(e.target.value))}
            className="w-full accent-[#168A6A] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748B]">
            <span>0% (Normal Baseline)</span>
            <span>25% (Seasonal Surge)</span>
            <span>50%+ (Emergency Mass Influx)</span>
          </div>
        </div>

        {/* Projected Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Projected General Bed Demand
            </span>
            <div className="text-xl font-black text-[#16302A]">
              {Math.round(72 * (1 + surgePercentage / 100))} / 100 Beds
            </div>
            <p className="text-[11px] text-[#64748B]">
              {100 - Math.round(72 * (1 + surgePercentage / 100)) > 0
                ? `${100 - Math.round(72 * (1 + surgePercentage / 100))} remaining buffer`
                : '⚠️ Bed capacity deficit predicted'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Projected ICU Bed Demand
            </span>
            <div className="text-xl font-black text-[#DC5A5A]">
              {Math.round(13 * (1 + surgePercentage / 100))} / 20 ICU
            </div>
            <p className="text-[11px] text-[#64748B]">
              {20 - Math.round(13 * (1 + surgePercentage / 100)) > 0
                ? `${20 - Math.round(13 * (1 + surgePercentage / 100))} critical beds left`
                : '🔴 ICU OVERFLOW IMMINENT'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Hospital Stress Index
            </span>
            <div
              className={`text-xl font-black ${
                surgePercentage > 35 ? 'text-[#DC5A5A]' : surgePercentage > 15 ? 'text-[#D97706]' : 'text-[#168A6A]'
              }`}
            >
              {Math.min(100, Math.round(surgePercentage * 1.4 + 42))} / 100
            </div>
            <p className="text-[11px] text-[#64748B]">
              {surgePercentage > 35 ? 'High Alert Status' : 'Manageable Operations'}
            </p>
          </div>
        </div>

        {/* Automated System Mitigations */}
        <div className="p-4 rounded-xl bg-[#E8F7F1]/60 border border-[#168A6A]/20 space-y-2">
          <span className="text-xs font-bold text-[#168A6A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Mitigation Directives</span>
          </span>
          <ul className="text-xs text-[#16302A] space-y-1 font-medium">
            <li>• Pre-position intermediate telemetry beds for step-down triage.</li>
            <li>• Page on-call cardiology & pulmonary reserves (Dr. Vikram Seth & Dr. Preeti Rao).</li>
            <li>• Expedite outpatient discharge pipeline for 8 stabilized recovery patients.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
