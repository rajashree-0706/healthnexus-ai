import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Heart,
  HeartPulse,
  History,
  Moon,
  Pill,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Patient } from '../types';

interface PatientJourneySimulatorProps {
  patient: Patient;
}

export const PatientJourneySimulator: React.FC<PatientJourneySimulatorProps> = ({
  patient,
}) => {
  const [stressFactor, setStressFactor] = useState<number>(0); // -3 to +3
  const [adherenceLevel, setAdherenceLevel] = useState<number>(90); // 50% to 100%
  const [sleepDelta, setSleepDelta] = useState<number>(0); // -3 to +3 hrs
  const [dailyWalks, setDailyWalks] = useState<boolean>(true);
  const [delayedFollowup, setDelayedFollowup] = useState<boolean>(false);

  // Compute dynamic simulator outcomes
  const baseScore = patient.healthPulseScore; // 72
  let simScore = baseScore;

  // Stress impact
  simScore -= stressFactor * 3.5;

  // Adherence impact
  if (adherenceLevel < 80) {
    simScore -= (80 - adherenceLevel) * 0.6;
  } else {
    simScore += (adherenceLevel - 80) * 0.3;
  }

  // Sleep impact
  simScore += sleepDelta * 2.2;

  // Daily walks
  if (dailyWalks) simScore += 4;
  else simScore -= 4;

  // Delayed followup
  if (delayedFollowup) simScore -= 8;

  simScore = Math.max(25, Math.min(96, Math.round(simScore)));

  // Projected BP
  const baseSystolic = 148;
  let projSystolic = baseSystolic + stressFactor * 4 - (dailyWalks ? 4 : -3) - sleepDelta * 2;
  if (adherenceLevel < 75) projSystolic += 12;

  // Projected HbA1c
  let projA1c = 8.2 + (delayedFollowup ? 0.6 : -0.3) - (dailyWalks ? 0.3 : 0) - (adherenceLevel >= 90 ? 0.4 : -0.5);

  const resetAll = () => {
    setStressFactor(0);
    setAdherenceLevel(90);
    setSleepDelta(0);
    setDailyWalks(true);
    setDelayedFollowup(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#168A6A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">
              Patient Health Trajectory Simulator (&quot;What If?&quot;)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Test hypothetical lifestyle, stress, adherence, and intervention changes to forecast clinical trajectories.
          </p>
        </div>

        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFA] hover:bg-[#E8F7F1] text-[#168A6A] border border-[#E5EAEA] text-xs font-bold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
            <h3 className="font-bold text-sm text-[#16302A] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#168A6A]" />
              <span>Simulated Variables & Lifestyle Factors</span>
            </h3>
            <span className="text-xs text-[#64748B]">Real-time feedback</span>
          </div>

          {/* Stress Factor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#16302A]">
              <span>Stress / Autonomic Arousal:</span>
              <span className="font-extrabold text-[#DC5A5A]">
                {stressFactor > 0 ? `+${stressFactor * 15}% High Stress` : stressFactor < 0 ? `${stressFactor * 15}% Calmer` : 'Baseline (Current)'}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="1"
              value={stressFactor}
              onChange={(e) => setStressFactor(Number(e.target.value))}
              className="w-full accent-[#168A6A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>-30% (Stress Reduced)</span>
              <span>Baseline</span>
              <span>+30% (Severe Pressure)</span>
            </div>
          </div>

          {/* Medication Adherence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#16302A]">
              <span>Medication Adherence Rate:</span>
              <span className="font-extrabold text-[#168A6A]">{adherenceLevel}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={adherenceLevel}
              onChange={(e) => setAdherenceLevel(Number(e.target.value))}
              className="w-full accent-[#168A6A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>50% (Frequent Misses)</span>
              <span>75% (Occasional)</span>
              <span>100% (Strict Compliance)</span>
            </div>
          </div>

          {/* Sleep Delta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#16302A]">
              <span>Sleep Hours Adjustment:</span>
              <span className="font-extrabold text-[#3B82C4]">
                {sleepDelta > 0 ? `+${sleepDelta} hrs sleep` : sleepDelta < 0 ? `${sleepDelta} hrs restricted` : 'Current (5.5 hrs)'}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2.5"
              step="0.5"
              value={sleepDelta}
              onChange={(e) => setSleepDelta(Number(e.target.value))}
              className="w-full accent-[#168A6A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>-2 hrs (Deprived)</span>
              <span>Current</span>
              <span>+2.5 hrs (Restorative 8h)</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-[#E5EAEA]">
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-[#F8FAFA] transition-colors">
              <div>
                <span className="text-xs font-bold text-[#16302A] block">Daily 20-Min Mindful Walks</span>
                <span className="text-[11px] text-[#64748B]">Improves nitric oxide & glycemic uptake</span>
              </div>
              <input
                type="checkbox"
                checked={dailyWalks}
                onChange={(e) => setDailyWalks(e.target.checked)}
                className="w-4 h-4 accent-[#168A6A] rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-[#F8FAFA] transition-colors">
              <div>
                <span className="text-xs font-bold text-[#16302A] block">Delay Physician Follow-up by 6 Months</span>
                <span className="text-[11px] text-[#64748B]">Lack of medication titration & monitoring</span>
              </div>
              <input
                type="checkbox"
                checked={delayedFollowup}
                onChange={(e) => setDelayedFollowup(e.target.checked)}
                className="w-4 h-4 accent-[#DC5A5A] rounded"
              />
            </label>
          </div>
        </div>

        {/* Projected Outcomes Column */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
              <h3 className="font-bold text-sm text-[#16302A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#168A6A]" />
                <span>Simulated HealthPulse Forecast</span>
              </h3>
              <span className="text-xs text-[#64748B]">6-Month Projection</span>
            </div>

            {/* Simulated Score Gauge */}
            <div className="my-5 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#E8F7F1] via-white to-[#EAF4FB] border border-[#168A6A]/20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Projected HealthPulse
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-black text-[#16302A]">{simScore}</span>
                  <span className="text-xs text-[#64748B]">/ 100</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      simScore >= 80
                        ? 'bg-[#E8F7F1] text-[#168A6A]'
                        : simScore >= 65
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#FEE2E2] text-[#DC5A5A]'
                    }`}
                  >
                    {simScore >= 80 ? 'Optimal Control' : simScore >= 65 ? 'Moderate Risk' : 'High Alert'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#64748B] block">Baseline Delta</span>
                <span
                  className={`text-base font-extrabold ${
                    simScore > baseScore
                      ? 'text-[#168A6A]'
                      : simScore < baseScore
                      ? 'text-[#DC5A5A]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {simScore >= baseScore ? `+${simScore - baseScore}` : `${simScore - baseScore}`} pts
                </span>
              </div>
            </div>

            {/* Projected Key Biomarkers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Projected Blood Pressure
                </span>
                <div className="text-lg font-black text-[#16302A]">{Math.round(projSystolic)}/90 mmHg</div>
                <p className="text-[10px] text-[#64748B]">
                  {projSystolic < 135 ? '🟢 Under control' : '🟠 Elevated pressure'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Projected HbA1c
                </span>
                <div className="text-lg font-black text-[#16302A]">{projA1c.toFixed(1)} %</div>
                <p className="text-[10px] text-[#64748B]">
                  {projA1c < 7.5 ? '🟢 Good glycemic target' : '🔴 Sub-optimal control'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] text-[11px] text-[#64748B]">
            <strong>Clinical Simulation Note:</strong> Trajectory estimates model synergistic cardiovascular and endocrine feedback loops to educate patients on the profound value of medication consistency and stress regulation.
          </div>
        </div>
      </div>
    </div>
  );
};
