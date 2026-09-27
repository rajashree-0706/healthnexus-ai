import { MusicRecommendation, MusicTrack, WellBeingCheckIn } from '../types';

export interface WellBeingAnalysisResult {
  stressScore: number;
  stressLabel: 'Low / Optimal' | 'Moderate' | 'Elevated' | 'High';
  stressColor: string;
  wellBeingIndicator: number; // 0 - 10
  wellBeingLabel: 'Positive Resilience' | 'Stable / Balanced' | 'Needs Attention' | 'Low-Mood Indicators Detected';
  wellBeingColor: string;
  explanation: string;
  contributingFactors: {
    name: string;
    value: string;
    impact: 'positive' | 'neutral' | 'attention';
    weightPercent: number;
    description: string;
  }[];
  musicRecommendation: MusicRecommendation;
  wellnessRecommendations: {
    id: string;
    title: string;
    duration: string;
    category: string;
    description: string;
    actionLabel: string;
    actionType: 'breathing' | 'walk' | 'gratitude' | 'music' | 'connect';
  }[];
  trendComparison?: {
    stressDelta: { value: number; direction: 'up' | 'down' | 'same'; status: 'improving' | 'attention' | 'concern'; label: string };
    moodDelta: { current: string; previous: string; status: 'improving' | 'attention' | 'concern'; label: string };
    sleepDelta: { value: number; direction: 'up' | 'down' | 'same'; status: 'improving' | 'attention' | 'concern'; label: string };
    energyDelta: { value: number; direction: 'up' | 'down' | 'same'; status: 'improving' | 'attention' | 'concern'; label: string };
    motivationDelta: { value: number; direction: 'up' | 'down' | 'same'; status: 'improving' | 'attention' | 'concern'; label: string };
  };
}

// Curated Track Catalog for all 5 Mood Categories
export const CURATED_TRACKS: Record<MusicRecommendation['category'], MusicTrack[]> = {
  calm_instrumental: [
    {
      id: 'trk-calm-1',
      title: 'Piano Nocturne & Warm Rhodes',
      category: 'calm_instrumental',
      categoryLabel: 'Calm Instrumental',
      categoryIcon: '🎹',
      moodTarget: 'Calm & Reset',
      durationLabel: '5 min',
      durationSeconds: 300,
      description: 'Slow harmonic bell-like electric piano arpeggios crafted to quiet mental noise.',
      soundType: 'piano',
      bpm: 56,
    },
    {
      id: 'trk-calm-2',
      title: 'Serene Sanctuary Pads',
      category: 'calm_instrumental',
      categoryLabel: 'Calm Instrumental',
      categoryIcon: '🎹',
      moodTarget: 'Deep Relaxation',
      durationLabel: '8 min',
      durationSeconds: 480,
      description: 'Warm low-frequency atmospheric chords supporting parasympathetic relaxation.',
      soundType: 'piano',
      bpm: 50,
    },
  ],
  nature_sounds: [
    {
      id: 'trk-nature-1',
      title: 'Soft Rain & Windchime Stream',
      category: 'nature_sounds',
      categoryLabel: 'Nature Sounds',
      categoryIcon: '🌿',
      moodTarget: 'Restorative Stillness',
      durationLabel: '10 min',
      durationSeconds: 600,
      description: 'Continuous soothing rainfall soundscape paired with gentle pentatonic chimes.',
      soundType: 'nature',
    },
    {
      id: 'trk-nature-2',
      title: 'Forest Canopy Whispers',
      category: 'nature_sounds',
      categoryLabel: 'Nature Sounds',
      categoryIcon: '🌿',
      moodTarget: 'Centering',
      durationLabel: '6 min',
      durationSeconds: 360,
      description: 'Filtered acoustic ambiance reminiscent of a tranquil woodland clearing.',
      soundType: 'nature',
    },
  ],
  gentle_acoustic: [
    {
      id: 'trk-acoustic-1',
      title: 'Warm Acoustic Sunburst',
      category: 'gentle_acoustic',
      categoryLabel: 'Gentle Acoustic',
      categoryIcon: '🎸',
      moodTarget: 'Uplifting Comfort',
      durationLabel: '6 min',
      durationSeconds: 360,
      description: 'Fingerpicked nylon guitar progression in C-major with mellow harmonic warmth.',
      soundType: 'acoustic',
      bpm: 68,
    },
    {
      id: 'trk-acoustic-2',
      title: 'Morning Light Arpeggios',
      category: 'gentle_acoustic',
      categoryLabel: 'Gentle Acoustic',
      categoryIcon: '🎸',
      moodTarget: 'Positive Reflection',
      durationLabel: '5 min',
      durationSeconds: 300,
      description: 'Gentle acoustic string layers providing a cozy, supportive atmosphere.',
      soundType: 'acoustic',
      bpm: 72,
    },
  ],
  uplifting: [
    {
      id: 'trk-uplift-1',
      title: 'Hopeful Horizons Ambient',
      category: 'uplifting',
      categoryLabel: 'Uplifting',
      categoryIcon: '☀️',
      moodTarget: 'Optimism & Clarity',
      durationLabel: '7 min',
      durationSeconds: 420,
      description: 'Bright major-7th ambient progressions that gently elevate mood and perspective.',
      soundType: 'ambient',
      bpm: 80,
    },
    {
      id: 'trk-uplift-2',
      title: 'Golden Sunlight Flow',
      category: 'uplifting',
      categoryLabel: 'Uplifting',
      categoryIcon: '☀️',
      moodTarget: 'Vitality',
      durationLabel: '5 min',
      durationSeconds: 300,
      description: 'Harmonious warm synthesizer textures designed to inspire confidence.',
      soundType: 'ambient',
      bpm: 84,
    },
  ],
  light_energy: [
    {
      id: 'trk-energy-1',
      title: 'Brisk Step Lofi Groove',
      category: 'light_energy',
      categoryLabel: 'Light Energy',
      categoryIcon: '⚡',
      moodTarget: 'Active Momentum',
      durationLabel: '5 min',
      durationSeconds: 300,
      description: 'Upbeat 100-bpm soft rhythmic pulse ideal for pacing during light movement or walking.',
      soundType: 'pulse',
      bpm: 100,
    },
    {
      id: 'trk-energy-2',
      title: 'Sunrise Walk Companion',
      category: 'light_energy',
      categoryLabel: 'Light Energy',
      categoryIcon: '⚡',
      moodTarget: 'Focus & Drive',
      durationLabel: '8 min',
      durationSeconds: 480,
      description: 'Steady energizing rhythmic bassline with bright melodic counterpoints.',
      soundType: 'pulse',
      bpm: 104,
    },
  ],
};

export function analyzeWellBeing(
  current: {
    mood: 'great' | 'good' | 'okay' | 'low' | 'very_low' | 'stressed';
    stressLevel: number;
    sleepQuality: string;
    sleepHours: number;
    energyLevel: number;
    motivation: number;
    interestLevel: number;
    notes?: string;
  },
  previous?: WellBeingCheckIn | null
): WellBeingAnalysisResult {
  const stress = Math.min(10, Math.max(0, current.stressLevel));
  const energy = Math.min(10, Math.max(0, current.energyLevel));
  const motivation = Math.min(10, Math.max(0, current.motivation));
  const interest = Math.min(10, Math.max(0, current.interestLevel));

  // Mood weight score
  let moodScore = 5;
  if (current.mood === 'great') moodScore = 10;
  else if (current.mood === 'good') moodScore = 8;
  else if (current.mood === 'okay') moodScore = 5;
  else if (current.mood === 'low') moodScore = 3;
  else if (current.mood === 'very_low' || current.mood === 'stressed') moodScore = 2;

  // Sleep score
  let sleepScore = 5;
  if (current.sleepQuality === 'excellent' || current.sleepQuality === 'restful') sleepScore = 9;
  else if (current.sleepQuality === 'good') sleepScore = 7.5;
  else if (current.sleepQuality === 'average' || current.sleepQuality === 'fair') sleepScore = 5;
  else if (current.sleepQuality === 'poor' || current.sleepQuality === 'disrupted') sleepScore = 3;
  else if (current.sleepQuality === 'very_poor') sleepScore = 1.5;

  // Calculate composite Well-Being / Low-Mood Indicator (0 - 10)
  // Higher = more positive resilience, Lower = indicates lower well-being / needs attention
  const rawWellBeing =
    moodScore * 0.25 +
    (10 - stress) * 0.25 +
    energy * 0.15 +
    motivation * 0.15 +
    interest * 0.1 +
    sleepScore * 0.1;
  const wellBeingIndicator = Math.round(rawWellBeing * 10) / 10;

  // Determine Stress Label & Color
  let stressLabel: 'Low / Optimal' | 'Moderate' | 'Elevated' | 'High' = 'Moderate';
  let stressColor = '#3B82C4';
  if (stress <= 3) {
    stressLabel = 'Low / Optimal';
    stressColor = '#168A6A';
  } else if (stress <= 6) {
    stressLabel = 'Moderate';
    stressColor = '#3B82C4';
  } else if (stress <= 8) {
    stressLabel = 'Elevated';
    stressColor = '#D97706';
  } else {
    stressLabel = 'High';
    stressColor = '#DC5A5A';
  }

  // Determine Well-Being Indicator Label & Color (Strictly Non-Diagnostic)
  let wellBeingLabel: 'Positive Resilience' | 'Stable / Balanced' | 'Needs Attention' | 'Low-Mood Indicators Detected' =
    'Stable / Balanced';
  let wellBeingColor = '#3B82C4';
  if (wellBeingIndicator >= 7.5) {
    wellBeingLabel = 'Positive Resilience';
    wellBeingColor = '#168A6A';
  } else if (wellBeingIndicator >= 6.0) {
    wellBeingLabel = 'Stable / Balanced';
    wellBeingColor = '#3B82C4';
  } else if (wellBeingIndicator >= 4.0) {
    wellBeingLabel = 'Needs Attention';
    wellBeingColor = '#D97706';
  } else {
    wellBeingLabel = 'Low-Mood Indicators Detected';
    wellBeingColor = '#DC5A5A';
  }

  // Explainability rationale
  const contributingFactors: {
    name: string;
    value: string;
    impact: 'positive' | 'neutral' | 'attention';
    weightPercent: number;
    description: string;
  }[] = [
    {
      name: 'Reported Stress',
      value: `${stress} / 10 (${stressLabel})`,
      impact: stress <= 3 ? 'positive' : stress <= 6 ? 'neutral' : 'attention',
      weightPercent: 25,
      description:
        stress > 6
          ? 'Elevated perceived stress increases autonomic sympathetic tone and mental fatigue.'
          : 'Stress levels are within a manageable, balanced window.',
    },
    {
      name: 'Current Mood',
      value: `${current.mood.charAt(0).toUpperCase() + current.mood.slice(1).replace('_', ' ')}`,
      impact: moodScore >= 7 ? 'positive' : moodScore >= 5 ? 'neutral' : 'attention',
      weightPercent: 25,
      description:
        moodScore <= 4
          ? 'Low-mood indicators detected based on self-reported emotional valence today.'
          : 'Emotional state supports regular cognitive and social engagement.',
    },
    {
      name: 'Energy & Motivation',
      value: `Energy: ${energy}/10 | Motivation: ${motivation}/10`,
      impact: energy >= 6 && motivation >= 6 ? 'positive' : energy >= 4 ? 'neutral' : 'attention',
      weightPercent: 25,
      description:
        energy <= 4 || motivation <= 4
          ? 'Reduced daytime stamina and enthusiasm suggest a need for pacing and gentle micro-breaks.'
          : 'Adequate daytime drive to engage in regular daily habits.',
    },
    {
      name: 'Sleep Restorativeness',
      value: `${current.sleepHours} hrs (${current.sleepQuality.replace('_', ' ')})`,
      impact: sleepScore >= 7 ? 'positive' : sleepScore >= 5 ? 'neutral' : 'attention',
      weightPercent: 15,
      description:
        sleepScore <= 4
          ? 'Fragmented or shortened sleep impacts morning alertness and stress resilience.'
          : 'Restful sleep duration reinforces physiological baseline.',
    },
    {
      name: 'Interest in Activities',
      value: `${interest} / 10`,
      impact: interest >= 6 ? 'positive' : interest >= 4 ? 'neutral' : 'attention',
      weightPercent: 10,
      description:
        interest <= 4
          ? 'Lower engagement in usual hobbies is a common signal of cognitive overload.'
          : 'Consistent interest in everyday routines and hobbies.',
    },
  ];

  const explanation = `Your current result (${wellBeingIndicator}/10) is influenced by your reported stress (${stress}/10), sleep quality (${current.sleepQuality.replace('_', ' ')}), energy (${energy}/10), motivation (${motivation}/10), and mood (${current.mood}).`;

  // Select Personalized Music Category & Recommendation
  let musicCategory: MusicRecommendation['category'] = 'calm_instrumental';
  let musicHeadline = 'Calm & Reset';
  let musicReason = 'Your stress score is currently elevated. A calm music session may help create a relaxing environment.';
  let moodBadge = 'High Stress Relief';
  let durationRec = '5 - 10 min';

  if (stress >= 7) {
    musicCategory = 'calm_instrumental';
    musicHeadline = 'Calm & Reset';
    musicReason =
      'Your stress score is currently elevated. A calm music session may help create a relaxing environment and support parasympathetic recovery.';
    moodBadge = 'Soothing & Grounding';
    durationRec = '5 – 10 min';
  } else if (wellBeingIndicator < 5.0 || current.mood === 'low' || current.mood === 'very_low') {
    musicCategory = 'gentle_acoustic';
    musicHeadline = 'Gentle Acoustic Uplift';
    musicReason =
      'Your recent responses suggest lower well-being and energy. Gentle uplifting acoustic music may support a soothing, pleasant space.';
    moodBadge = 'Warm & Comforting';
    durationRec = '6 – 12 min';
  } else if (energy <= 5 && stress < 7) {
    musicCategory = 'light_energy';
    musicHeadline = 'Light Energy & Movement';
    musicReason =
      'Your reported energy is lower today. Light upbeat music may support an activity, gentle stretching, or a refreshing walk.';
    moodBadge = 'Gentle Momentum';
    durationRec = '5 – 8 min';
  } else if (wellBeingIndicator >= 7.5 || current.mood === 'great') {
    musicCategory = 'uplifting';
    musicHeadline = 'Positive Flow & Harmony';
    musicReason =
      'Your well-being profile shows positive emotional balance. Energetic, feel-good music may enhance your focus and daily creative flow.';
    moodBadge = 'Inspiring & Vibrant';
    durationRec = '7 – 15 min';
  } else {
    musicCategory = 'nature_sounds';
    musicHeadline = 'Nature Harmony';
    musicReason =
      'A balanced backdrop of gentle rainfall and natural soundscapes may help maintain mindful equilibrium.';
    moodBadge = 'Balanced Serenity';
    durationRec = '10 min';
  }

  const musicRecommendation: MusicRecommendation = {
    category: musicCategory,
    categoryTitle: CURATED_TRACKS[musicCategory][0].categoryLabel,
    categoryIcon: CURATED_TRACKS[musicCategory][0].categoryIcon,
    headline: musicHeadline,
    reason: musicReason,
    safetyDisclaimer:
      'Music recommendations are intended as low-risk supportive wellness activities and do not replace clinical therapy.',
    moodBadge,
    durationRecommendation: durationRec,
    recommendedTrack: CURATED_TRACKS[musicCategory][0],
    availableTracks: CURATED_TRACKS[musicCategory],
  };

  // Generate Personalized Wellness Recommendations (Low-risk supportive activities)
  const wellnessRecommendations: WellBeingAnalysisResult['wellnessRecommendations'] = [];

  if (stress >= 6) {
    wellnessRecommendations.push({
      id: 'rec-breath',
      title: '2-Minute Resonance Breathing',
      duration: '2 min',
      category: 'Autonomic Calm',
      description: 'Paced 4s inhale / 4s exhale to down-regulate acute sympathetic stress and lower pulse.',
      actionLabel: 'Launch 2-Min Reset',
      actionType: 'breathing',
    });
    wellnessRecommendations.push({
      id: 'rec-nature',
      title: 'Soothing Nature Sound Break',
      duration: '5 min',
      category: 'Sensory Reset',
      description: 'Listen to filtered rain soundscapes to quiet sensory overload.',
      actionLabel: 'Play Nature Sounds',
      actionType: 'music',
    });
    wellnessRecommendations.push({
      id: 'rec-stretch',
      title: 'Desk & Shoulder Mobility Stretch',
      duration: '4 min',
      category: 'Tension Relief',
      description: 'Gentle neck tilts and shoulder rolls to release upper-body muscular guarding.',
      actionLabel: 'Start Stretch Sequence',
      actionType: 'gratitude',
    });
  }

  if (energy <= 5) {
    wellnessRecommendations.push({
      id: 'rec-walk',
      title: '5-Minute Light Mindful Walk',
      duration: '5 min',
      category: 'Circulation',
      description: 'Step away from screens for a short stroll to stimulate glucose uptake and blood flow.',
      actionLabel: 'Begin Walk Guide',
      actionType: 'walk',
    });
    wellnessRecommendations.push({
      id: 'rec-hydration',
      title: 'Hydration & Posture Break',
      duration: '1 min',
      category: 'Self-Care',
      description: 'Drink a glass of water and take 3 deep diaphragmatic breaths.',
      actionLabel: 'Mark Completed',
      actionType: 'gratitude',
    });
  }

  if (wellBeingIndicator < 6.0 || current.mood === 'low' || current.mood === 'very_low') {
    wellnessRecommendations.push({
      id: 'rec-gratitude',
      title: '3-Point Gratitude & Reflection',
      duration: '3 min',
      category: 'Cognitive Reframing',
      description: 'Acknowledge 3 small positive moments or comforts from today.',
      actionLabel: 'Open Reflection Box',
      actionType: 'gratitude',
    });
    wellnessRecommendations.push({
      id: 'rec-connect',
      title: 'Micro Social Connection',
      duration: '3 min',
      category: 'Social Support',
      description: 'Send a quick warm message or call a trusted friend or family member.',
      actionLabel: 'Connect With Someone',
      actionType: 'connect',
    });
  }

  // Fallback defaults if list is short
  if (wellnessRecommendations.length < 3) {
    wellnessRecommendations.push({
      id: 'rec-mindful-moment',
      title: 'Mindful Breathing Break',
      duration: '2 min',
      category: 'Centering',
      description: 'A brief pause to check in with your posture and breath flow.',
      actionLabel: 'Start Breathing',
      actionType: 'breathing',
    });
  }

  // Trend Comparison against previous check-in
  let trendComparison: WellBeingAnalysisResult['trendComparison'] | undefined = undefined;
  if (previous) {
    const prevStress = previous.stressLevel;
    const stressDiff = stress - prevStress;
    const stressStatus: 'improving' | 'attention' | 'concern' =
      stressDiff < 0 ? 'improving' : stressDiff > 2 || stress >= 8 ? 'concern' : stressDiff > 0 ? 'attention' : 'improving';

    const prevEnergy = previous.energyLevel;
    const energyDiff = energy - prevEnergy;
    const energyStatus: 'improving' | 'attention' | 'concern' =
      energyDiff > 0 ? 'improving' : energyDiff < -2 || energy <= 3 ? 'concern' : energyDiff < 0 ? 'attention' : 'improving';

    const prevSleepHours = previous.sleepHours;
    const sleepDiff = Math.round((current.sleepHours - prevSleepHours) * 10) / 10;
    const sleepStatus: 'improving' | 'attention' | 'concern' =
      sleepDiff > 0 ? 'improving' : sleepDiff < -1.5 || current.sleepHours < 5 ? 'concern' : sleepDiff < 0 ? 'attention' : 'improving';

    const prevMotivation = previous.motivation ?? 6;
    const motivationDiff = motivation - prevMotivation;
    const motivationStatus: 'improving' | 'attention' | 'concern' =
      motivationDiff > 0 ? 'improving' : motivationDiff < -2 || motivation <= 3 ? 'concern' : motivationDiff < 0 ? 'attention' : 'improving';

    const moodRanks: Record<string, number> = { great: 5, good: 4, okay: 3, low: 2, very_low: 1, stressed: 1 };
    const currMoodRank = moodRanks[current.mood] || 3;
    const prevMoodRank = moodRanks[previous.mood] || 3;
    const moodStatus: 'improving' | 'attention' | 'concern' =
      currMoodRank > prevMoodRank ? 'improving' : currMoodRank < 2 ? 'concern' : currMoodRank < prevMoodRank ? 'attention' : 'improving';

    trendComparison = {
      stressDelta: {
        value: Math.abs(stressDiff),
        direction: stressDiff > 0 ? 'up' : stressDiff < 0 ? 'down' : 'same',
        status: stressStatus,
        label: stressDiff === 0 ? 'Stress unchanged' : `Stress ${stressDiff > 0 ? '↑' : '↓'} ${Math.abs(stressDiff)} points`,
      },
      moodDelta: {
        current: current.mood,
        previous: previous.mood,
        status: moodStatus,
        label: currMoodRank > prevMoodRank ? 'Mood Improving' : currMoodRank < prevMoodRank ? 'Mood Lower' : 'Mood Stable',
      },
      sleepDelta: {
        value: Math.abs(sleepDiff),
        direction: sleepDiff > 0 ? 'up' : sleepDiff < 0 ? 'down' : 'same',
        status: sleepStatus,
        label: sleepDiff === 0 ? 'Sleep unchanged' : `Sleep ${sleepDiff > 0 ? '↑' : '↓'} ${Math.abs(sleepDiff)} hrs`,
      },
      energyDelta: {
        value: Math.abs(energyDiff),
        direction: energyDiff > 0 ? 'up' : energyDiff < 0 ? 'down' : 'same',
        status: energyStatus,
        label: energyDiff === 0 ? 'Energy unchanged' : `Energy ${energyDiff > 0 ? '↑' : '↓'} ${Math.abs(energyDiff)} points`,
      },
      motivationDelta: {
        value: Math.abs(motivationDiff),
        direction: motivationDiff > 0 ? 'up' : motivationDiff < 0 ? 'down' : 'same',
        status: motivationStatus,
        label: motivationDiff === 0 ? 'Motivation unchanged' : `Motivation ${motivationDiff > 0 ? '↑' : '↓'} ${Math.abs(motivationDiff)} points`,
      },
    };
  }

  return {
    stressScore: stress,
    stressLabel,
    stressColor,
    wellBeingIndicator,
    wellBeingLabel,
    wellBeingColor,
    explanation,
    contributingFactors,
    musicRecommendation,
    wellnessRecommendations,
    trendComparison,
  };
}
