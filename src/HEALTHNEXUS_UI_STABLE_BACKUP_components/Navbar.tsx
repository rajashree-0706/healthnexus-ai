import React from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  Compass,
  HeartPulse,
  LogOut,
  Search,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-react';
import { DoctorProfile, Patient, TabType, UserRole } from '../types';

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  emergencyActive: boolean;
  onToggleEmergency: () => void;
  onOpenTour: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: UserRole;
  activeDoctor: DoctorProfile;
  onToggleRole: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  patients,
  activePatient,
  onSelectPatient,
  emergencyActive,
  onToggleEmergency,
  onOpenTour,
  searchQuery,
  setSearchQuery,
  userRole,
  activeDoctor,
  onToggleRole,
  onOpenLogin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-2.5 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 text-left group transition-all shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900">HEALTHNEXUS</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded tracking-wider">
                  AI
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                userRole === 'doctor'
                  ? 'Search triage, patients, ICD-10, vitals...'
                  : 'Search biomarkers, vitals, medications...'
              }
              className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-8 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Role Indicator & Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Button */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs border ${
              userRole === 'doctor'
                ? 'bg-blue-50 text-blue-900 hover:bg-blue-100 border-blue-200'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-emerald-200'
            }`}
            title={`Currently in ${userRole === 'doctor' ? 'Doctor' : 'Patient'} Mode. Click to switch.`}
          >
            {userRole === 'doctor' ? (
              <Stethoscope className="w-3.5 h-3.5 text-blue-700" />
            ) : (
              <User className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span className="hidden sm:inline">
              {userRole === 'doctor' ? 'Doctor Mode' : 'Patient Mode'}
            </span>
            <ArrowLeftRight className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Patient / Doctor Profile Selector */}
          {userRole === 'patient' ? (
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <select
                  value={activePatient.id}
                  onChange={(e) => {
                    const p = patients.find((pat) => pat.id === e.target.value);
                    if (p) onSelectPatient(p);
                  }}
                  className="bg-transparent text-slate-900 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.split(' ')[0]} ({p.conditions[0]?.split(' ')[0] || 'Patient'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 bg-blue-50/70 border border-blue-200/80 rounded-lg px-2 py-1 text-xs font-semibold text-blue-900">
              <img
                src={activeDoctor.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100'}
                alt={activeDoctor.name}
                className="w-4 h-4 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="truncate max-w-[120px]">{activeDoctor.name.split(',')[0]}</span>
            </div>
          )}

          {/* Emergency Crisis Trigger */}
          <button
            onClick={onToggleEmergency}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              emergencyActive
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
            title="Simulate Acute Deterioration Event"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${emergencyActive ? 'text-white' : 'text-amber-600'}`} />
            <span>{emergencyActive ? 'Crisis Active' : 'Simulate Crisis'}</span>
          </button>

          {/* Demo Tour Button */}
          <button
            onClick={onOpenTour}
            className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
            title="Interactive Demo Presentation"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tour</span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => setCurrentTab('alerts')}
            className="relative p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Nexus Alerts"
          >
            <Bell className="w-4 h-4" />
            {emergencyActive && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            )}
          </button>

          {/* Dedicated Login / Role Switch Portal Button */}
          <button
            onClick={onOpenLogin}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Switch User / Open Login Screen"
          >
            <LogOut className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

