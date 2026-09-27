import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  HeartPulse,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { DoctorProfile, Patient, UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, patient?: Patient, doctor?: DoctorProfile) => void;
  patients: Patient[];
  doctors: DoctorProfile[];
  defaultRole?: UserRole;
  onCancel?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  patients,
  doctors,
  defaultRole = 'patient',
  onCancel,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'p-01');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc-01');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedRole === 'patient') {
        const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
        onLoginSuccess('patient', patient, undefined);
      } else {
        const doctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
        onLoginSuccess('doctor', undefined, doctor);
      }
    }, 400);
  };

  const handleQuickPatientLogin = (patient: Patient) => {
    setSelectedRole('patient');
    setSelectedPatientId(patient.id);
    onLoginSuccess('patient', patient, undefined);
  };

  const handleQuickDoctorLogin = (doctor: DoctorProfile) => {
    setSelectedRole('doctor');
    setSelectedDoctorId(doctor.id);
    onLoginSuccess('doctor', undefined, doctor);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-700 text-white shadow-sm mb-2">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            HEALTHNEXUS <span className="text-emerald-700">AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Explainable Healthcare Intelligence & Decision Support Layer
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
          <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'patient'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Patient Portal Login</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'doctor'
                  ? 'bg-white text-blue-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Doctor Command Login</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Context Banner */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                selectedRole === 'patient'
                  ? 'bg-emerald-50/60 border-emerald-200/70 text-emerald-900'
                  : 'bg-blue-50/60 border-blue-200/70 text-blue-900'
              }`}
            >
              <ShieldCheck
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  selectedRole === 'patient' ? 'text-emerald-700' : 'text-blue-700'
                }`}
              />
              <div>
                <p className="font-bold">
                  {selectedRole === 'patient'
                    ? 'Patient Health Portal Access'
                    : 'Clinician Decision Support Command Center'}
                </p>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  {selectedRole === 'patient'
                    ? 'View your personalized HealthPulse™ score, AI lab reports, daily vitals, and holistic well-being check-ins.'
                    : 'Access multi-patient triage, risk stratification, clinical order sets, AI SOAP note generation, and hospital readiness.'}
                </p>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {selectedRole === 'patient'
                    ? 'Quick 1-Click Patient Profiles'
                    : 'Quick 1-Click Clinician Profiles'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Demo Ready
                </span>
              </div>

              {selectedRole === 'patient' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {patients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleQuickPatientLogin(p)}
                      className={`p-3 rounded-xl border text-left transition-all group hover:border-emerald-500 hover:shadow-xs ${
                        selectedPatientId === p.id
                          ? 'bg-emerald-50/40 border-emerald-500 ring-1 ring-emerald-500/20'
                          : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src={p.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                          alt={p.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700">
                            {p.name.split(' ')[0]}
                          </p>
                          <span className="text-[10px] text-slate-500 font-medium block truncate">
                            {p.age}y &bull; {p.gender}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-600 truncate font-medium">
                        {p.conditions[0] || 'Wellness'}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px]">
                        <span
                          className={`font-semibold px-1.5 py-0.2 rounded-full ${
                            p.riskLevel === 'elevated'
                              ? 'bg-amber-100 text-amber-800'
                              : p.riskLevel === 'moderate'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.riskLevel}
                        </span>
                        <span className="text-slate-400 font-mono">Score: {p.healthPulseScore}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {doctors.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleQuickDoctorLogin(doc)}
                      className={`p-3 rounded-xl border text-left transition-all group hover:border-blue-500 hover:shadow-xs ${
                        selectedDoctorId === doc.id
                          ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500/20'
                          : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100'}
                          alt={doc.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700">
                            {doc.name.split(',')[0]}
                          </p>
                          <span className="text-[10px] text-slate-500 font-medium block truncate">
                            {doc.specialty.split('&')[0]}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-600 truncate font-medium">
                        {doc.title}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px]">
                        <span className="bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-full">
                          {doc.onDutyStatus}
                        </span>
                        <span className="text-slate-500 font-medium">{doc.activePatientCount} Pts</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {selectedRole === 'patient' ? 'Patient Email / Health ID' : 'Medical License / Physician ID'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'patient'
                        ? 'ananya.sharma@healthnexus.org'
                        : 'dr.sengupta.md@apexhealth.org'
                    }
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password / Security PIN
                  </label>
                  <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">
                    Forgot PIN?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Keep session active</span>
                </label>
                <span className="text-[11px] text-slate-400">HIPAA & GDPR Enforced</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'patient'
                    ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                    : 'bg-blue-700 hover:bg-blue-800 shadow-blue-700/20'
                }`}
              >
                {isSubmitting ? (
                  <span>Authenticating secure credentials...</span>
                ) : (
                  <>
                    <span>
                      {selectedRole === 'patient'
                        ? 'Enter Patient Health Portal'
                        : 'Launch Doctor Command Center'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Back Button if Cancel is allowed */}
        {onCancel && (
          <div className="text-center mt-4">
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
            >
              &larr; Return to Public Landing Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
