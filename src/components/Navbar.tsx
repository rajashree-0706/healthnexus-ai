import React from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  Compass,
  HeartPulse,
  LogOut,
  Search,
  Sparkles,
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 select-none shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 text-left group transition-all shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 font-sans">
                  HEALTHNEXUS
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wider border border-emerald-200/60">
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
              className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-xs pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-slate-400"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Role Indicator & Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Button */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
              userRole === 'doctor'
                ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border-sky-200'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
            }`}
            title={`Currently in ${userRole === 'doctor' ? 'Doctor' : 'Patient'} Mode. Click to switch.`}
          >
            {userRole === 'doctor' ? (
              <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
            ) : (
              <User className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="hidden sm:inline">
              {userRole === 'doctor' ? 'Doctor Mode' : 'Patient Mode'}
            </span>
            <ArrowLeftRight className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Patient / Doctor Profile Selector */}
          {userRole === 'patient' ? (
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1 transition-colors">
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <select
                  value={activePatient.id}
                  onChange={(e) => {
                    const p = patients.find((pat) => pat.id === e.target.value);
                    if (p) onSelectPatient(p);
                  }}
                  className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
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
            <div className="hidden sm:flex items-center gap-1.5 bg-sky-50/80 border border-sky-200/80 rounded-xl px-2.5 py-1 text-xs font-semibold text-sky-900">
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
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
            className="hidden md:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Interactive Demo Presentation"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tour</span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => setCurrentTab('alerts')}
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Nexus Alerts"
          >
            <Bell className="w-4 h-4" />
            {emergencyActive && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            )}
          </button>

          {/* Dedicated Login / Role Switch Portal Button */}
          <button
            onClick={onOpenLogin}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Switch User / Open Login Screen"
          >
            <LogOut className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
