import React from 'react';
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
} from '../types';
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
} from '../data/mockData';
import { Navbar as PreservedNavbar } from './Navbar';
import { Sidebar as PreservedSidebar } from './Sidebar';
import { LandingPage as PreservedLandingPage } from './LandingPage';
import { LoginPage as PreservedLoginPage } from './LoginPage';
import { DoctorDashboard as PreservedDoctorDashboard } from './DoctorDashboard';
import { DashboardOverview as PreservedDashboardOverview } from './DashboardOverview';
import { PatientProfile as PreservedPatientProfile } from './PatientProfile';
import { ReportAnalyzer as PreservedReportAnalyzer } from './ReportAnalyzer';
import { WhatChanged as PreservedWhatChanged } from './WhatChanged';
import { HealthPulseView as PreservedHealthPulseView } from './HealthPulseView';
import { MedTraceView as PreservedMedTraceView } from './MedTraceView';
import { CareGraphView as PreservedCareGraphView } from './CareGraphView';
import { MentalWellBeingView as PreservedMentalWellBeingView } from './MentalWellBeingView';
import { ActivitiesView as PreservedActivitiesView } from './ActivitiesView';
import { BreathingExerciseModal as PreservedBreathingExerciseModal } from './BreathingExerciseModal';
import { AlertCenterView as PreservedAlertCenterView } from './AlertCenterView';
import { HospitalReadinessView as PreservedHospitalReadinessView } from './HospitalReadinessView';
import { PatientJourneySimulator as PreservedPatientJourneySimulator } from './PatientJourneySimulator';
import { NexusAiChat as PreservedNexusAiChat } from './NexusAiChat';
import { AiTrustCenter as PreservedAiTrustCenter } from './AiTrustCenter';
import { DemoTourModal as PreservedDemoTourModal } from './DemoTourModal';

export interface PreservedUiProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  doctors: DoctorProfile[];
  activeDoctor: DoctorProfile;
  setActiveDoctor: (doc: DoctorProfile) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  loginDefaultRole: UserRole;
  setLoginDefaultRole: (r: UserRole) => void;
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  patients: Patient[];
  activePatient: Patient;
  setActivePatient: (p: Patient) => void;
  emergencyActive: boolean;
  setEmergencyActive: (v: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (v: boolean) => void;
  isBreathingOpen: boolean;
  setIsBreathingOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  vitals: PatientVitals;
  setVitals: (v: PatientVitals) => void;
  reports: MedicalReport[];
  setReports: (r: MedicalReport[]) => void;
  whatChangedList: HealthChangeItem[];
  setWhatChangedList: (w: HealthChangeItem[]) => void;
  healthPulse: HealthPulseBreakdown;
  setHealthPulse: (h: HealthPulseBreakdown) => void;
  medications: MedicationItem[];
  setMedications: (m: MedicationItem[]) => void;
  careGraph: { nodes: CareGraphNode[]; edges: CareGraphEdge[] };
  setCareGraph: (cg: { nodes: CareGraphNode[]; edges: CareGraphEdge[] }) => void;
  wellBeingData: { checkins: WellBeingCheckIn[]; score: WellBeingScore };
  setWellBeingData: (wb: { checkins: WellBeingCheckIn[]; score: WellBeingScore }) => void;
  activities: MentalActivity[];
  activityHistory: ActivityHistoryItem[];
  setActivityHistory: (ah: ActivityHistoryItem[]) => void;
  alerts: NexusAlert[];
  setAlerts: (a: NexusAlert[]) => void;
  hospitalReadiness: HospitalReadinessMetrics;
  setHospitalReadiness: (hr: HospitalReadinessMetrics) => void;
  handleSelectPatient: (patient: Patient) => void;
  handleToggleEmergency: () => void;
  handleToggleRole: () => void;
  handleOpenLogin: (role?: UserRole) => void;
  handleLoginSuccess: (role: UserRole, patient?: Patient, doctor?: DoctorProfile) => void;
  handleReportAnalyzed: (report: MedicalReport) => void;
}

export const PreservedPreviousUiView: React.FC<PreservedUiProps> = ({
  userRole,
  doctors,
  activeDoctor,
  loginDefaultRole,
  currentTab,
  setCurrentTab,
  patients,
  activePatient,
  emergencyActive,
  isTourOpen,
  setIsTourOpen,
  isBreathingOpen,
  setIsBreathingOpen,
  searchQuery,
  setSearchQuery,
  vitals,
  reports,
  whatChangedList,
  healthPulse,
  medications,
  careGraph,
  wellBeingData,
  activities,
  activityHistory,
  setActivityHistory,
  alerts,
  hospitalReadiness,
  handleSelectPatient,
  handleToggleEmergency,
  handleToggleRole,
  handleOpenLogin,
  handleLoginSuccess,
  handleReportAnalyzed,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFA] text-[#16302A] flex flex-col font-sans antialiased selection:bg-[#168A6A] selection:text-white">
      {/* Preserved Stable Top Navigation */}
      <PreservedNavbar
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
          <PreservedLoginPage
            onLoginSuccess={handleLoginSuccess}
            patients={patients}
            doctors={doctors}
            defaultRole={loginDefaultRole}
            onCancel={() => setCurrentTab(userRole === 'doctor' ? 'doctor_command' : 'overview')}
          />
        </main>
      ) : currentTab === 'landing' ? (
        <main className="flex-1">
          <PreservedLandingPage
            onEnterDashboard={(tab) => setCurrentTab(tab || (userRole === 'doctor' ? 'doctor_command' : 'overview'))}
            onOpenTour={() => setIsTourOpen(true)}
            activePatient={activePatient}
            onOpenLogin={handleOpenLogin}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Desktop Left Sidebar */}
          <PreservedSidebar
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
              <PreservedDoctorDashboard
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
              <PreservedDashboardOverview
                patient={activePatient}
                vitals={vitals}
                whatChangedList={whatChangedList}
                onNavigate={setCurrentTab}
                onOpenBreathingModal={() => setIsBreathingOpen(true)}
                emergencyActive={emergencyActive}
              />
            )}

            {currentTab === 'patient' && (
              <PreservedPatientProfile
                patient={activePatient}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'whatchanged' && (
              <PreservedWhatChanged
                patient={activePatient}
                items={whatChangedList}
                emergencyActive={emergencyActive}
              />
            )}

            {currentTab === 'reports' && (
              <PreservedReportAnalyzer
                patient={activePatient}
                reports={reports}
                onReportAnalyzed={handleReportAnalyzed}
              />
            )}

            {currentTab === 'healthpulse' && (
              <PreservedHealthPulseView
                patient={activePatient}
                healthPulse={healthPulse}
                emergencyActive={emergencyActive}
              />
            )}

            {currentTab === 'medtrace' && (
              <PreservedMedTraceView
                patient={activePatient}
                medications={medications}
              />
            )}

            {currentTab === 'caregraph' && (
              <PreservedCareGraphView
                patient={activePatient}
                graphData={careGraph}
              />
            )}

            {currentTab === 'mental' && (
              <PreservedMentalWellBeingView
                patient={activePatient}
                wellBeingData={wellBeingData}
                onNavigate={setCurrentTab}
                onOpenBreathing={() => setIsBreathingOpen(true)}
              />
            )}

            {currentTab === 'activities' && (
              <PreservedActivitiesView
                patient={activePatient}
                activities={activities}
                activityHistory={activityHistory}
                onOpenBreathingModal={() => setIsBreathingOpen(true)}
              />
            )}

            {currentTab === 'alerts' && (
              <PreservedAlertCenterView
                patient={activePatient}
                alerts={alerts}
                emergencyActive={emergencyActive}
                onToggleEmergency={handleToggleEmergency}
              />
            )}

            {currentTab === 'readiness' && (
              <PreservedHospitalReadinessView
                metrics={hospitalReadiness}
                emergencyActive={emergencyActive}
              />
            )}

            {currentTab === 'simulators' && (
              <PreservedPatientJourneySimulator
                patient={activePatient}
              />
            )}

            {currentTab === 'chat' && (
              <PreservedNexusAiChat
                patient={activePatient}
                onNavigate={setCurrentTab}
                onOpenBreathing={() => setIsBreathingOpen(true)}
              />
            )}

            {currentTab === 'aitrust' && (
              <PreservedAiTrustCenter
                patient={activePatient}
              />
            )}
          </main>
        </div>
      )}

      {/* Mobile Sticky Bottom Nav */}
      {currentTab !== 'landing' && currentTab !== 'login' && (
        <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EAEA] px-2 py-1.5 flex items-center justify-around">
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
                  isActive ? 'text-[#168A6A]' : 'text-[#64748B]'
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
      <PreservedBreathingExerciseModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
        patient={activePatient}
        onActivityCompleted={() => {
          setActivityHistory(MOCK_ACTIVITY_HISTORY);
        }}
      />

      {/* 15-Step Hackathon Judge Presentation Tour Modal */}
      <PreservedDemoTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
        }}
        onOpenBreathing={() => setIsBreathingOpen(true)}
      />
    </div>
  );
};
