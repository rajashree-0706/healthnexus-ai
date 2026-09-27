import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileSpreadsheet,
  GitBranch,
  HeartPulse,
  History,
  Home,
  MessageSquare,
  Pill,
  Play,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { TabType } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenBreathing: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenBreathing,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: {
    title: string;
    subtitle: string;
    desc: string;
    tabTarget?: TabType;
    actionLabel?: string;
    isBreathingAction?: boolean;
    badge: string;
    keyTakeaway: string;
  }[] = [
    {
      title: '1. Welcome to HealthNexus AI',
      subtitle: 'Connecting Patient Intelligence to Healthcare Readiness',
      desc: 'HealthNexus AI is a unified healthcare intelligence platform. Rather than isolated data silos, it connects longitudinal patient history, lab reports, vitals, and mental well-being into an explainable decision-support engine.',
      tabTarget: 'landing',
      actionLabel: 'View Landing Page',
      badge: 'Architecture Vision',
      keyTakeaway: 'Breaks data silos to deliver continuous, explainable healthcare intelligence.',
    },
    {
      title: '2. Patient Intelligence & Profile',
      subtitle: 'Longitudinal Patient Journey Timeline',
      desc: 'Meet Ananya Sharma (52y). Review her verified medical record, active conditions (Hypertension, T2D), emergency contacts, and complete chronological medical timeline from 2024 to 2026.',
      tabTarget: 'patient',
      actionLabel: 'Inspect Patient Profile',
      badge: 'Patient Core',
      keyTakeaway: 'Provides complete longitudinal context, not just isolated snapshot numbers.',
    },
    {
      title: '3. Clinical Dashboard & 7 Vitals',
      subtitle: 'Daily Command Center with Real-Time Trends',
      desc: 'Explore the daily dashboard featuring 7 core vitals (Blood Pressure 148/94, Heart Rate, Glucose 154, SpO2, Temperature, Weight, Respiratory Rate) with instant previous vs. current deltas and status pills.',
      tabTarget: 'overview',
      actionLabel: 'Open Dashboard Overview',
      badge: 'Vitals Layer',
      keyTakeaway: 'Instant visual clarity on all 7 physiological pillars with baseline comparisons.',
    },
    {
      title: '4. HealthPulse & Explainability',
      subtitle: 'Transparent Multi-Axial Risk Intelligence (72/100)',
      desc: 'HealthPulse evaluates 5 physiological layers: Physical vitals, Lab biomarker trends, Medication adherence, Mental stress, and Nexus Burst dynamic shifts. Click "Why this score?" to see exact itemized weights.',
      tabTarget: 'healthpulse',
      actionLabel: 'Review HealthPulse Breakdown',
      badge: 'Explainable AI',
      keyTakeaway: 'Zero black-box AI: Every point deduction is mathematically explained with clear provenance.',
    },
    {
      title: '5. "What Changed?" Intelligence',
      subtitle: 'Previous Health State vs. Current Health State',
      desc: 'One of HealthNexus AI’s flagship features. For every detected physiological shift, it breaks down: 1. What Changed (Delta), 2. Why It Matters (Clinical Context), and 3. What to Discuss with Clinician.',
      tabTarget: 'whatchanged',
      actionLabel: 'Explore "What Changed?"',
      badge: 'Core Innovation',
      keyTakeaway: 'Empowers patients and clinicians with proactive, structured conversation points.',
    },
    {
      title: '6. AI Medical Report Analyzer',
      subtitle: 'Instant PDF / Image Lab Extraction with Gemini AI',
      desc: 'Upload laboratory reports or click our 1-click sample reports (Cardiometabolic Panel, Spirometry, Longevity Panel). Gemini extracts structured biomarkers, flags abnormal shifts, and suggests doctor questions.',
      tabTarget: 'reports',
      actionLabel: 'Test Report Analyzer',
      badge: 'Multimodal AI',
      keyTakeaway: 'Converts dense, unstructured PDF reports into structured, actionable clinical tables.',
    },
    {
      title: '7. MedTrace Pharmacotherapy Timeline',
      subtitle: 'Medication Adherence, Titrations & Side Effects',
      desc: 'Track prescriptions (Metformin, Telmisartan-HCTZ), adherence percentages (94%), dosage history, reported side effects, and potential drug-drug interaction warnings.',
      tabTarget: 'medtrace',
      actionLabel: 'View MedTrace Regimens',
      badge: 'Pharmacotherapy',
      keyTakeaway: 'Monitors medication adherence patterns to prevent avoidable clinical decompensation.',
    },
    {
      title: '8. CareGraph Multi-Node Map',
      subtitle: 'Relational Graph Linking Conditions to Labs & Mental Health',
      desc: 'Interactive topology showing how Patient conditions trigger physiological symptoms, lab alterations, and mental stress nodes. Filter nodes and inspect clinical rationales.',
      tabTarget: 'caregraph',
      actionLabel: 'Open CareGraph Topology',
      badge: 'Knowledge Graph',
      keyTakeaway: 'Visually maps complex multi-morbid interactions across organ systems.',
    },
    {
      title: '9. Mental Well-Being & Whole Health',
      subtitle: 'The Mind-Body Psychosomatic Axis',
      desc: 'Daily mindful check-in tool tracking mood, stress level (0-10), sleep duration (5.5h), and energy. Explicitly models how acute mental stress elevates systolic blood pressure by +12 mmHg.',
      tabTarget: 'mental',
      actionLabel: 'Inspect Whole Health Axis',
      badge: 'Whole Health',
      keyTakeaway: 'Bridges behavioral & mental well-being directly with physiological parameters.',
    },
    {
      title: '10. 2-Minute Autonomic Breathing Reset',
      subtitle: 'Interactive Box & Resonance Breathing with Audio Chimes',
      desc: 'Experience an interactive 2-minute paced breathing exercise with real-time visual expansion, timer countdown, Web Audio harmonic chimes, and automatic activity history logging.',
      isBreathingAction: true,
      actionLabel: 'Launch 2-Min Breathing',
      badge: 'Interactive Micro-Therapy',
      keyTakeaway: 'Actionable micro-interventions that actively stimulate parasympathetic vagal tone.',
    },
    {
      title: '11. Ambient Soundscape Synthesizer',
      subtitle: 'Client-Side Real-Time Calming Audio Generator',
      desc: 'Synthesize pink-noise rain, low-frequency ocean drones, and 432Hz harmonic tones generated entirely via the Web Audio API without requiring any external audio assets.',
      tabTarget: 'activities',
      actionLabel: 'Try Soundscape Player',
      badge: 'Web Audio Tech',
      keyTakeaway: 'Zero-latency, offline-capable relaxation tools designed for high accessibility.',
    },
    {
      title: '12. Nexus Alerts & Safety Triage',
      subtitle: 'Deterministic Clinical Alert Triggering',
      desc: 'Explore color-coded safety tickets (🔴 Critical, 🟠 Attention, 🟢 Stable). Every alert includes explicit clinical triggers and suggested physician mitigation protocols.',
      tabTarget: 'alerts',
      actionLabel: 'View Alert Center',
      badge: 'Safety Triage',
      keyTakeaway: 'Automated vigilance prevents dangerous asymptomatic vital slips from going unnoticed.',
    },
    {
      title: '13. Live Emergency Deterioration Simulator',
      subtitle: 'Simulate Sudden Acute Hypertensive Crisis',
      desc: 'Click the "Simulate Deterioration" button in the top navbar. Watch vital metrics spike to 184/112 mmHg, triggering an automated 5-step emergency response and hospital triage hold.',
      tabTarget: 'alerts',
      actionLabel: 'Test Emergency Simulator',
      badge: 'Interactive Simulation',
      keyTakeaway: 'Demonstrates end-to-end telemetry reactivity in high-acuity clinical scenarios.',
    },
    {
      title: '14. Healthcare Readiness & What-If Surge',
      subtitle: 'Hospital ICU & Bed Capacity Stress Modeling',
      desc: 'Bridge patient intelligence into hospital operations. Adjust the Community Surge Slider (+0% to +50%) to model ICU bed deficits, general bed demand, and automated hospital mitigation directives.',
      tabTarget: 'readiness',
      actionLabel: 'Run Hospital What-If',
      badge: 'Macro Readiness',
      keyTakeaway: 'Connects micro patient risk to macro hospital surge capacity and resource allocation.',
    },
    {
      title: '15. AI Trust, Provenance & Guardrails',
      subtitle: 'Auditable Data Provenance & Safety Principles',
      desc: 'Inspect exact sensor/lab timestamps, algorithmic scoring weights, and clinical guideline citations (ACC/AHA, ADA, KDIGO). Confirms 100% synthetic, HIPAA-safe hackathon data.',
      tabTarget: 'aitrust',
      actionLabel: 'Inspect Trust Center',
      badge: 'Trust & Governance',
      keyTakeaway: 'Built strictly on responsible AI principles with verifiable medical evidence.',
    },
  ];

  if (!isOpen) return null;

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleActionClick = () => {
    if (current.isBreathingAction) {
      onClose();
      onOpenBreathing();
    } else if (current.tabTarget) {
      onNavigateTab(current.tabTarget);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5EAEA] relative overflow-hidden flex flex-col justify-between space-y-6 animate-fadeIn">
        {/* Header & Step Counter */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F1] text-[#168A6A] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#16302A]">Judge Presentation Guide</span>
                <span className="bg-[#168A6A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">Complete End-to-End Feature Demonstration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#64748B] hover:text-[#DC5A5A] rounded-xl hover:bg-[#FEE2E2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#168A6A] h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#E8F7F1] text-[#168A6A]">
              {current.badge}
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#16302A] tracking-tight">{current.title}</h3>
            <h4 className="text-sm font-bold text-[#168A6A] mt-0.5">{current.subtitle}</h4>
          </div>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{current.desc}</p>

          <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] flex items-start gap-2.5 text-xs text-[#16302A]">
            <Sparkles className="w-4 h-4 text-[#168A6A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#168A6A]">Judge Takeaway:</strong> {current.keyTakeaway}
            </div>
          </div>
        </div>

        {/* Navigation & Action Footer */}
        <div className="pt-4 border-t border-[#E5EAEA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFA] hover:bg-[#E5EAEA] disabled:opacity-30 text-[#16302A] text-xs font-bold border border-[#E5EAEA] transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 rounded-xl bg-[#168A6A] hover:bg-[#127257] disabled:opacity-30 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {current.actionLabel && (
            <button
              onClick={handleActionClick}
              className="px-4 py-2 rounded-xl bg-[#E8F7F1] hover:bg-[#d6f2e7] text-[#168A6A] border border-[#168A6A]/30 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>{current.actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
