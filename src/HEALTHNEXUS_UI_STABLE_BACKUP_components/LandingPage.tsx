import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  GitBranch,
  HeartPulse,
  History,
  Lock,
  Pill,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { Patient, TabType, UserRole } from '../types';

interface LandingPageProps {
  onEnterDashboard: (targetTab?: TabType) => void;
  onOpenTour: () => void;
  activePatient: Patient;
  onOpenLogin: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onOpenTour,
  activePatient,
  onOpenLogin,
}) => {
  return (
    <div className="bg-[#F8FAFA] text-[#16302A] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F7F1] border border-[#168A6A]/20 text-[#168A6A] text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#168A6A]" />
            <span>Dual-Role Healthcare Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#168A6A]" />
            <span>Patient Portal &amp; Doctor Command</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#16302A] leading-tight">
            From Patient History to{' '}
            <span className="text-[#168A6A] bg-clip-text">Predictive Care</span> &amp; Healthcare Readiness
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            <strong className="text-[#16302A]">HEALTHNEXUS AI</strong> connects patient history, medical
            reports, vitals, and mental well-being into one explainable healthcare intelligence layer with dedicated portals for patients and clinicians.
          </p>

          {/* Dual Login & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenLogin('patient')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white font-bold text-sm shadow-md shadow-[#168A6A]/20 transition-all hover:scale-[1.02]"
            >
              <User className="w-4 h-4" />
              <span>Patient Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenLogin('doctor')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md shadow-blue-700/20 transition-all hover:scale-[1.02]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Command Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenTour}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-[#E8F7F1] text-[#168A6A] border border-[#168A6A]/30 font-bold text-sm shadow-xs transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>15-Step Judge Tour</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Hero Dashboard Preview */}
        <div className="mt-12 max-w-5xl mx-auto bg-white rounded-2xl border border-[#E5EAEA] shadow-lg shadow-black/5 overflow-hidden p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E5EAEA]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#E8F7F1] flex items-center justify-center text-[#168A6A]">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#16302A]">{activePatient.name} &bull; Clinical Intelligence Feed</h3>
                <p className="text-xs text-[#64748B]">Age: {activePatient.age} &bull; {activePatient.conditions.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-ping" />
                HealthPulse: 72/100 (Needs Attention)
              </span>
              <button
                onClick={() => onEnterDashboard('overview')}
                className="text-xs font-bold text-[#168A6A] hover:underline flex items-center gap-1"
              >
                <span>Open Full Command Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA]">
              <span className="text-[11px] font-semibold text-[#64748B]">Blood Pressure</span>
              <div className="text-lg font-bold text-[#DC5A5A] mt-0.5">148/94 mmHg</div>
              <span className="text-[10px] text-[#DC5A5A] font-medium">↑ +12 mmHg from prior visit</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA]">
              <span className="text-[11px] font-semibold text-[#64748B]">HbA1c Biomarker</span>
              <div className="text-lg font-bold text-[#DC5A5A] mt-0.5">8.2 %</div>
              <span className="text-[10px] text-[#DC5A5A] font-medium">↑ +0.8% increase (was 7.4%)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA]">
              <span className="text-[11px] font-semibold text-[#64748B]">Mental Stress Index</span>
              <div className="text-lg font-bold text-[#D97706] mt-0.5">7.8 / 10</div>
              <span className="text-[10px] text-[#D97706] font-medium">↑ Acute work stress spike</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA]">
              <span className="text-[11px] font-semibold text-[#64748B]">Hospital Readiness</span>
              <div className="text-lg font-bold text-[#168A6A] mt-0.5">88 / 100</div>
              <span className="text-[10px] text-[#168A6A] font-medium">7 ICU Beds Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Central Product Loop Section */}
      <section className="py-14 bg-white border-y border-[#E5EAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16302A]">
              HEALTHNEXUS AI doesn&apos;t just show patient data.
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#168A6A]">
              It connects the dots across the complete care continuum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { num: '1', q: 'What happened?', desc: 'Longitudinal patient history, consultations & lab records' },
              { num: '2', q: 'What changed?', desc: 'Precise previous vs current delta across vitals & labs' },
              { num: '3', q: 'Why does it matter?', desc: 'Explainable clinical context & pathophysiological impact' },
              { num: '4', q: 'How is mental health?', desc: 'Daily well-being check-ins, sleep & stress correlation' },
              { num: '5', q: 'What to review?', desc: 'Specific physician conversation questions & activities' },
              { num: '6', q: 'Hospital readiness?', desc: 'Real-time bed, ICU & emergency team surge planning' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] flex flex-col justify-between hover:border-[#168A6A] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#E8F7F1] text-[#168A6A] font-bold text-xs flex items-center justify-center mb-2">
                  {step.num}
                </div>
                <h4 className="font-bold text-sm text-[#16302A] mb-1">{step.q}</h4>
                <p className="text-xs text-[#64748B] leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Core Feature Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16302A]">
            Intelligent Decision Support Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Engineered to empower patients and assist clinicians without replacing professional diagnosis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => onEnterDashboard('patient')}
            className="p-6 rounded-2xl bg-white border border-[#E5EAEA] hover:border-[#168A6A] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F1] text-[#168A6A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16302A] mb-2 group-hover:text-[#168A6A] transition-colors">
              🧠 Patient Intelligence
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Understand the complete longitudinal patient story with interactive journey timelines, conditions, allergies, and medication histories.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onEnterDashboard('reports')}
            className="p-6 rounded-2xl bg-white border border-[#E5EAEA] hover:border-[#168A6A] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#3B82C4] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16302A] mb-2 group-hover:text-[#168A6A] transition-colors">
              📄 AI Report Intelligence
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Turn unstructured PDF/image laboratory reports into structured biomarkers, reference comparisons, abnormal findings, and doctor questions.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onEnterDashboard('whatchanged')}
            className="p-6 rounded-2xl bg-white border border-[#E5EAEA] hover:border-[#168A6A] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16302A] mb-2 group-hover:text-[#168A6A] transition-colors">
              📈 What Changed?
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Detect meaningful shifts across time. Clear color-coded cards explain What Changed &rarr; Why It Matters &rarr; What to Discuss with Clinician.
            </p>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onEnterDashboard('mental')}
            className="p-6 rounded-2xl bg-white border border-[#E5EAEA] hover:border-[#168A6A] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F1] text-[#168A6A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16302A] mb-2 group-hover:text-[#168A6A] transition-colors">
              💚 Whole Health Connection
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Bridge mental well-being (mood, stress, sleep) directly with physiological parameters like blood pressure and insulin sensitivity.
            </p>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => onEnterDashboard('alerts')}
            className="p-6 rounded-2xl bg-white border border-[#E5EAEA] hover:border-[#168A6A] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#DC5A5A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16302A] mb-2 group-hover:text-[#168A6A] transition-colors">
              🚨 Nexus Alerts & Emergency Sim
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Deterministic rule-based safety triggers surface acute shifts. Includes an interactive live deterioration simulator with emergency timeline.
            </p>
          </div>

          {/* Card 6 */}
          <div
            onClick={() => onEnterDashboard('readiness')}
            className="p-6 rounded-2xl bg-white border border-[#E5EAEA] hover:border-[#168A6A] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#3B82C4] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16302A] mb-2 group-hover:text-[#168A6A] transition-colors">
              🏥 Healthcare Readiness
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Translate patient risk into hospital resource capacity: ICU occupancy, general beds, emergency teams, and interactive What-If surge modeling.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="py-12 bg-[#E8F7F1]/50 border-t border-[#168A6A]/10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#168A6A]">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Trust & Medical Safety Pledge</span>
          </div>
          <h3 className="text-xl font-bold text-[#16302A]">
            Built with Strict Clinical Decision-Support Guardrails
          </h3>
          <p className="text-xs text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            All AI outputs are framed as signals for clinical discussion rather than definitive medical diagnoses. All demo patient data is synthetic and privacy-safe.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onEnterDashboard('overview')}
              className="px-6 py-2.5 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white font-bold text-xs shadow-xs transition-all"
            >
              Launch Live Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
