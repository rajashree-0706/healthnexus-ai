import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  CornerDownRight,
  ExternalLink,
  Flame,
  Footprints,
  Heart,
  HeartHandshake,
  HeartPulse,
  HelpCircle,
  History,
  Info,
  Layers,
  ListMusic,
  Minus,
  Moon,
  Music,
  Pause,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ActivityHistoryItem,
  MusicRecommendation,
  MusicTrack,
  Patient,
  TabType,
  WellBeingCheckIn,
  WellBeingScore,
} from '../types';
import { api } from '../services/api';
import { ambientAudio } from '../utils/audioSynth';
import { analyzeWellBeing, CURATED_TRACKS, WellBeingAnalysisResult } from '../utils/wellBeingAnalysis';

interface MentalWellBeingViewProps {
  patient: Patient;
  wellBeingData: { checkins: WellBeingCheckIn[]; score: WellBeingScore };
  onNavigate: (tab: TabType) => void;
  onOpenBreathing: () => void;
}

export const MentalWellBeingView: React.FC<MentalWellBeingViewProps> = ({
  patient,
  wellBeingData,
  onNavigate,
  onOpenBreathing,
}) => {
  // Check-In Form State
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'low' | 'very_low' | 'stressed'>('low');
  const [stressLevel, setStressLevel] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<string>('fair');
  const [sleepHours, setSleepHours] = useState<number>(5.5);
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [motivation, setMotivation] = useState<number>(4);
  const [interestLevel, setInterestLevel] = useState<number>(5);
  const [notes, setNotes] = useState<string>('Woke up feeling a bit fatigued and behind on chores.');

  // Data & Submission State
  const [checkIns, setCheckIns] = useState<WellBeingCheckIn[]>(wellBeingData.checkins);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(true);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [quickReflectionText, setQuickReflectionText] = useState('');
  const [completedActivities, setCompletedActivities] = useState<ActivityHistoryItem[]>([]);

  // Music Player State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(CURATED_TRACKS.calm_instrumental[0]);
  const [selectedMusicCategory, setSelectedMusicCategory] = useState<MusicRecommendation['category']>('calm_instrumental');
  const [musicElapsedSeconds, setMusicElapsedSeconds] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);

  // Load activity history on mount
  useEffect(() => {
    api.getActivityHistory(patient.id).then((items) => {
      setCompletedActivities(items);
    });

    // Wire up audio time updates
    ambientAudio.setOnTimeUpdate((secs) => {
      setMusicElapsedSeconds(secs);
    });

    return () => {
      ambientAudio.stop();
    };
  }, [patient.id]);

  // Current and previous check-in for analysis
  const latestCheckIn = checkIns[0] || null;
  const previousCheckIn = checkIns[1] || null;

  // Run Real-time AI Well-Being Analysis
  const analysis: WellBeingAnalysisResult = useMemo(() => {
    return analyzeWellBeing(
      {
        mood,
        stressLevel,
        sleepQuality,
        sleepHours,
        energyLevel,
        motivation,
        interestLevel,
        notes,
      },
      previousCheckIn
    );
  }, [mood, stressLevel, sleepQuality, sleepHours, energyLevel, motivation, interestLevel, notes, previousCheckIn]);

  // Sync current recommended track when analysis updates (if not manually playing another)
  useEffect(() => {
    if (!isPlayingMusic) {
      setCurrentTrack(analysis.musicRecommendation.recommendedTrack);
      setSelectedMusicCategory(analysis.musicRecommendation.category);
    }
  }, [analysis.musicRecommendation, isPlayingMusic]);

  // Mood Options
  const moodOptions = [
    { value: 'great', label: 'Great', emoji: '😊', desc: 'Positive & energized' },
    { value: 'good', label: 'Good', emoji: '🙂', desc: 'Pleasant & steady' },
    { value: 'okay', label: 'Okay', emoji: '😐', desc: 'Neutral / managing' },
    { value: 'low', label: 'Low', emoji: '😟', desc: 'Lower mood & fatigue' },
    { value: 'very_low', label: 'Very Low', emoji: '😔', desc: 'Struggling today' },
  ];

  const sleepQualityOptions = [
    { value: 'very_poor', label: 'Very Poor', desc: 'Severe disruption' },
    { value: 'poor', label: 'Poor', desc: 'Restless & waking' },
    { value: 'fair', label: 'Fair', desc: 'Average rest' },
    { value: 'good', label: 'Good', desc: 'Mostly refreshing' },
    { value: 'excellent', label: 'Excellent', desc: 'Deep & uninterrupted' },
  ];

  // Handle Form Submission
  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newEntry = await api.submitCheckIn({
        patientId: patient.id,
        mood,
        stressLevel,
        sleepQuality: sleepQuality as any,
        sleepHours,
        energyLevel,
        motivation,
        interestLevel,
        notes,
        wellBeingIndicator: analysis.wellBeingIndicator,
        stressIndicatorLabel: analysis.stressLabel,
        wellBeingIndicatorLabel: analysis.wellBeingLabel,
        musicRecommendation: analysis.musicRecommendation,
      });

      setCheckIns([newEntry, ...checkIns]);
      setHasSubmitted(true);
      setShowCheckInForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Music Player Handlers
  const handleTogglePlayMusic = (track?: MusicTrack) => {
    const trackToPlay = track || currentTrack;
    if (isPlayingMusic && ambientAudio.getCurrentTrackId() === trackToPlay.id) {
      ambientAudio.stop();
      setIsPlayingMusic(false);
    } else {
      setCurrentTrack(trackToPlay);
      ambientAudio.playTrack(trackToPlay.id, trackToPlay.soundType);
      setIsPlayingMusic(true);
    }
  };

  const handleSelectTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    ambientAudio.playTrack(track.id, track.soundType);
    setIsPlayingMusic(true);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    ambientAudio.setVolume(newVol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      ambientAudio.setVolume(volume || 0.4);
    } else {
      setIsMuted(true);
      ambientAudio.setVolume(0);
    }
  };

  // Handle logging a completed wellness activity
  const handleCompleteActivity = async (
    activityId: string,
    title: string,
    category: string,
    durationMinutes: number
  ) => {
    const newLog = await api.logActivityCompletion(
      patient.id,
      activityId,
      title,
      category,
      durationMinutes,
      quickReflectionText || 'Completed supportive wellness activity. Felt more grounded and calm.'
    );
    setCompletedActivities([newLog, ...completedActivities]);
    setQuickReflectionText('');
  };

  // Format audio seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 7-day trend chart data
  const chartData = [
    { day: 'Mon', stress: 5, sleep: 7.0, energy: 7, motivation: 8 },
    { day: 'Tue', stress: 5, sleep: 6.8, energy: 7, motivation: 7 },
    { day: 'Wed', stress: 6, sleep: 6.2, energy: 6, motivation: 6 },
    { day: 'Thu', stress: 7, sleep: 5.8, energy: 5, motivation: 5 },
    { day: 'Fri', stress: 8, sleep: 5.2, energy: 4, motivation: 4 },
    { day: 'Sat', stress: 6, sleep: 6.5, energy: 6, motivation: 6 },
    { day: 'Sun (Today)', stress: stressLevel, sleep: sleepHours, energy: energyLevel, motivation },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Mind-Body Physiological Context */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F7F1] flex items-center justify-center text-[#168A6A]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">Mental Well-Being</h1>
              <span className="text-xs text-[#64748B]">
                Check-In &bull; AI Well-Being Analysis &bull; Personalized Wellness &bull; Music Therapy
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCheckInForm(!showCheckInForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5EAEA] hover:bg-[#F8FAFA] text-[#16302A] text-xs font-bold transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#168A6A]" />
            <span>{showCheckInForm ? 'Close Check-In' : 'New Check-In'}</span>
          </button>

          <button
            onClick={onOpenBreathing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white text-xs font-bold shadow-xs transition-all"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Launch 2-Min Reset</span>
          </button>
        </div>
      </div>

      {/* Mind-Body Axis Context Banner */}
      <div className="bg-gradient-to-r from-[#E8F7F1] via-white to-[#EAF4FB] rounded-2xl p-5 border border-[#168A6A]/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#168A6A]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#16302A]">
              Whole Health View: The Autonomic Mind-Body Axis
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#168A6A] bg-white px-2.5 py-0.5 rounded-full border border-[#168A6A]/20">
            Bidirectional Link
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/90 border border-[#E5EAEA] shadow-xs">
            <span className="font-bold text-[#DC5A5A] flex items-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Stress &rarr; Blood Pressure</span>
            </span>
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Sympathetic nervous activation triggers vasoconstriction, elevating vascular resistance.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/90 border border-[#E5EAEA] shadow-xs">
            <span className="font-bold text-[#D97706] flex items-center gap-1 mb-1">
              <Moon className="w-3.5 h-3.5" />
              <span>Sleep &rarr; Insulin Sensitivity</span>
            </span>
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Shortened sleep elevates morning cortisol, directly affecting fasting glucose control.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/90 border border-[#E5EAEA] shadow-xs">
            <span className="font-bold text-[#168A6A] flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Breathing &amp; Music &rarr; Vagal Tone</span>
            </span>
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Resonance breathing and soothing acoustic soundscapes stimulate parasympathetic calming.
            </p>
          </div>
        </div>
      </div>

      {/* 2. SECTION 1: WELL-BEING CHECK-IN FORM */}
      <div className="bg-white rounded-2xl border border-[#E5EAEA] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAEA] flex items-center justify-between bg-gradient-to-r from-white to-[#F8FAFA]">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-[#168A6A]" />
            <div>
              <h2 className="text-base font-bold text-[#16302A]">Today&apos;s Mindful Well-Being Check-In</h2>
              <p className="text-xs text-[#64748B]">
                Take 60 seconds to self-reflect and generate personalized wellness &amp; music insights.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCheckInForm(!showCheckInForm)}
            className="text-xs font-bold text-[#168A6A] hover:underline flex items-center gap-1"
          >
            <span>{showCheckInForm ? 'Hide Form' : 'Edit Responses'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCheckInForm ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showCheckInForm && (
          <form onSubmit={handleCheckInSubmit} className="p-6 space-y-6">
            {/* Q1: How are you feeling today? */}
            <div>
              <label className="text-xs font-bold text-[#16302A] block mb-2">
                1. How are you feeling today?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {moodOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setMood(opt.value as any)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      mood === opt.value
                        ? 'bg-[#E8F7F1] border-[#168A6A] text-[#168A6A] shadow-xs font-bold scale-[1.02]'
                        : 'bg-[#F8FAFA] border-[#E5EAEA] text-[#64748B] hover:bg-white hover:border-[#168A6A]/40'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[10px] opacity-75">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 & Q3: Stress Level & Sleep */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-[#E5EAEA]">
              {/* Stress Level */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#16302A] mb-1.5">
                  <span>2. Stress Level (0 - 10):</span>
                  <span
                    className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                      stressLevel <= 3
                        ? 'bg-[#E8F7F1] text-[#168A6A]'
                        : stressLevel <= 6
                        ? 'bg-[#EAF4FB] text-[#3B82C4]'
                        : 'bg-[#FEE2E2] text-[#DC5A5A]'
                    }`}
                  >
                    {stressLevel} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="w-full accent-[#168A6A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B] mt-1 font-medium">
                  <span>0 (Serene &amp; Calm)</span>
                  <span>5 (Moderate Pressure)</span>
                  <span>10 (High Tension)</span>
                </div>
              </div>

              {/* Sleep Quality & Hours */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#16302A] mb-1.5">
                  <span>3. Sleep Quality &amp; Duration:</span>
                  <span className="text-xs font-bold text-[#3B82C4]">{sleepHours} hrs</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value)}
                    className="w-full text-xs font-medium bg-[#F8FAFA] p-2.5 rounded-xl border border-[#E5EAEA] text-[#16302A] focus:outline-none focus:border-[#168A6A]"
                  >
                    {sleepQualityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.desc})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1 bg-[#F8FAFA] px-3 py-2 rounded-xl border border-[#E5EAEA]">
                    <Moon className="w-3.5 h-3.5 text-[#3B82C4] shrink-0" />
                    <input
                      type="number"
                      step="0.5"
                      min="2"
                      max="14"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-transparent text-[#16302A] focus:outline-none"
                    />
                    <span className="text-[11px] text-[#64748B]">hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Q4, Q5, Q6: Energy, Motivation, Interest in activities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E5EAEA]">
              {/* Energy Level */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#16302A] mb-1">
                  <span>4. Energy Level:</span>
                  <span className="text-xs font-bold text-[#168A6A]">{energyLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-[#168A6A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>0 (Exhausted)</span>
                  <span>10 (Vibrant)</span>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#16302A] mb-1">
                  <span>5. Motivation:</span>
                  <span className="text-xs font-bold text-[#3B82C4]">{motivation} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={motivation}
                  onChange={(e) => setMotivation(Number(e.target.value))}
                  className="w-full accent-[#3B82C4] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>0 (Very Low)</span>
                  <span>10 (High Drive)</span>
                </div>
              </div>

              {/* Interest in usual activities */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#16302A] mb-1">
                  <span>6. Interest in Activities:</span>
                  <span className="text-xs font-bold text-[#D97706]">{interestLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={interestLevel}
                  onChange={(e) => setInterestLevel(Number(e.target.value))}
                  className="w-full accent-[#D97706] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>0 (Detached)</span>
                  <span>10 (Engaged)</span>
                </div>
              </div>
            </div>

            {/* Q7: Optional Note */}
            <div className="pt-2 border-t border-[#E5EAEA]">
              <label className="text-xs font-bold text-[#16302A] block mb-1.5">
                7. Optional Note: &quot;How has your day been?&quot;
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any thoughts, deadlines, physical sensations, or positive moments..."
                className="w-full bg-[#F8FAFA] text-xs p-3 rounded-xl border border-[#E5EAEA] focus:outline-none focus:border-[#168A6A] text-[#16302A]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white text-xs font-bold shadow-md shadow-[#168A6A]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Analyzing Responses...' : 'Analyze My Well-Being'}</span>
            </button>
          </form>
        )}
      </div>

      {/* 3. SECTION 2: AI WELL-BEING ANALYSIS & SNAPSHOT */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5EAEA]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              AI Well-Being Analysis
            </span>
            <h2 className="text-base font-bold text-[#16302A]">Your Well-Being Snapshot</h2>
          </div>
          <span className="text-[11px] font-bold bg-[#E8F7F1] text-[#168A6A] px-2.5 py-1 rounded-full border border-[#168A6A]/20 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Non-Diagnostic Evaluation</span>
          </span>
        </div>

        {/* Dual Indicators: Stress Level & Well-Being / Low-Mood Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Indicator 1: Stress Level */}
          <div className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Perceived Stress Level</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${analysis.stressColor}15`, color: analysis.stressColor }}
              >
                {analysis.stressLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#16302A]">{analysis.stressScore}</span>
              <span className="text-xs text-[#64748B]">/ 10</span>
              <span className="text-xs font-semibold text-[#64748B] ml-2">
                {analysis.stressScore >= 7
                  ? 'Elevated sympathetic tension'
                  : analysis.stressScore >= 4
                  ? 'Manageable daily pressure'
                  : 'Optimal calm state'}
              </span>
            </div>
            {/* Meter Bar */}
            <div className="w-full bg-[#E5EAEA] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${analysis.stressScore * 10}%`,
                  backgroundColor: analysis.stressColor,
                }}
              />
            </div>
          </div>

          {/* Indicator 2: Well-Being / Low-Mood Indicator */}
          <div className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Well-Being / Low-Mood Indicator
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${analysis.wellBeingColor}15`, color: analysis.wellBeingColor }}
              >
                {analysis.wellBeingLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#16302A]">{analysis.wellBeingIndicator}</span>
              <span className="text-xs text-[#64748B]">/ 10</span>
              <span className="text-xs font-semibold text-[#64748B] ml-2">
                {analysis.wellBeingIndicator < 4.5
                  ? 'Low-mood indicators detected'
                  : analysis.wellBeingIndicator < 7.0
                  ? 'Needs gentle attention'
                  : 'Positive emotional reserve'}
              </span>
            </div>
            {/* Meter Bar */}
            <div className="w-full bg-[#E5EAEA] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${analysis.wellBeingIndicator * 10}%`,
                  backgroundColor: analysis.wellBeingColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Medical Safety &amp; Non-Diagnostic Protocol:</p>
            <p className="text-[11px] leading-relaxed">
              Well-Being insights are based strictly on your self-reported responses and <strong>are not a medical diagnosis</strong>. If you are experiencing persistent distress, feelings of hopelessness, or emotional strain, we encourage you to consult a qualified mental-health professional or reach out to supportive healthcare services.
            </p>
          </div>
        </div>
      </div>

      {/* 4. SECTION 3: EXPLAINABLE RESULT ("Why did AI give me this result?") */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAEA]">
          <HelpCircle className="w-5 h-5 text-[#168A6A]" />
          <div>
            <h3 className="font-bold text-sm text-[#16302A]">Why did AI give me this result?</h3>
            <p className="text-xs text-[#64748B]">
              Transparent breakdown of your self-reported data factors. No symptoms were invented.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#16302A] leading-relaxed bg-[#F8FAFA] p-3.5 rounded-xl border border-[#E5EAEA]">
          {analysis.explanation}
        </p>

        {/* Factors Breakdown Table / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.contributingFactors.map((f, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E5EAEA] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#16302A]">{f.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    f.impact === 'positive'
                      ? 'bg-[#E8F7F1] text-[#168A6A]'
                      : f.impact === 'neutral'
                      ? 'bg-[#EAF4FB] text-[#3B82C4]'
                      : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}
                >
                  {f.impact === 'positive' ? 'Positive' : f.impact === 'neutral' ? 'Stable' : 'Needs Attention'}
                </span>
              </div>
              <div className="text-xs font-extrabold text-[#16302A]">{f.value}</div>
              <p className="text-[11px] text-[#64748B] leading-tight">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SECTION 4: TREND ANALYSIS */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#3B82C4]" />
            <div>
              <h3 className="font-bold text-sm text-[#16302A]">Your Recent Trend Comparison</h3>
              <p className="text-xs text-[#64748B]">
                Comparing today&apos;s responses against your previous check-in.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#3B82C4] bg-[#EAF4FB] px-2.5 py-1 rounded-full">
            7-Day Longitudinal
          </span>
        </div>

        {/* Delta Stat Chips */}
        {analysis.trendComparison && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Stress Delta */}
            <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#64748B]">Stress Trajectory</span>
              <div className="flex items-center gap-1 font-bold text-xs">
                {analysis.trendComparison.stressDelta.status === 'improving' ? (
                  <span className="text-[#168A6A] flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>🟢 Improving</span>
                  </span>
                ) : analysis.trendComparison.stressDelta.status === 'concern' ? (
                  <span className="text-[#DC5A5A] flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>🔴 Significant Concern</span>
                  </span>
                ) : (
                  <span className="text-[#D97706] flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>🟠 Needs Attention</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">{analysis.trendComparison.stressDelta.label}</p>
            </div>

            {/* Mood Delta */}
            <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#64748B]">Mood Valence</span>
              <div className="flex items-center gap-1 font-bold text-xs">
                {analysis.trendComparison.moodDelta.status === 'improving' ? (
                  <span className="text-[#168A6A]">🟢 Improving</span>
                ) : analysis.trendComparison.moodDelta.status === 'concern' ? (
                  <span className="text-[#DC5A5A]">🔴 Lower Mood</span>
                ) : (
                  <span className="text-[#D97706]">🟠 Needs Attention</span>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">{analysis.trendComparison.moodDelta.label}</p>
            </div>

            {/* Sleep Delta */}
            <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#64748B]">Sleep Duration</span>
              <div className="flex items-center gap-1 font-bold text-xs">
                {analysis.trendComparison.sleepDelta.status === 'improving' ? (
                  <span className="text-[#168A6A]">🟢 Restful</span>
                ) : analysis.trendComparison.sleepDelta.status === 'concern' ? (
                  <span className="text-[#DC5A5A]">🔴 Disrupted</span>
                ) : (
                  <span className="text-[#D97706]">🟠 Needs Attention</span>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">{analysis.trendComparison.sleepDelta.label}</p>
            </div>

            {/* Energy Delta */}
            <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#64748B]">Energy Level</span>
              <div className="flex items-center gap-1 font-bold text-xs">
                {analysis.trendComparison.energyDelta.status === 'improving' ? (
                  <span className="text-[#168A6A]">🟢 Higher</span>
                ) : analysis.trendComparison.energyDelta.status === 'concern' ? (
                  <span className="text-[#DC5A5A]">🔴 Fatigue</span>
                ) : (
                  <span className="text-[#D97706]">🟠 Needs Attention</span>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">{analysis.trendComparison.energyDelta.label}</p>
            </div>

            {/* Motivation Delta */}
            <div className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#64748B]">Motivation</span>
              <div className="flex items-center gap-1 font-bold text-xs">
                {analysis.trendComparison.motivationDelta.status === 'improving' ? (
                  <span className="text-[#168A6A]">🟢 Steady</span>
                ) : (
                  <span className="text-[#D97706]">🟠 Needs Attention</span>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">{analysis.trendComparison.motivationDelta.label}</p>
            </div>
          </div>
        )}

        {/* 7-Day Line Chart */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
            <span>7-Day Trajectory (Stress vs. Sleep vs. Energy vs. Motivation)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC5A5A]" /> Stress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82C4]" /> Sleep (Hrs)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#168A6A]" /> Energy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Motivation
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5EAEA',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="stress" name="Stress Level" stroke="#DC5A5A" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sleep" name="Sleep (Hrs)" stroke="#3B82C4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="energy" name="Energy" stroke="#168A6A" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="motivation" name="Motivation" stroke="#D97706" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. SECTION 5: PERSONALIZED WELLNESS RECOMMENDATIONS */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#168A6A]" />
            <div>
              <h3 className="font-bold text-sm text-[#16302A]">Personalized Wellness Recommendations</h3>
              <p className="text-xs text-[#64748B]">
                Supportive, low-risk micro-interventions tailored directly to your current responses.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('activities')}
            className="text-xs font-bold text-[#168A6A] hover:underline flex items-center gap-1"
          >
            <span>All Activities</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.wellnessRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-[#F8FAFA] hover:bg-white border border-[#E5EAEA] hover:border-[#168A6A]/40 transition-all shadow-xs flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#168A6A] bg-[#E8F7F1] px-2 py-0.5 rounded-full">
                    {rec.category}
                  </span>
                  <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{rec.duration}</span>
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#16302A] group-hover:text-[#168A6A] transition-colors">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{rec.description}</p>
              </div>

              <div>
                {rec.actionType === 'breathing' ? (
                  <button
                    onClick={onOpenBreathing}
                    className="w-full py-2 rounded-lg bg-[#168A6A] hover:bg-[#127257] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>{rec.actionLabel}</span>
                  </button>
                ) : rec.actionType === 'music' ? (
                  <button
                    onClick={() => handleTogglePlayMusic(CURATED_TRACKS.nature_sounds[0])}
                    className="w-full py-2 rounded-lg bg-[#3B82C4] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>{rec.actionLabel}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleCompleteActivity(rec.id, rec.title, rec.category, 3)}
                    className="w-full py-2 rounded-lg bg-white border border-[#E5EAEA] hover:border-[#168A6A] hover:bg-[#E8F7F1] text-[#16302A] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#168A6A]" />
                    <span>{rec.actionLabel}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. SECTION 6 & 7: 🎵 MUSIC FOR YOUR MOOD & MUSIC RECOMMENDATION CARD */}
      <div className="bg-gradient-to-br from-white via-[#F8FAFA] to-[#E8F7F1]/30 rounded-2xl p-6 border border-[#168A6A]/30 shadow-xs space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F7F1] flex items-center justify-center text-[#168A6A]">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#16302A]">🎵 Music For Your Mood</h3>
              <p className="text-xs text-[#64748B]">
                Curated acoustic soundscapes &amp; melodies to support relaxation, focus, or gentle movement.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#168A6A] bg-[#E8F7F1] px-2.5 py-1 rounded-full border border-[#168A6A]/20">
            Interactive Web Audio
          </span>
        </div>

        {/* 🎧 Main Recommended For You Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{analysis.musicRecommendation.categoryIcon}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#168A6A] block">
                  🎧 Recommended For You
                </span>
                <h4 className="font-black text-base text-[#16302A]">{analysis.musicRecommendation.headline}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#3B82C4] bg-[#EAF4FB] px-2.5 py-1 rounded-full">
                {analysis.musicRecommendation.moodBadge}
              </span>
              <span className="text-xs text-[#64748B] flex items-center gap-1 font-medium bg-[#F8FAFA] px-2 py-1 rounded-lg border border-[#E5EAEA]">
                <Clock className="w-3 h-3" />
                <span>{analysis.musicRecommendation.durationRecommendation}</span>
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] text-xs text-[#16302A] space-y-1">
            <span className="font-bold text-[#168A6A] block">Why this music recommendation?</span>
            <p className="leading-relaxed text-[#64748B]">{analysis.musicRecommendation.reason}</p>
          </div>

          {/* Active Audio Player Deck */}
          <div className="p-4 rounded-xl bg-[#16302A] text-white shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTogglePlayMusic(currentTrack)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transition-all shadow-md ${
                    isPlayingMusic
                      ? 'bg-[#DC5A5A] hover:bg-[#C84848] scale-105 animate-pulse'
                      : 'bg-[#168A6A] hover:bg-[#127257] scale-100 hover:scale-105'
                  }`}
                  title={isPlayingMusic ? 'Pause Music' : 'Play Music'}
                >
                  {isPlayingMusic ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <div>
                  <span className="text-[10px] text-[#A7F3D0] uppercase tracking-wider font-bold block">
                    {isPlayingMusic ? 'Now Playing Ambient Stream' : 'Ready to Play'}
                  </span>
                  <h5 className="font-bold text-sm text-white">{currentTrack.title}</h5>
                  <span className="text-xs text-slate-300">
                    {currentTrack.categoryLabel} &bull; {currentTrack.durationLabel}
                  </span>
                </div>
              </div>

              {/* Volume & Controls */}
              <div className="flex items-center gap-3">
                <button onClick={handleToggleMute} className="text-slate-300 hover:text-white transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 accent-[#168A6A] cursor-pointer"
                />
                <span className="text-xs text-slate-300 w-12 font-mono">
                  {formatTime(musicElapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Visualizer animation bar */}
            {isPlayingMusic && (
              <div className="flex items-center gap-1 h-3 pt-1">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#168A6A] rounded-full animate-pulse"
                    style={{
                      height: `${Math.max(20, Math.sin((i + musicElapsedSeconds) * 0.8) * 100)}%`,
                      animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Category Selector Tabs */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#16302A] block">Explore Mood Categories:</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(
                [
                  { id: 'calm_instrumental', label: 'Calm Instrumental', icon: '🎹', desc: 'Piano & Rhodes' },
                  { id: 'nature_sounds', label: 'Nature Sounds', icon: '🌿', desc: 'Rain & Streams' },
                  { id: 'gentle_acoustic', label: 'Gentle Acoustic', icon: '🎸', desc: 'Warm Nylon Guitar' },
                  { id: 'uplifting', label: 'Uplifting', icon: '☀️', desc: 'Hopeful Ambient' },
                  { id: 'light_energy', label: 'Light Energy', icon: '⚡', desc: 'Lofi Momentum' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedMusicCategory(cat.id);
                    const firstTrack = CURATED_TRACKS[cat.id][0];
                    if (firstTrack) {
                      setCurrentTrack(firstTrack);
                      if (isPlayingMusic) {
                        ambientAudio.playTrack(firstTrack.id, firstTrack.soundType);
                      }
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedMusicCategory === cat.id
                      ? 'bg-[#E8F7F1] border-[#168A6A] text-[#168A6A] font-bold shadow-xs'
                      : 'bg-[#F8FAFA] border-[#E5EAEA] text-[#64748B] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{cat.icon}</span>
                    {selectedMusicCategory === cat.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#168A6A]" />
                    )}
                  </div>
                  <span className="text-xs font-bold leading-tight block">{cat.label}</span>
                  <span className="text-[10px] opacity-75">{cat.desc}</span>
                </button>
              ))}
            </div>

            {/* Tracklist for Selected Category */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Available Tracks ({CURATED_TRACKS[selectedMusicCategory].length})
              </span>
              <div className="space-y-1">
                {CURATED_TRACKS[selectedMusicCategory].map((track) => {
                  const isThisPlaying = isPlayingMusic && currentTrack.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isThisPlaying
                          ? 'bg-[#E8F7F1] border-[#168A6A] text-[#168A6A] font-bold shadow-xs'
                          : 'bg-white border-[#E5EAEA] hover:bg-[#F8FAFA] text-[#16302A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            isThisPlaying ? 'bg-[#168A6A] text-white' : 'bg-[#F8FAFA] text-[#64748B]'
                          }`}
                        >
                          {isThisPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>
                        <div>
                          <span className="text-xs font-bold block">{track.title}</span>
                          <span className="text-[11px] text-[#64748B]">{track.description}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#64748B] shrink-0 ml-2">{track.durationLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Non-Claim Safety Wording */}
          <p className="text-[11px] text-[#64748B] italic pt-1 border-t border-[#E5EAEA]">
            * Supportive Notice: Music may help you relax, support a calming routine, or serve as a pleasant daily activity. It is not intended as medical therapy or clinical intervention.
          </p>
        </div>
      </div>

      {/* 8. SECTION 8: ACTIVITY HISTORY */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#168A6A]" />
            <div>
              <h3 className="font-bold text-sm text-[#16302A]">Activity History</h3>
              <p className="text-xs text-[#64748B]">
                Your log of completed wellness practices and mindful reflections.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#168A6A] bg-[#E8F7F1] px-2.5 py-1 rounded-full">
            {completedActivities.length} Sessions Logged
          </span>
        </div>

        {/* Quick Log Input */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] flex flex-wrap sm:flex-nowrap items-center gap-2">
          <input
            type="text"
            value={quickReflectionText}
            onChange={(e) => setQuickReflectionText(e.target.value)}
            placeholder="Log a reflection (e.g. 'Did 5-minute walk outside, shoulders feel lighter')..."
            className="flex-1 text-xs bg-white p-2.5 rounded-xl border border-[#E5EAEA] focus:outline-none focus:border-[#168A6A] text-[#16302A]"
          />
          <button
            onClick={() =>
              handleCompleteActivity('act-custom-reflect', 'Mindful Reflection', 'reflect', 2)
            }
            disabled={!quickReflectionText.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#168A6A] hover:bg-[#127257] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Save Reflection</span>
          </button>
        </div>

        {/* Activity Items List */}
        <div className="space-y-2">
          {completedActivities.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F7F1] flex items-center justify-center text-[#168A6A] shrink-0 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#16302A]">{item.activityTitle}</span>
                    <span className="text-[10px] font-bold text-[#168A6A] bg-[#E8F7F1] px-1.5 py-0.2 rounded">
                      {item.category}
                    </span>
                  </div>
                  {item.userReflection && (
                    <p className="text-xs text-[#64748B] italic mt-0.5">&quot;{item.userReflection}&quot;</p>
                  )}
                </div>
              </div>

              <div className="text-right text-xs text-[#64748B] shrink-0">
                <span className="font-medium block">{item.completedAt}</span>
                <span className="text-[10px]">{item.durationMinutes} min session</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. SAFETY, ETHICS & MENTAL HEALTH CRISIS SUPPORT */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
        <div className="flex items-start gap-2.5 max-w-2xl">
          <ShieldAlert className="w-4 h-4 text-[#168A6A] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#16302A] block">Need Urgent Support or Clinical Help?</span>
            <p className="text-[11px] leading-relaxed">
              If you or someone you know is struggling or in crisis, help is available. Speak with your physician or contact the 24/7 Suicide &amp; Crisis Lifeline by dialing or texting <strong>988</strong> (US) or your local emergency healthcare center.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF4FB] text-[#3B82C4] font-bold text-xs border border-[#3B82C4]/20">
            <Phone className="w-3.5 h-3.5" />
            <span>Call / Text 988</span>
          </div>
        </div>
      </div>
    </div>
  );
};
