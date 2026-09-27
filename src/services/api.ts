import {
  Patient,
  PatientVitals,
  MedicalReport,
  HealthChangeItem,
  HealthPulseBreakdown,
  MedicationItem,
  WellBeingCheckIn,
  WellBeingScore,
  MentalActivity,
  ActivityHistoryItem,
  NexusAlert,
  HospitalReadinessMetrics,
  CareGraphNode,
  CareGraphEdge,
} from '../types';
import {
  MOCK_PATIENTS,
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

export const api = {
  getPatients: async (): Promise<Patient[]> => {
    return MOCK_PATIENTS;
  },

  getPatientById: async (id: string): Promise<Patient | undefined> => {
    return MOCK_PATIENTS.find((p) => p.id === id) || MOCK_PATIENTS[0];
  },

  getVitals: async (patientId: string): Promise<PatientVitals> => {
    return MOCK_PATIENT_VITALS[patientId] || MOCK_PATIENT_VITALS['p-01'];
  },

  getReports: async (patientId: string): Promise<MedicalReport[]> => {
    return MOCK_REPORTS[patientId] || [];
  },

  analyzeReportText: async (
    reportText: string,
    patient: Patient,
    previousHbA1c?: string,
    previousBP?: string
  ) => {
    try {
      const response = await fetch('/api/reports/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          patientName: patient.name,
          patientAge: patient.age,
          previousHbA1c,
          previousBP,
        }),
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      return data.analysis;
    } catch (err) {
      console.warn('Falling back to local clinical parser:', err);
      return MOCK_REPORTS['p-01'][0].aiSummary;
    }
  },

  getWhatChanged: async (patientId: string): Promise<HealthChangeItem[]> => {
    return MOCK_WHAT_CHANGED[patientId] || [];
  },

  getHealthPulse: async (patientId: string): Promise<HealthPulseBreakdown> => {
    return MOCK_HEALTHPULSE_BREAKDOWN[patientId] || MOCK_HEALTHPULSE_BREAKDOWN['p-01'];
  },

  getMedications: async (patientId: string): Promise<MedicationItem[]> => {
    return MOCK_MEDICATIONS[patientId] || [];
  },

  getCareGraph: async (patientId: string): Promise<{ nodes: CareGraphNode[]; edges: CareGraphEdge[] }> => {
    return MOCK_CARE_GRAPH_NODES[patientId] || MOCK_CARE_GRAPH_NODES['p-01'];
  },

  getWellBeingData: async (patientId: string): Promise<{ checkins: WellBeingCheckIn[]; score: WellBeingScore }> => {
    return {
      checkins: MOCK_WELLBEING_CHECKINS[patientId] || [],
      score: MOCK_WELLBEING_SCORE[patientId] || MOCK_WELLBEING_SCORE['p-01'],
    };
  },

  submitCheckIn: async (checkin: Omit<WellBeingCheckIn, 'id' | 'date'>): Promise<WellBeingCheckIn> => {
    const newCheckIn: WellBeingCheckIn = {
      ...checkin,
      id: `wbi-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      aiSupportiveInsight:
        checkin.stressLevel > 6
          ? 'Recorded stress is elevated. We recommend taking 2 minutes for box breathing or an evening gratitude reflection to help reset autonomic arousal.'
          : 'Great job maintaining balanced stress and sleep consistency today!',
      recommendedActivities: ['act-breathing-box', 'act-gratitude-3', 'act-mindful-walk'],
    };
    return newCheckIn;
  },

  getActivities: async (): Promise<MentalActivity[]> => {
    return MOCK_ACTIVITIES;
  },

  getActivityHistory: async (patientId: string): Promise<ActivityHistoryItem[]> => {
    return MOCK_ACTIVITY_HISTORY.filter((a) => a.patientId === patientId || a.patientId === 'p-01');
  },

  logActivityCompletion: async (
    patientId: string,
    activityId: string,
    activityTitle: string,
    category: string,
    durationMinutes: number,
    reflection?: string
  ): Promise<ActivityHistoryItem> => {
    const item: ActivityHistoryItem = {
      id: `ah-${Date.now()}`,
      patientId,
      activityId,
      activityTitle,
      category,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      durationMinutes,
      userReflection: reflection || 'Completed with steady focus and feeling refreshed.',
    };
    return item;
  },

  getAlerts: async (): Promise<NexusAlert[]> => {
    return MOCK_ALERTS;
  },

  getHospitalReadiness: async (): Promise<HospitalReadinessMetrics> => {
    return MOCK_HOSPITAL_READINESS;
  },

  simulateEmergency: async (activate?: boolean) => {
    try {
      const res = await fetch('/api/simulate/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activate }),
      });
      return await res.json();
    } catch {
      return { active: activate !== undefined ? activate : true };
    }
  },

  simulateHospitalWhatIf: async (params: { surgePercentage: number; activeBedCapacity: number; icuCapacity: number }) => {
    try {
      const res = await fetch('/api/simulator/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch {
      const surgeMultiplier = 1 + params.surgePercentage / 100;
      return {
        surgePercentage: params.surgePercentage,
        projectedGeneralDemand: Math.round(72 * surgeMultiplier),
        projectedIcuDemand: Math.round(13 * surgeMultiplier),
        generalAvailable: Math.max(0, params.activeBedCapacity - Math.round(72 * surgeMultiplier)),
        icuAvailable: Math.max(0, params.icuCapacity - Math.round(13 * surgeMultiplier)),
        generalBedDeficit: Math.max(0, Math.round(72 * surgeMultiplier) - params.activeBedCapacity),
        icuBedDeficit: Math.max(0, Math.round(13 * surgeMultiplier) - params.icuCapacity),
        capacityStressScore: Math.min(100, Math.round(params.surgePercentage * 1.5 + 40)),
        readinessStatus: params.surgePercentage > 35 ? 'critical' : params.surgePercentage > 15 ? 'warning' : 'optimal',
        suggestedMitigations: [
          'Pre-position telemetry beds for intermediate triage',
          'Deploy on-call cardiac and ICU physician reserves',
          'Optimize outpatient discharge pipelines',
        ],
      };
    }
  },

  sendChatMessage: async (message: string, patientContext: any) => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, patientContext }),
      });
      return await res.json();
    } catch {
      return {
        reply: `Based on your recent cardiometabolic records (BP 148/94 mmHg, HbA1c 8.2%), these values reflect an upward shift requiring physician consultation.\n\n*Note: This information is for decision support and does not replace professional medical advice.*`,
        suggestedActions: [
          { label: 'View What Changed', actionTab: 'whatchanged' },
          { label: 'Review HealthPulse', actionTab: 'healthpulse' },
        ],
      };
    }
  },
};
