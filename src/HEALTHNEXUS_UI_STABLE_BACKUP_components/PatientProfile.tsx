import React from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplet,
  FileSpreadsheet,
  Heart,
  HeartPulse,
  Mail,
  MapPin,
  Pill,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
} from 'lucide-react';
import { Patient } from '../types';

interface PatientProfileProps {
  patient: Patient;
  onNavigate: (tab: any) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onNavigate,
}) => {
  const journeyTimeline = [
    {
      date: 'Jan 2024',
      title: 'Initial Diagnosis & Baseline Screening',
      desc: 'Diagnosed with Essential Hypertension (Stage 1) and Type 2 Diabetes Mellitus following routine executive health checkup. Baseline HbA1c: 6.8%, BP: 138/88.',
      type: 'diagnosis',
    },
    {
      date: 'Mar 2024',
      title: 'Pharmacotherapy Protocol Initiation',
      desc: 'Started on Metformin 500mg BID and Telmisartan 40mg OD. Nutrition and exercise counseling initiated.',
      type: 'medication',
    },
    {
      date: 'Nov 2024',
      title: 'Annual Review & Optimal Stability',
      desc: 'HbA1c stabilized at 7.1%. Good blood pressure control (130/82 mmHg). Renal markers within normal limits.',
      type: 'checkup',
    },
    {
      date: 'May 2025',
      title: 'Medication Adjustment',
      desc: 'Telmisartan titrated to 40mg + Hydrochlorothiazide 12.5mg combination due to mild systolic elevation.',
      type: 'medication',
    },
    {
      date: 'Aug 2026 (Recent)',
      title: 'Cardiometabolic Biomarker Elevation',
      desc: 'Latest lab reports reveal upward shift in HbA1c (8.2%), fasting blood glucose (154 mg/dL), and microalbuminuria (UACR 42 mg/g).',
      type: 'lab',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#168A6A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">Patient Profile & Clinical History</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Longitudinal patient record, biometric demographics, and verified clinical history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#E8F7F1] text-[#168A6A] px-3 py-1.5 rounded-xl">
            Verified Record &bull; {patient.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#168A6A] to-[#22A07C] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-[#16302A]">{patient.name}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EAF4FB] text-[#3B82C4]">
                  {patient.gender}, {patient.age} yrs
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Primary Physician: <strong>{patient.primaryPhysician}</strong> &bull; {patient.bloodGroup} Blood Type
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('whatchanged')}
              className="px-4 py-2 rounded-xl bg-[#E8F7F1] hover:bg-[#d6f2e7] text-[#168A6A] text-xs font-bold border border-[#168A6A]/20 transition-all flex items-center gap-1"
            >
              <span>See Health Changes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Demographics & Clinical Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Active Medical Conditions
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {patient.conditions.map((cond, i) => (
                <span key={i} className="text-xs font-bold text-[#DC5A5A] bg-[#FEE2E2] px-2 py-0.5 rounded-md">
                  {cond}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Known Allergies
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {patient.allergies.map((all, i) => (
                <span key={i} className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md">
                  {all}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Emergency Contact
            </span>
            <p className="text-xs font-bold text-[#16302A] mt-1">
              {typeof patient.emergencyContact === 'string'
                ? patient.emergencyContact
                : `${patient.emergencyContact.name} (${patient.emergencyContact.relationship})`}
            </p>
            <p className="text-[11px] text-[#64748B]">
              {typeof patient.emergencyContact === 'string'
                ? 'Immediate family responder'
                : patient.emergencyContact.phone}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              HealthPulse Baseline
            </span>
            <div className="text-lg font-black text-[#168A6A] mt-0.5">{patient.healthPulseScore} / 100</div>
            <p className="text-[11px] text-[#64748B]">Last updated today</p>
          </div>
        </div>
      </div>

      {/* Longitudinal Journey Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#168A6A]" />
            <h3 className="font-bold text-base text-[#16302A]">Longitudinal Clinical Care Journey</h3>
          </div>
          <span className="text-xs text-[#64748B]">Chronological Patient Milestones</span>
        </div>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5EAEA]">
          {journeyTimeline.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-[#168A6A] ring-4 ring-[#E8F7F1]" />
              <div className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <h4 className="font-bold text-sm text-[#16302A]">{item.title}</h4>
                  <span className="text-[#168A6A] font-bold text-xs bg-white px-2.5 py-0.5 rounded-full border border-[#E5EAEA]">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
