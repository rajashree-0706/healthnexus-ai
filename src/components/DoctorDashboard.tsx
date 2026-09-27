import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Brain,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  HeartPulse,
  History,
  Info,
  Layers,
  MessageSquare,
  Pill,
  Plus,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import {
  ClinicalOrder,
  DoctorProfile,
  HealthChangeItem,
  HospitalReadinessMetrics,
  MedicalReport,
  MedicationItem,
  NexusAlert,
  Patient,
  PatientVitals,
  RiskLevel,
  SoapNote,
  TabType,
} from '../types';
import { MOCK_CLINICAL_ORDERS, MOCK_SOAP_NOTES } from '../data/mockData';

interface DoctorDashboardProps {
  doctor: DoctorProfile;
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  vitals: PatientVitals;
  reports: MedicalReport[];
  whatChangedList: HealthChangeItem[];
  medications: MedicationItem[];
  alerts: NexusAlert[];
  hospitalReadiness: HospitalReadinessMetrics;
  onNavigate: (tab: TabType) => void;
  emergencyActive: boolean;
  onToggleEmergency: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctor,
  patients,
  activePatient,
  onSelectPatient,
  vitals,
  reports,
  whatChangedList,
  medications,
  alerts,
  hospitalReadiness,
  onNavigate,
  emergencyActive,
  onToggleEmergency,
}) => {
  const [filterRisk, setFilterRisk] = useState<'all' | 'critical_elevated' | 'moderate' | 'low'>('all');
  const [rosterSearch, setRosterSearch] = useState('');
  const [copiedSoap, setCopiedSoap] = useState(false);
  const [savedSoap, setSavedSoap] = useState(false);
  const [orderType, setOrderType] = useState<'prescription' | 'lab_order' | 'teleconsult'>('prescription');
  const [orderTitle, setOrderTitle] = useState('');
  const [orderDetails, setOrderDetails] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Orders and SOAP Note state for active patient
  const [patientOrders, setPatientOrders] = useState<ClinicalOrder[]>(
    MOCK_CLINICAL_ORDERS[activePatient.id] || []
  );

  const initialSoap = MOCK_SOAP_NOTES[activePatient.id] || {
    patientId: activePatient.id,
    doctorName: doctor.name,
    date: new Date().toISOString().split('T')[0],
    subjective: `${activePatient.age}yo ${activePatient.gender.toLowerCase()} presents with ${activePatient.conditions.join(
      ', '
    )}. Patient adheres to current regimen.`,
    objective: `BP ${vitals.bloodPressure.combinedDisplay}, HR ${vitals.heartRate.currentValue} bpm, SpO2 ${vitals.spO2.currentValue}%, Glucose ${vitals.bloodGlucose.currentValue} mg/dL.`,
    assessment: `1. Chronic management of ${activePatient.conditions[0]}. Risk level: ${activePatient.riskLevel}.`,
    plan: `1. Maintain current pharmacotherapy.\n2. Routine follow-up in 4 weeks.\n3. Track daily vitals on HealthNexus.`,
    differentialConsiderations: ['Routine stable progression', 'Medication tolerance monitoring'],
  };

  const [soapNote, setSoapNote] = useState<SoapNote>(initialSoap);

  // Keep soap note in sync when patient changes
  React.useEffect(() => {
    setPatientOrders(MOCK_CLINICAL_ORDERS[activePatient.id] || []);
    setSoapNote(
      MOCK_SOAP_NOTES[activePatient.id] || {
        patientId: activePatient.id,
        doctorName: doctor.name,
        date: new Date().toISOString().split('T')[0],
        subjective: `${activePatient.age}yo ${activePatient.gender.toLowerCase()} with ${activePatient.conditions.join(
          ', '
        )}.`,
        objective: `BP ${vitals.bloodPressure.combinedDisplay}, HR ${vitals.heartRate.currentValue} bpm, Glucose ${vitals.bloodGlucose.currentValue} mg/dL.`,
        assessment: `Primary: ${activePatient.conditions[0]}. HealthPulse: ${activePatient.healthPulseScore}/100.`,
        plan: `1. Review vitals & lab trajectories.\n2. Adjust therapeutic dosage if indicated.`,
        differentialConsiderations: ['Essential chronic monitoring'],
      }
    );
  }, [activePatient.id, doctor.name, vitals]);

  // Filtered Patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      p.conditions.some((c) => c.toLowerCase().includes(rosterSearch.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterRisk === 'critical_elevated') return p.riskLevel === 'critical' || p.riskLevel === 'elevated';
    if (filterRisk === 'moderate') return p.riskLevel === 'moderate';
    if (filterRisk === 'low') return p.riskLevel === 'low';
    return true;
  });

  const handleCopySoap = () => {
    const formatted = `CLINICAL SOAP NOTE\nPatient: ${activePatient.name} (ID: ${activePatient.id})\nClinician: ${soapNote.doctorName}\nDate: ${soapNote.date}\n\n[SUBJECTIVE]\n${soapNote.subjective}\n\n[OBJECTIVE]\n${soapNote.objective}\n\n[ASSESSMENT]\n${soapNote.assessment}\n\n[PLAN]\n${soapNote.plan}\n\n[DIFFERENTIAL CONSIDERATIONS]\n${soapNote.differentialConsiderations.join('\n- ')}`;
    navigator.clipboard.writeText(formatted);
    setCopiedSoap(true);
    setTimeout(() => setCopiedSoap(false), 2500);
  };

  const handleSaveSoap = () => {
    setSavedSoap(true);
    setTimeout(() => setSavedSoap(false), 3000);
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle.trim()) return;

    setIsOrdering(true);
    setTimeout(() => {
      const newOrder: ClinicalOrder = {
        id: `ord-${Date.now()}`,
        patientId: activePatient.id,
        doctorName: doctor.name,
        type: orderType,
        title: orderTitle,
        details: orderDetails || 'Prescribed via Doctor Command Center CDS Suite.',
        status: 'active',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      setPatientOrders((prev) => [newOrder, ...prev]);
      setOrderTitle('');
      setOrderDetails('');
      setIsOrdering(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Doctor Command Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={doctor.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
              alt={doctor.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600/30 shrink-0 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.name}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  {doctor.onDutyStatus}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-md">
                  {doctor.specialty}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {doctor.title} &bull; {doctor.department} &bull; {doctor.hospital}
              </p>
            </div>
          </div>

          {/* Quick Doctor Metrics */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Pts</span>
              <span className="text-base font-extrabold text-slate-900">{doctor.activePatientCount}</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Acute Alerts</span>
              <span className="text-base font-extrabold text-rose-700">{doctor.criticalAlertCount}</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">Pending Labs</span>
              <span className="text-base font-extrabold text-amber-800">{doctor.pendingReviewsCount}</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">ICU Capacity</span>
              <span className="text-base font-extrabold text-emerald-800">
                {hospitalReadiness.icuBeds.available}/{hospitalReadiness.icuBeds.total} Beds
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Patient Triage Roster & Clinical Cohort Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">Clinical Patient Triage Board</h2>
            </div>
            <p className="text-xs text-slate-500">
              Select any assigned patient to open clinical decision-support, review vitals, and issue clinical orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterRisk('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterRisk === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({patients.length})
              </button>
              <button
                onClick={() => setFilterRisk('critical_elevated')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterRisk === 'critical_elevated'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                High/Elevated
              </button>
              <button
                onClick={() => setFilterRisk('moderate')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterRisk === 'moderate'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Moderate
              </button>
              <button
                onClick={() => setFilterRisk('low')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterRisk === 'low'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Stable
              </button>
            </div>

            {/* Roster Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search patient or diagnosis..."
                className="bg-slate-50 text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-600 w-44"
              />
            </div>
          </div>
        </div>

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {filteredPatients.map((p) => {
            const isSelected = p.id === activePatient.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPatient(p)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-emerald-50/40 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Check className="w-3 h-3" />
                    Active In Focus
                  </span>
                )}

                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={p.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 pr-16">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {p.age}y &bull; {p.gender} &bull; Blood {p.bloodGroup}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Primary Condition:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {p.conditions[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">HealthPulse™ Score:</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {p.healthPulseScore} / 100
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.riskLevel === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : p.riskLevel === 'elevated'
                          ? 'bg-amber-100 text-amber-800'
                          : p.riskLevel === 'moderate'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.riskLevel.toUpperCase()} RISK
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(p);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                    >
                      <span>Load CDS</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. In-Focus Patient: Clinical Decision Support & Action Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Patient CDS + Differential Risk + SOAP Note */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Quick Vitals Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active Patient Record
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {activePatient.id}</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  {activePatient.name} &bull; Longitudinal Clinical Feed
                </h2>
                <p className="text-xs text-slate-500">
                  {activePatient.conditions.join(' &bull; ')} | Allergies:{' '}
                  <strong className="text-rose-600">{activePatient.allergies.join(', ')}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('reports')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Lab Reports ({reports.length})</span>
                </button>

                <button
                  onClick={() => onNavigate('whatchanged')}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-amber-600" />
                  <span>Delta Diff</span>
                </button>
              </div>
            </div>

            {/* Vitals Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Blood Pressure</span>
                <span className="text-base font-extrabold text-rose-600">
                  {vitals.bloodPressure.combinedDisplay}
                </span>
                <span className="text-[10px] text-rose-500 block">↑ +12 mmHg above baseline</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Heart Rate</span>
                <span className="text-base font-extrabold text-slate-900">
                  {vitals.heartRate.currentValue} {vitals.heartRate.unit}
                </span>
                <span className="text-[10px] text-slate-500 block">Resting Sinus Rhythm</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Blood Glucose</span>
                <span className="text-base font-extrabold text-amber-700">
                  {vitals.bloodGlucose.currentValue} {vitals.bloodGlucose.unit}
                </span>
                <span className="text-[10px] text-amber-600 block">Fasting (Elevated)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Pulse Oximetry</span>
                <span className="text-base font-extrabold text-emerald-700">
                  {vitals.spO2.currentValue}%
                </span>
                <span className="text-[10px] text-emerald-600 block">Optimal Oxygenation</span>
              </div>
            </div>
          </div>

          {/* AI Clinical Decision Support (CDS) & Pathophysiological Trajectory */}
          <div className="bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl border border-emerald-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Clinical Decision Support: Pathophysiological Nexus Analysis
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Multivariate risk modeling correlating autonomic stress, glycemic drift & BP
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                CDS Confidence: 94%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                  <span>Cardiometabolic Acceleration Risk</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Recent laboratory report confirms <strong>HbA1c escalation from 7.4% to 8.2%</strong> alongside resting BP 148/94 mmHg. Co-occurrence elevates 5-year microvascular & renal filtration risk profile.
                </p>
                <div className="pt-1 text-[10px] text-emerald-800 font-semibold">
                  &bull; Recommended: Consider SGLT2i add-on (Empagliflozin 10mg) for cardiorenal protection.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Brain className="w-3.5 h-3.5 text-amber-600" />
                  <span>Autonomic Stress & Non-Dipping BP</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Patient check-in data reveals perceived stress index 7.8/10 and sleep efficiency drop (5.2h avg). Elevated sympathetic tone correlates directly with late evening blood pressure surges.
                </p>
                <div className="pt-1 text-[10px] text-emerald-800 font-semibold">
                  &bull; Recommended: 24h Ambulatory BP Monitoring (ABPM) + Resonance Box Breathing.
                </div>
              </div>
            </div>
          </div>

          {/* Automated AI SOAP Note Generator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Automated AI SOAP Clinical Note
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Synthesized from longitudinal history, recent lab PDF, and wearable vitals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySoap}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedSoap ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSoap ? 'Copied SOAP Note' : 'Copy SOAP'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveSoap}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {savedSoap ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{savedSoap ? 'Saved to EHR' : 'Save to EHR Record'}</span>
                </button>
              </div>
            </div>

            {/* SOAP Content Blocks */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  [S] Subjective
                </span>
                <textarea
                  rows={2}
                  value={soapNote.subjective}
                  onChange={(e) => setSoapNote({ ...soapNote, subjective: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  [O] Objective
                </span>
                <textarea
                  rows={2}
                  value={soapNote.objective}
                  onChange={(e) => setSoapNote({ ...soapNote, objective: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  [A] Assessment
                </span>
                <textarea
                  rows={2}
                  value={soapNote.assessment}
                  onChange={(e) => setSoapNote({ ...soapNote, assessment: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  [P] Plan & Therapeutic Orders
                </span>
                <textarea
                  rows={3}
                  value={soapNote.plan}
                  onChange={(e) => setSoapNote({ ...soapNote, plan: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              {/* Differential Considerations */}
              {soapNote.differentialConsiderations.length > 0 && (
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    Differential Considerations
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                    {soapNote.differentialConsiderations.map((diff, idx) => (
                      <li key={idx}>{diff}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Action Orders, Emergency Bed Escalation & Active Regimen */}
        <div className="space-y-6">
          {/* Quick Clinical Order Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Pill className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Issue Clinical Order</h3>
                <p className="text-[11px] text-slate-500">e-Prescribe, Lab Panels & Follow-up</p>
              </div>
            </div>

            {orderSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Clinical order submitted to pharmacy & EHR!</span>
              </div>
            )}

            <form onSubmit={handleAddOrder} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Order Category</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setOrderType('prescription')}
                    className={`py-1 rounded font-semibold text-[11px] transition-all ${
                      orderType === 'prescription' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Rx Titrate
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('lab_order')}
                    className={`py-1 rounded font-semibold text-[11px] transition-all ${
                      orderType === 'lab_order' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Lab Panel
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('teleconsult')}
                    className={`py-1 rounded font-semibold text-[11px] transition-all ${
                      orderType === 'teleconsult' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Teleconsult
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Order Title / Directive</label>
                <input
                  type="text"
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  placeholder={
                    orderType === 'prescription'
                      ? 'e.g., Titrate Telmisartan to 80mg Daily'
                      : orderType === 'lab_order'
                      ? 'e.g., 24h Ambulatory BP Monitoring'
                      : 'e.g., Follow-up Telehealth in 2 weeks'
                  }
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Clinical Instructions</label>
                <textarea
                  rows={2}
                  value={orderDetails}
                  onChange={(e) => setOrderDetails(e.target.value)}
                  placeholder="Dosage instructions, frequency, dietary caveats..."
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isOrdering || !orderTitle.trim()}
                className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isOrdering ? 'Transmitting Order...' : 'Sign & Submit Order'}</span>
              </button>
            </form>

            {/* Quick Suggested Orders (1-Click) */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                1-Click CDS Recommendations
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOrderType('prescription');
                    setOrderTitle('Titrate Telmisartan to 80mg Daily');
                    setOrderDetails('Increase Telmisartan from 40mg to 80mg PO qPM due to systolic BP > 145 mmHg.');
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-semibold text-slate-700 border border-slate-200 transition-colors"
                >
                  + Telmisartan 80mg
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderType('prescription');
                    setOrderTitle('Add Empagliflozin (SGLT2i) 10mg OD');
                    setOrderDetails('For glycemic and cardiorenal risk management given HbA1c 8.2%.');
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-semibold text-slate-700 border border-slate-200 transition-colors"
                >
                  + Empagliflozin 10mg
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderType('lab_order');
                    setOrderTitle('24-Hour Ambulatory BP Monitor');
                    setOrderDetails('Assess nocturnal dipping profile.');
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-[10px] font-semibold text-slate-700 border border-slate-200 transition-colors"
                >
                  + 24h ABPM
                </button>
              </div>
            </div>
          </div>

          {/* Active Orders List for this Patient */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Orders for {activePatient.name.split(' ')[0]} ({patientOrders.length})
              </h4>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {patientOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ord.title}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{ord.details}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">{ord.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Crisis / ICU Bed Fast Reservation */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              emergencyActive
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  emergencyActive ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900">
                  {emergencyActive ? 'Acute Emergency Triage Active' : 'Rapid ICU Escalation Protocol'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {emergencyActive
                    ? 'ICU Bed 04 reserved. Rapid response team notified.'
                    : 'Trigger immediate hospital surge routing and bed reservation.'}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={onToggleEmergency}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      emergencyActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    {emergencyActive ? 'Deactivate Crisis Protocol' : 'Simulate ICU Escalation'}
                  </button>
                  <button
                    onClick={() => onNavigate('readiness')}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    View Beds ({hospitalReadiness.icuBeds.available})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
