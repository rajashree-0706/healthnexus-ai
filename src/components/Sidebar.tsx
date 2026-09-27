import React from 'react';
import {
  Activity,
  AlertOctagon,
  Brain,
  Building2,
  ChevronRight,
  ClipboardList,
  Compass,
  FileSpreadsheet,
  GitBranch,
  HeartPulse,
  History,
  Home,
  LayoutDashboard,
  MessageSquare,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
} from 'lucide-react';
import { TabType, UserRole } from '../types';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  emergencyActive: boolean;
  onOpenTour: () => void;
  userRole?: UserRole;
}

interface NavSection {
  title: string;
  items: {
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  emergencyActive,
  onOpenTour,
  userRole = 'patient',
}) => {
  const patientSections: NavSection[] = [
    {
      title: 'My Health Context',
      items: [
        { id: 'overview', label: 'Dashboard Overview', icon: Home },
        { id: 'patient', label: 'My Health Profile', icon: UserCheck },
        { id: 'whatchanged', label: 'What Changed?', icon: History, badge: 'Diff' },
      ],
    },
    {
      title: 'Clinical Intelligence',
      items: [
        { id: 'healthpulse', label: 'HealthPulse™ Score', icon: HeartPulse },
        { id: 'reports', label: 'My Lab Reports', icon: FileSpreadsheet },
        { id: 'medtrace', label: 'MedTrace™ Regimens', icon: Pill },
        { id: 'caregraph', label: 'CareGraph™ Topology', icon: GitBranch },
      ],
    },
    {
      title: 'Whole Health & Care',
      items: [
        { id: 'mental', label: 'Mental Well-Being', icon: Brain },
        { id: 'activities', label: 'Therapy & Breathing', icon: Sparkles },
        { id: 'chat', label: 'Nexus AI Copilot', icon: MessageSquare },
      ],
    },
    {
      title: 'Safety & Readiness',
      items: [
        {
          id: 'alerts',
          label: 'Alert & Triage Center',
          icon: AlertOctagon,
          badge: emergencyActive ? 'CRITICAL' : undefined,
          badgeColor: emergencyActive ? 'bg-rose-600 text-white' : undefined,
        },
        { id: 'readiness', label: 'Hospital Readiness', icon: Building2 },
        { id: 'simulators', label: 'Trajectory Simulator', icon: Activity },
        { id: 'aitrust', label: 'AI Trust & Safety', icon: ShieldCheck },
      ],
    },
  ];

  const doctorSections: NavSection[] = [
    {
      title: 'Clinical Triage',
      items: [
        { id: 'doctor_command', label: 'Doctor Command Center', icon: Stethoscope, badge: 'CDS' },
        { id: 'patient', label: 'Patient Record & History', icon: UserCheck },
        { id: 'whatchanged', label: 'Cross-Encounter Delta', icon: History, badge: 'Diff' },
      ],
    },
    {
      title: 'Diagnostic Support',
      items: [
        { id: 'reports', label: 'EHR & Lab Reports OCR', icon: FileSpreadsheet },
        { id: 'healthpulse', label: 'HealthPulse Analytics', icon: HeartPulse },
        { id: 'medtrace', label: 'Rx Interaction Checker', icon: Pill },
        { id: 'caregraph', label: 'Knowledge Graph Topology', icon: GitBranch },
      ],
    },
    {
      title: 'Whole Person Care',
      items: [
        { id: 'mental', label: 'Mindful Well-Being', icon: Brain },
        { id: 'activities', label: 'Patient Therapy Plan', icon: Sparkles },
        { id: 'chat', label: 'Clinical AI Copilot', icon: MessageSquare },
      ],
    },
    {
      title: 'Hospital Ops & Safety',
      items: [
        {
          id: 'alerts',
          label: 'Emergency Alert Hub',
          icon: AlertOctagon,
          badge: emergencyActive ? 'SURGE' : undefined,
          badgeColor: emergencyActive ? 'bg-rose-600 text-white' : undefined,
        },
        { id: 'readiness', label: 'ICU & Bed Surge Capacity', icon: Building2 },
        { id: 'simulators', label: 'Disease Trajectory Model', icon: Activity },
        { id: 'aitrust', label: 'Explainability & Audits', icon: ShieldCheck },
      ],
    },
  ];

  const sections = userRole === 'doctor' ? doctorSections : patientSections;

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-slate-200/80 bg-white min-h-[calc(100vh-3.75rem)] p-4 select-none">
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentTab === item.id ||
                  (userRole === 'doctor' && item.id === 'doctor_command' && currentTab === 'overview');

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/70 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                          item.badgeColor || 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Clinical Safety Disclaimer Card */}
        <div className="mt-8 p-3 rounded-xl bg-sky-50/60 border border-sky-200/60 text-slate-600 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 text-sky-800 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Clinical AI Decision Support</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-500">
            For physician-supervised clinical triage &amp; health telemetry.
          </p>
        </div>
      </div>
    </aside>
  );
};
