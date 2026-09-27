import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Info,
  Pill,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { MedicationItem, Patient } from '../types';

interface MedTraceViewProps {
  patient: Patient;
  medications: MedicationItem[];
}

export const MedTraceView: React.FC<MedTraceViewProps> = ({
  patient,
  medications,
}) => {
  const [selectedMed, setSelectedMed] = useState<MedicationItem>(medications[0] || null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-6 h-6 text-[#168A6A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">
              MEDTRACE &bull; Medication Intelligence & Adherence Timeline
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Track pharmacotherapy history, titration milestones, reported side effects, and adherence trends over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#E8F7F1] text-[#168A6A] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Adherence Decision Support</span>
          </span>
        </div>
      </div>

      {/* Grid of Medications & Deep-Dive Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left List of Active Medications */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-sm text-[#16302A]">Current Prescriptions & Regimens</h3>

          <div className="space-y-2.5">
            {medications.map((med) => {
              const isSelected = selectedMed?.id === med.id;
              const isReview = med.status === 'Needs Review';
              return (
                <div
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F7F1]/30 border-[#168A6A] shadow-xs'
                      : 'bg-white border-[#E5EAEA] hover:border-[#168A6A]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isReview ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#E8F7F1] text-[#168A6A]'
                        }`}
                      >
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#16302A]">{med.name}</h4>
                        <p className="text-xs text-[#64748B]">{med.dosage} &bull; {med.frequency}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isReview ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#E8F7F1] text-[#168A6A]'
                      }`}
                    >
                      {med.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Adherence: <strong>{med.adherencePercentage}%</strong></span>
                    <span className="text-[#168A6A] font-semibold flex items-center gap-1">
                      <span>Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] text-[11px] text-[#64748B] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#16302A]">
              <Info className="w-3.5 h-3.5 text-[#168A6A]" />
              <span>Prescription Safety Notice</span>
            </div>
            <p>
              HealthNexus AI does NOT prescribe or alter dosages. All dosage optimizations must be authorized by your primary physician.
            </p>
          </div>
        </div>

        {/* Right Selected Medication Deep Dive & Timeline */}
        {selectedMed && (
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5">
            {/* Top Detail */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5EAEA]">
              <div>
                <h3 className="font-bold text-lg text-[#16302A]">{selectedMed.name}</h3>
                <p className="text-xs text-[#64748B]">
                  Generic: <strong>{selectedMed.genericName}</strong> &bull; Prescribed by {selectedMed.prescribedBy}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Adherence Rate
                </span>
                <span className="text-xl font-black text-[#168A6A]">{selectedMed.adherencePercentage}%</span>
              </div>
            </div>

            {/* Purpose & Clinical Advisory */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Therapeutic Purpose
                </span>
                <p className="text-xs text-[#16302A] font-medium leading-relaxed">{selectedMed.purpose}</p>
              </div>

              {selectedMed.safetyAdvisory && (
                <div className="p-3 rounded-xl bg-[#E8F7F1]/60 border border-[#168A6A]/20 text-xs text-[#16302A]">
                  <strong>Safety Advisory:</strong> {selectedMed.safetyAdvisory}
                </div>
              )}
            </div>

            {/* Longitudinal Timeline */}
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-3">
                Medication Progression Timeline
              </span>

              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5EAEA]">
                {selectedMed.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#168A6A] ring-4 ring-[#E8F7F1]" />
                    <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#16302A]">{event.event}</span>
                        <span className="text-[#64748B] text-[11px]">{event.date}</span>
                      </div>
                      <p className="text-xs text-[#64748B]">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reported Side Effects & Drug Interactions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5EAEA]">
              <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Reported Tolerability & Side Effects
                </span>
                <ul className="text-xs text-[#16302A] space-y-1">
                  {selectedMed.reportedSideEffects.map((se, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      <span>{se}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Potential Interactions
                </span>
                <ul className="text-xs text-[#16302A] space-y-1">
                  {selectedMed.potentialInteractions.map((pi, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82C4]" />
                      <span>{pi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
