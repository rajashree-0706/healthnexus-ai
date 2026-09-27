export type TabType =
  | 'overview'
  | 'patient'
  | 'healthpulse'
  | 'whatchanged'
  | 'reports'
  | 'medtrace'
  | 'caregraph'
  | 'mental'
  | 'activities'
  | 'alerts'
  | 'readiness'
  | 'simulators'
  | 'chat'
  | 'aitrust'
  | 'landing'
  | 'login'
  | 'doctor_command';

export type UserRole = 'patient' | 'doctor';

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  hospital: string;
  avatarUrl?: string;
  activePatientCount: number;
  criticalAlertCount: number;
  pendingReviewsCount: number;
  onDutyStatus: 'Active on Duty' | 'In Surgery' | 'On Call';
}

export interface ClinicalOrder {
  id: string;
  patientId: string;
  doctorName: string;
  type: 'prescription' | 'lab_order' | 'teleconsult' | 'icu_escalation';
  title: string;
  details: string;
  status: 'pending' | 'submitted' | 'active';
  timestamp: string;
}

export interface SoapNote {
  patientId: string;
  doctorName: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  differentialConsiderations: string[];
}

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'critical';
export type ChangeSeverity = 'stable' | 'attention' | 'critical';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  avatarUrl?: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  currentMedications: string[];
  lastConsultation: string;
  riskLevel: RiskLevel;
  healthPulseScore: number;
  primaryPhysician: string;
  insuranceId: string;
  medicalHistorySummary: string;
  journeyTimeline: JourneyEvent[];
}

export interface JourneyEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  category: 'diagnosis' | 'medication' | 'lab' | 'consultation' | 'alert';
  description: string;
  metricsSummary?: string;
  status: 'completed' | 'active' | 'scheduled';
}

export interface VitalMetric {
  id: string;
  name: string;
  currentValue: number | string;
  unit: string;
  previousValue: number | string;
  previousDate: string;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'attention' | 'critical';
  normalRange: string;
  description: string;
}

export interface PatientVitals {
  patientId: string;
  recordedAt: string;
  heartRate: VitalMetric;
  bloodPressure: {
    systolic: VitalMetric;
    diastolic: VitalMetric;
    combinedDisplay: string;
  };
  spO2: VitalMetric;
  temperature: VitalMetric;
  respiratoryRate: VitalMetric;
  bloodGlucose: VitalMetric;
  weight: VitalMetric;
  bmi: VitalMetric;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  fileName: string;
  fileType: 'pdf' | 'png' | 'jpg';
  fileSize: string;
  uploadedAt: string;
  category: 'Blood Panel' | 'Lipid Profile' | 'Cardiac' | 'Pulmonary' | 'Renal' | 'Metabolic';
  extractedText: string;
  aiSummary: {
    overview: string;
    testsDetected: string[];
    biomarkers: BiomarkerResult[];
    abnormalFindings: string[];
    severityIndicator: ChangeSeverity;
    previousVsCurrentChanges: string[];
    suggestedQuestionsForDoctor: string[];
    confidenceScore: number;
    disclaimer: string;
  };
}

export interface BiomarkerResult {
  name: string;
  value: string | number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  previousValue?: string | number;
  changeDirection?: 'up' | 'down' | 'stable';
}

export interface HealthChangeItem {
  id: string;
  category: 'Blood Pressure' | 'Glucose' | 'Weight' | 'Medication' | 'Symptoms' | 'Mental Well-Being' | 'Activity';
  severity: ChangeSeverity;
  title: string;
  previousState: string;
  currentState: string;
  whatChanged: string;
  whyItMatters: string;
  whatToDiscuss: string;
  detectionSource: string;
  timestamp: string;
}

export interface HealthPulseBreakdown {
  overallScore: number;
  statusText: 'Optimal' | 'Stable' | 'Needs Attention' | 'Elevated Risk' | 'Critical Review';
  statusColor: 'green' | 'blue' | 'amber' | 'red';
  categories: {
    physicalHealth: { score: number; label: string; details: string };
    labTrends: { score: number; label: string; details: string };
    medication: { score: number; label: string; details: string };
    mentalWellBeing: { score: number; label: string; details: string };
    recentChanges: { score: number; label: string; details: string };
  };
  whyThisScoreExplanation: string[];
  contributingFactors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }[];
}

export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  purpose: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Modified' | 'Discontinued' | 'Needs Review';
  adherencePercentage: number;
  reportedSideEffects: string[];
  timeline: {
    date: string;
    event: string;
    note: string;
  }[];
  potentialInteractions: string[];
  safetyAdvisory?: string;
}

export interface CareGraphNode {
  id: string;
  label: string;
  type: 'patient' | 'condition' | 'medication' | 'lab' | 'symptom' | 'mental' | 'risk' | 'recommendation';
  status?: 'normal' | 'attention' | 'critical' | 'info';
  details: string;
  x?: number;
  y?: number;
}

export interface CareGraphEdge {
  from: string;
  to: string;
  label?: string;
  relationship: string;
  animated?: boolean;
}

export interface WellBeingCheckIn {
  id: string;
  patientId: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'very_low' | 'stressed';
  stressLevel: number; // 0 - 10
  sleepQuality: 'very_poor' | 'poor' | 'fair' | 'average' | 'good' | 'excellent' | 'restful' | 'disrupted';
  sleepHours: number;
  energyLevel: number; // 0 - 10
  motivation?: number; // 0 - 10
  interestLevel?: number; // 0 - 10
  notes: string;
  aiSupportiveInsight?: string;
  recommendedActivities?: string[];
  wellBeingIndicator?: number; // 0 - 10
  stressIndicatorLabel?: string;
  wellBeingIndicatorLabel?: string;
  contributingFactors?: { factor: string; impact: 'positive' | 'neutral' | 'attention'; weightPercent: number }[];
  musicRecommendation?: MusicRecommendation;
}

export interface MusicTrack {
  id: string;
  title: string;
  category: 'calm_instrumental' | 'nature_sounds' | 'gentle_acoustic' | 'uplifting' | 'light_energy';
  categoryLabel: string;
  categoryIcon: string;
  moodTarget: string;
  durationLabel: string;
  durationSeconds: number;
  description: string;
  soundType: 'piano' | 'nature' | 'acoustic' | 'ambient' | 'pulse';
  bpm?: number;
}

export interface MusicRecommendation {
  category: 'calm_instrumental' | 'nature_sounds' | 'gentle_acoustic' | 'uplifting' | 'light_energy';
  categoryTitle: string;
  categoryIcon: string;
  headline: string;
  reason: string;
  safetyDisclaimer: string;
  moodBadge: string;
  durationRecommendation: string;
  recommendedTrack: MusicTrack;
  availableTracks: MusicTrack[];
}

export interface WellBeingScore {
  overallScore: number;
  weeklyTrend: { day: string; score: number; mood: string; stress: number; sleep: number; energy: number }[];
  breakdown: {
    mood: number;
    stress: number;
    sleep: number;
    energy: number;
  };
  statusSummary: string;
  wholeHealthCorrelation: string;
}

export interface MentalActivity {
  id: string;
  title: string;
  category: 'calm' | 'move' | 'reflect' | 'relax' | 'connect';
  durationMinutes: number;
  durationLabel: string;
  difficulty: 'Gentle' | 'Easy' | 'Moderate';
  description: string;
  instructions: string[];
  benefits: string[];
  iconName: string;
  hasInteractiveModule?: boolean;
  interactiveType?: 'breathing' | 'journal' | 'soundscape' | 'gratitude';
}

export interface ActivityHistoryItem {
  id: string;
  patientId: string;
  activityId: string;
  activityTitle: string;
  category: string;
  completedAt: string;
  durationMinutes: number;
  userReflection?: string;
}

export interface NexusAlert {
  id: string;
  patientId: string;
  patientName: string;
  severity: 'critical' | 'attention' | 'stable';
  title: string;
  reason: string;
  category: 'Vitals Surge' | 'Biomarker Shift' | 'Medication Adherence' | 'Stress Alert' | 'Emergency Simulation';
  createdAt: string;
  status: 'active' | 'reviewed' | 'resolved';
  relatedData: string[];
  recommendedNextStep: string;
  triagePriority: number; // 1 (highest) to 3
}

export interface EmergencySimulationState {
  isActive: boolean;
  scenarioName: string;
  startedAt?: string;
  elapsedSeconds: number;
  timelineStep: number;
  timeline: {
    timeOffset: string;
    title: string;
    description: string;
    completed: boolean;
    active: boolean;
  }[];
}

export interface HospitalReadinessMetrics {
  facilityName: string;
  lastUpdated: string;
  overallReadinessScore: number;
  icuBeds: {
    available: number;
    total: number;
    occupancyRate: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  generalBeds: {
    available: number;
    total: number;
    occupancyRate: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  emergencyTeams: {
    activeOnDuty: number;
    totalRequired: number;
    status: 'Available' | 'Standby' | 'Surge Mode';
  };
  ambulanceFleet: {
    available: number;
    dispatched: number;
    total: number;
  };
  oxygenReserves: {
    hoursRemaining: number;
    capacityPercentage: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  onCallSpecialists: {
    specialty: string;
    doctorName: string;
    status: 'Available' | 'In Surgery' | 'On Call';
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionTab: TabType }[];
  isEmergencyAlert?: boolean;
}
