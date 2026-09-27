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
        { id: 'whatchanged', label: 'Trajectory Delta (Diff)', icon: History, badge: 'Diff' },
      ],
    },
    {
      title: 'Diagnostic Support',
      items: [
        { id: 'healthpulse', label: 'HealthPulse™ Engine', icon: HeartPulse },
        { id: 'reports', label: 'AI Lab Analyzer', icon: FileSpreadsheet },
        { id: 'medtrace', label: 'MedTrace™ Titration', icon: Pill },
        { id: 'caregraph', label: 'CareGraph™ Topology', icon: GitBranch },
      ],
    },
    {
      title: 'Whole Health & Comorbidities',
      items: [
        { id: 'mental', label: 'Autonomic & Stress Index', icon: Brain },
        { id: 'chat', label: 'Clinical AI Copilot', icon: MessageSquare },
      ],
    },
    {
      title: 'Hospital Operations',
      items: [
        {
          id: 'alerts',
          label: 'Alert & Emergency Queue',
          icon: AlertOctagon,
          badge: emergencyActive ? 'CRITICAL' : undefined,
          badgeColor: emergencyActive ? 'bg-rose-600 text-white' : undefined,
        },
        { id: 'readiness', label: 'Hospital Surge Readiness', icon: Building2 },
        { id: 'simulators', label: 'What-If Risk Simulator', icon: Activity },
        { id: 'aitrust', label: 'CDS Provenance & Trust', icon: ShieldCheck },
      ],
    },
  ];

  const sections = userRole === 'doctor' ? doctorSections : patientSections;

  return (
    <aside className="w-64 shrink-0 bg-slate-50/80 border-r border-slate-200 min-h-[calc(100vh-61px)] flex flex-col justify-between hidden md:flex select-none">
      <div className="p-3.5 space-y-5 overflow-y-auto">
        {/* Role header chip */}
        <div
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-between border ${
            userRole === 'doctor'
              ? 'bg-blue-50/80 border-blue-200/80 text-blue-900'
              : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {userRole === 'doctor' ? (
              <Stethoscope className="w-3.5 h-3.5 text-blue-700" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span>{userRole === 'doctor' ? 'Clinician Command' : 'Patient Portal'}</span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-white px-1.5 py-0.2 rounded border border-slate-200">
            Active
          </span>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentTab === item.id ||
                  (userRole === 'doctor' && item.id === 'doctor_command' && currentTab === 'overview');
                const isEmergencyAlert = item.id === 'alerts' && emergencyActive;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'doctor_command') {
                        setCurrentTab('doctor_command');
                      } else {
                        setCurrentTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-emerald-600'
                            : isEmergencyAlert
                            ? 'text-rose-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor ||
                          (isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer info box */}
      <div className="p-3.5 border-t border-slate-200 bg-white space-y-2">
        <button
          onClick={onOpenTour}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Interactive Demo Tour</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
        </button>

        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {userRole === 'doctor' ? 'Physician Decision Support' : 'Personal Health Intelligence'}
            </span>
          </div>
          <p className="text-[10px] leading-tight text-slate-400">
            {userRole === 'doctor'
              ? 'CDS engine with explicit confidence scores and SOAP documentation.'
              : 'Empowering patients to understand changes and prepare for doctor visits.'}
          </p>
        </div>
      </div>
    </aside>
  );
};

