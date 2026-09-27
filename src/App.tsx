import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertOctagon,
  Brain,
  Building2,
  ChevronRight,
  Compass,
  FileSpreadsheet,
  GitBranch,
  HeartPulse,
  History,
  Home,
  MessageSquare,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  Wind,
} from 'lucide-react';
import {
  ActivityHistoryItem,
  CareGraphEdge,
  CareGraphNode,
  DoctorProfile,
  HealthChangeItem,
  HealthPulseBreakdown,
  HospitalReadinessMetrics,
  MedicalReport,
  MedicationItem,
  MentalActivity,
  NexusAlert,
  Patient,
  PatientVitals,
  TabType,
  UserRole,
  WellBeingCheckIn,
  WellBeingScore,
} from './types';
import {
  MOCK_PATIENTS,
  MOCK_DOCTORS,
  MOCK_PATIENT_VITALS,
  MOCK_REPORTS,
  MOCK_WHAT_CHANGED,
  MOCK_HEALTHPULSE_BREAKDOWN,
  MOCK_MEDICATIONS,
  MOCK_CARE_GRAPH_NODES,
  MOCK_WELLBEING_CHECKINS,
  MOCK_WELLBEING_SCORE,
  MOCK_ACTIVITIES,
  MOCK_ACTIVITY_HISTORY,
  MOCK_ALERTS,
  MOCK_HOSPITAL_READINESS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { DoctorDashboard } from './components/DoctorDashboard';
import { DashboardOverview } from './components/DashboardOverview';
import { PatientProfile } from './components/PatientProfile';
import { ReportAnalyzer } from './components/ReportAnalyzer';
import { WhatChanged } from './components/WhatChanged';
import { HealthPulseView } from './components/HealthPulseView';
import { MedTraceView } from './components/MedTraceView';
import { CareGraphView } from './components/CareGraphView';
import { MentalWellBeingView } from './components/MentalWellBeingView';
import { ActivitiesView } from './components/ActivitiesView';
import { BreathingExerciseModal } from './components/BreathingExerciseModal';
import { AlertCenterView } from './components/AlertCenterView';
import { HospitalReadinessView } from './components/HospitalReadinessView';
import { PatientJourneySimulator } from './components/PatientJourneySimulator';
import { NexusAiChat } from './components/NexusAiChat';
import { AiTrustCenter } from './components/AiTrustCenter';
import { DemoTourModal } from './components/DemoTourModal';
import { UiVersionToggle, UiVersion } from './components/UiVersionToggle';
import { PreservedPreviousUiView } from './HEALTHNEXUS_UI_STABLE_BACKUP_components/PreservedPreviousUiView';

export default function App() {
  // UI Version Experiment Switch
  const [uiVersion, setUiVersion] = useState<UiVersion>('new_ui');

  // Authentication & Role State
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [doctors] = useState<DoctorProfile[]>(MOCK_DOCTORS);
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile>(MOCK_DOCTORS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [loginDefaultRole, setLoginDefaultRole] = useState<UserRole>('patient');

  // Navigation & Data State
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [activePatient, setActivePatient] = useState<Patient>(MOCK_PATIENTS[0]);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Patient-specific data
  const [vitals, setVitals] = useState<PatientVitals>(MOCK_PATIENT_VITALS[activePatient.id] || MOCK_PATIENT_VITALS['p-01']);
  const [reports, setReports] = useState<MedicalReport[]>(MOCK_REPORTS[activePatient.id] || MOCK_REPORTS['p-01']);
  const [whatChangedList, setWhatChangedList] = useState<HealthChangeItem[]>(MOCK_WHAT_CHANGED[activePatient.id] || MOCK_WHAT_CHANGED['p-01']);
  const [healthPulse, setHealthPulse] = useState<HealthPulseBreakdown>(MOCK_HEALTHPULSE_BREAKDOWN[activePatient.id] || MOCK_HEALTHPULSE_BREAKDOWN['p-01']);
  const [medications, setMedications] = useState<MedicationItem[]>(MOCK_MEDICATIONS[activePatient.id] || MOCK_MEDICATIONS['p-01']);
  const [careGraph, setCareGraph] = useState<{ nodes: CareGraphNode[]; edges: CareGraphEdge[] }>(MOCK_CARE_GRAPH_NODES[activePatient.id] || MOCK_CARE_GRAPH_NODES['p-01']);
  const [wellBeingData, setWellBeingData] = useState<{ checkins: WellBeingCheckIn[]; score: WellBeingScore }>({
    checkins: MOCK_WELLBEING_CHECKINS[activePatient.id] || MOCK_WELLBEING_CHECKINS['p-01'],
    score: MOCK_WELLBEING_SCORE[activePatient.id] || MOCK_WELLBEING_SCORE['p-01'],
  });
  const [activities] = useState<MentalActivity[]>(MOCK_ACTIVITIES);
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>(MOCK_ACTIVITY_HISTORY);
  const [alerts, setAlerts] = useState<NexusAlert[]>(MOCK_ALERTS);
  const [hospitalReadiness, setHospitalReadiness] = useState<HospitalReadinessMetrics>(MOCK_HOSPITAL_READINESS);

  // Sync patient switch
  const handleSelectPatient = (patient: Patient) => {
    setActivePatient(patient);
    setVitals(MOCK_PATIENT_VITALS[patient.id] || MOCK_PATIENT_VITALS['p-01']);
    setReports(MOCK_REPORTS[patient.id] || MOCK_REPORTS['p-01']);
    setWhatChangedList(MOCK_WHAT_CHANGED[patient.id] || MOCK_WHAT_CHANGED['p-01']);
    setHealthPulse(MOCK_HEALTHPULSE_BREAKDOWN[patient.id] || MOCK_HEALTHPULSE_BREAKDOWN['p-01']);
    setMedications(MOCK_MEDICATIONS[patient.id] || MOCK_MEDICATIONS['p-01']);
    setCareGraph(MOCK_CARE_GRAPH_NODES[patient.id] || MOCK_CARE_GRAPH_NODES['p-01']);
    setWellBeingData({
      checkins: MOCK_WELLBEING_CHECKINS[patient.id] || MOCK_WELLBEING_CHECKINS['p-01'],
      score: MOCK_WELLBEING_SCORE[patient.id] || MOCK_WELLBEING_SCORE['p-01'],
    });
  };

  const handleToggleEmergency = () => {
    setEmergencyActive((prev) => !prev);
  };

  const handleReportAnalyzed = (newReport: MedicalReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleToggleRole = () => {
    if (userRole === 'patient') {
      setUserRole('doctor');
      setCurrentTab('doctor_command');
    } else {
      setUserRole('patient');
      setCurrentTab('overview');
    }
  };

  const handleOpenLogin = (role?: UserRole) => {
    if (role) setLoginDefaultRole(role);
    setCurrentTab('login');
  };

  const handleLoginSuccess = (role: UserRole, patient?: Patient, doctor?: DoctorProfile) => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (role === 'patient') {
      if (patient) handleSelectPatient(patient);
      setCurrentTab('overview');
    } else {
      if (doctor) setActiveDoctor(doctor);
      setCurrentTab('doctor_command');
    }
  };

  // Search filter routing if user types a search
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const q = searchQuery.toLowerCase();
      if (q.includes('report') || q.includes('lab') || q.includes('hba1c') || q.includes('lipid') || q.includes('glucose')) {
        if (currentTab !== 'reports' && currentTab !== 'whatchanged') setCurrentTab('reports');
      } else if (q.includes('med') || q.includes('metformin') || q.includes('telmisartan') || q.includes('dose')) {
        if (currentTab !== 'medtrace') setCurrentTab('medtrace');
      } else if (q.includes('breath') || q.includes('stress') || q.includes('sleep') || q.includes('mood')) {
        if (currentTab !== 'mental') setCurrentTab('mental');
      } else if (q.includes('icu') || q.includes('bed') || q.includes('hospital') || q.includes('surge')) {
        if (currentTab !== 'readiness') setCurrentTab('readiness');
      }
    }
  }, [searchQuery, currentTab]);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* Top Development UI Version Switcher Banner */}
      <UiVersionToggle
        currentVersion={uiVersion}
        onSelectVersion={setUiVersion}
      />

      {/* Render selected UI version */}
      {uiVersion === 'previous_ui' ? (
        /* Preserved Stable UI Backup rendered directly from backup components */
        <PreservedPreviousUiView
          userRole={userRole}
          setUserRole={setUserRole}
          doctors={doctors}
          activeDoctor={activeDoctor}
          setActiveDoctor={setActiveDoctor}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loginDefaultRole={loginDefaultRole}
          setLoginDefaultRole={setLoginDefaultRole}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          patients={patients}
          activePatient={activePatient}
          setActivePatient={setActivePatient}
          emergencyActive={emergencyActive}
          setEmergencyActive={setEmergencyActive}
          isTourOpen={isTourOpen}
          setIsTourOpen={setIsTourOpen}
          isBreathingOpen={isBreathingOpen}
          setIsBreathingOpen={setIsBreathingOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          vitals={vitals}
          setVitals={setVitals}
          reports={reports}
          setReports={setReports}
          whatChangedList={whatChangedList}
          setWhatChangedList={setWhatChangedList}
          healthPulse={healthPulse}
          setHealthPulse={setHealthPulse}
          medications={medications}
          setMedications={setMedications}
          careGraph={careGraph}
          setCareGraph={setCareGraph}
          wellBeingData={wellBeingData}
          setWellBeingData={setWellBeingData}
          activities={activities}
          activityHistory={activityHistory}
          setActivityHistory={setActivityHistory}
          alerts={alerts}
          setAlerts={setAlerts}
          hospitalReadiness={hospitalReadiness}
          setHospitalReadiness={setHospitalReadiness}
          handleSelectPatient={handleSelectPatient}
          handleToggleEmergency={handleToggleEmergency}
          handleToggleRole={handleToggleRole}
          handleOpenLogin={handleOpenLogin}
          handleLoginSuccess={handleLoginSuccess}
          handleReportAnalyzed={handleReportAnalyzed}
        />
      ) : (
        /* Proposed New HEALTHNEXUS AI UI (White background, Medical green primary, Soft blue secondary, Clean healthcare cards) */
        <div className="min-h-[calc(100vh-2.5rem)] bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-600 selection:text-white">
          {/* Top Navigation */}
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            patients={patients}
            activePatient={activePatient}
            onSelectPatient={handleSelectPatient}
            emergencyActive={emergencyActive}
            onToggleEmergency={handleToggleEmergency}
            onOpenTour={() => setIsTourOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            userRole={userRole}
            activeDoctor={activeDoctor}
            onToggleRole={handleToggleRole}
            onOpenLogin={() => handleOpenLogin()}
          />

          {/* Main Container */}
          {currentTab === 'login' ? (
            <main className="flex-1">
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                patients={patients}
                doctors={doctors}
                defaultRole={loginDefaultRole}
                onCancel={() => setCurrentTab(userRole === 'doctor' ? 'doctor_command' : 'overview')}
              />
            </main>
          ) : currentTab === 'landing' ? (
            <main className="flex-1">
              <LandingPage
                onEnterDashboard={(tab) => setCurrentTab(tab || (userRole === 'doctor' ? 'doctor_command' : 'overview'))}
                onOpenTour={() => setIsTourOpen(true)}
                activePatient={activePatient}
                onOpenLogin={handleOpenLogin}
              />
            </main>
          ) : (
            <div className="flex-1 flex max-w-7xl w-full mx-auto">
              {/* Desktop Left Sidebar */}
              <Sidebar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                emergencyActive={emergencyActive}
                onOpenTour={() => setIsTourOpen(true)}
                userRole={userRole}
              />

              {/* Main Dashboard Work Canvas */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-y-auto">
                {/* Doctor Command Center View */}
                {userRole === 'doctor' && (currentTab === 'doctor_command' || currentTab === 'overview') && (
                  <DoctorDashboard
                    doctor={activeDoctor}
                    patients={patients}
                    activePatient={activePatient}
                    onSelectPatient={handleSelectPatient}
                    vitals={vitals}
                    reports={reports}
                    whatChangedList={whatChangedList}
                    medications={medications}
                    alerts={alerts}
                    hospitalReadiness={hospitalReadiness}
                    onNavigate={setCurrentTab}
                    emergencyActive={emergencyActive}
                    onToggleEmergency={handleToggleEmergency}
                  />
                )}

                {/* Patient Dashboard Overview */}
                {userRole === 'patient' && currentTab === 'overview' && (
                  <DashboardOverview
                    patient={activePatient}
                    vitals={vitals}
                    whatChangedList={whatChangedList}
                    onNavigate={setCurrentTab}
                    onOpenBreathingModal={() => setIsBreathingOpen(true)}
                    emergencyActive={emergencyActive}
                  />
                )}

                {currentTab === 'patient' && (
                  <PatientProfile
                    patient={activePatient}
                    onNavigate={setCurrentTab}
                  />
                )}

                {currentTab === 'whatchanged' && (
                  <WhatChanged
                    patient={activePatient}
                    items={whatChangedList}
                    emergencyActive={emergencyActive}
                  />
                )}

                {currentTab === 'reports' && (
                  <ReportAnalyzer
                    patient={activePatient}
                    reports={reports}
                    onReportAnalyzed={handleReportAnalyzed}
                  />
                )}

                {currentTab === 'healthpulse' && (
                  <HealthPulseView
                    patient={activePatient}
                    healthPulse={healthPulse}
                    emergencyActive={emergencyActive}
                  />
                )}

                {currentTab === 'medtrace' && (
                  <MedTraceView
                    patient={activePatient}
                    medications={medications}
                  />
                )}

                {currentTab === 'caregraph' && (
                  <CareGraphView
                    patient={activePatient}
                    graphData={careGraph}
                  />
                )}

                {currentTab === 'mental' && (
                  <MentalWellBeingView
                    patient={activePatient}
                    wellBeingData={wellBeingData}
                    onNavigate={setCurrentTab}
                    onOpenBreathing={() => setIsBreathingOpen(true)}
                  />
                )}

                {currentTab === 'activities' && (
                  <ActivitiesView
                    patient={activePatient}
                    activities={activities}
                    activityHistory={activityHistory}
                    onOpenBreathingModal={() => setIsBreathingOpen(true)}
                  />
                )}

                {currentTab === 'alerts' && (
                  <AlertCenterView
                    patient={activePatient}
                    alerts={alerts}
                    emergencyActive={emergencyActive}
                    onToggleEmergency={handleToggleEmergency}
                  />
                )}

                {currentTab === 'readiness' && (
                  <HospitalReadinessView
                    metrics={hospitalReadiness}
                    emergencyActive={emergencyActive}
                  />
                )}

                {currentTab === 'simulators' && (
                  <PatientJourneySimulator
                    patient={activePatient}
                  />
                )}

                {currentTab === 'chat' && (
                  <NexusAiChat
                    patient={activePatient}
                    onNavigate={setCurrentTab}
                    onOpenBreathing={() => setIsBreathingOpen(true)}
                  />
                )}

                {currentTab === 'aitrust' && (
                  <AiTrustCenter
                    patient={activePatient}
                  />
                )}
              </main>
            </div>
          )}

          {/* Mobile Sticky Bottom Nav */}
          {currentTab !== 'landing' && currentTab !== 'login' && (
            <div className="md:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-2xs">
              {(userRole === 'doctor'
                ? [
                    { id: 'doctor_command', label: 'Command', icon: Stethoscope },
                    { id: 'whatchanged', label: 'Changes', icon: History },
                    { id: 'reports', label: 'Labs', icon: FileSpreadsheet },
                    { id: 'readiness', label: 'Surge', icon: Building2 },
                    { id: 'alerts', label: 'Alerts', icon: AlertOctagon },
                    { id: 'chat', label: 'Copilot', icon: MessageSquare },
                  ]
                : [
                    { id: 'overview', label: 'Overview', icon: Home },
                    { id: 'whatchanged', label: 'Changes', icon: History },
                    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
                    { id: 'mental', label: 'Well-Being', icon: Brain },
                    { id: 'alerts', label: 'Alerts', icon: AlertOctagon },
                    { id: 'chat', label: 'Copilot', icon: MessageSquare },
                  ]
              ).map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentTab === item.id ||
                  (userRole === 'doctor' && item.id === 'doctor_command' && currentTab === 'overview');
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id as TabType)}
                    className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-bold ${
                      isActive ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2-Minute Breathing Modal */}
          <BreathingExerciseModal
            isOpen={isBreathingOpen}
            onClose={() => setIsBreathingOpen(false)}
            patient={activePatient}
            onActivityCompleted={() => {
              setActivityHistory(MOCK_ACTIVITY_HISTORY);
            }}
          />

          {/* 15-Step Hackathon Judge Presentation Tour Modal */}
          <DemoTourModal
            isOpen={isTourOpen}
            onClose={() => setIsTourOpen(false)}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
            }}
            onOpenBreathing={() => setIsBreathingOpen(true)}
          />
        </div>
      )}
    </div>
  );
}
