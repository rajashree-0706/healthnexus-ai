import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  Flame,
  Heart,
  Music,
  Play,
  RotateCcw,
  ShieldCheck,
  Smile,
  Sparkles,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { ActivityHistoryItem, MentalActivity, Patient } from '../types';
import { api } from '../services/api';

interface ActivitiesViewProps {
  patient: Patient;
  activities: MentalActivity[];
  activityHistory: ActivityHistoryItem[];
  onOpenBreathingModal: () => void;
  onActivityLogged?: () => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  patient,
  activities,
  activityHistory,
  onOpenBreathingModal,
  onActivityLogged,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSound, setActiveSound] = useState<'rain' | 'ocean' | 'binaural' | null>(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [historyList, setHistoryList] = useState<ActivityHistoryItem[]>(activityHistory);

  // Web Audio ambient soundscape synthesizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ source?: AudioNode; gain?: GainNode }>({});

  const stopSound = () => {
    try {
      if (soundNodesRef.current.source) {
        (soundNodesRef.current.source as any).stop?.();
        soundNodesRef.current.source.disconnect();
      }
    } catch {}
    setSoundPlaying(false);
    setActiveSound(null);
  };

  const playAmbient = (type: 'rain' | 'ocean' | 'binaural') => {
    stopSound();
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'rain') {
        // Pink / White noise filter buffer for gentle rainfall
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 2.5;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const gain = ctx.createGain();
        gain.gain.value = 0.15;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();

        soundNodesRef.current = { source: noise, gain };
      } else if (type === 'ocean') {
        // Low oscillating drone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 110;
        const gain = ctx.createGain();
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        soundNodesRef.current = { source: osc, gain };
      } else {
        // 432Hz Calm resonance tone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 432;
        const gain = ctx.createGain();
        gain.gain.value = 0.08;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        soundNodesRef.current = { source: osc, gain };
      }

      setActiveSound(type);
      setSoundPlaying(true);
    } catch {
      // Auto-play blocked
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const categories = ['All', 'Calm', 'Move', 'Reflect', 'Relax', 'Connect'];

  const filteredActivities =
    selectedCategory === 'All'
      ? activities
      : activities.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleCompleteActivity = async (act: MentalActivity) => {
    const item = await api.logActivityCompletion(
      patient.id,
      act.id,
      act.title,
      act.category,
      act.durationMinutes,
      'Completed mindful micro-intervention.'
    );
    setHistoryList([item, ...historyList]);
    if (onActivityLogged) onActivityLogged();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#168A6A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">
              Mindful Activities & Autonomic Interventions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Evidence-based micro-practices designed to reduce sympathetic overdrive, promote parasympathetic tone, and lower blood pressure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBreathingModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white text-xs font-bold shadow-xs transition-all"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Launch 2-Min Reset</span>
          </button>
        </div>
      </div>

      {/* Ambient Soundscape Player Card */}
      <div className="bg-gradient-to-r from-[#E8F7F1] via-white to-[#EAF4FB] rounded-2xl p-5 border border-[#168A6A]/20 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#168A6A] text-white flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#16302A]">Ambient Relaxation Synthesizer</h3>
            <p className="text-xs text-[#64748B]">Real-time calming audio generation (Zero network files required)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (activeSound === 'rain' ? stopSound() : playAmbient('rain'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSound === 'rain'
                ? 'bg-[#168A6A] text-white shadow-xs'
                : 'bg-white border border-[#E5EAEA] text-[#16302A] hover:bg-[#E8F7F1]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{activeSound === 'rain' ? 'Stop Rain' : 'Gentle Rain'}</span>
          </button>

          <button
            onClick={() => (activeSound === 'ocean' ? stopSound() : playAmbient('ocean'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSound === 'ocean'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'bg-white border border-[#E5EAEA] text-[#16302A] hover:bg-[#EAF4FB]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{activeSound === 'ocean' ? 'Stop Ocean' : 'Ocean Drone'}</span>
          </button>

          <button
            onClick={() => (activeSound === 'binaural' ? stopSound() : playAmbient('binaural'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSound === 'binaural'
                ? 'bg-[#9333EA] text-white shadow-xs'
                : 'bg-white border border-[#E5EAEA] text-[#16302A] hover:bg-[#F3E8FF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeSound === 'binaural' ? 'Stop 432Hz' : '432Hz Tone'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-3 rounded-2xl border border-[#E5EAEA] shadow-xs">
        <span className="text-xs font-bold text-[#64748B] mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#168A6A] text-white shadow-xs'
                : 'bg-[#F8FAFA] text-[#64748B] hover:bg-[#E8F7F1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredActivities.map((act) => {
          const isBreathing = act.id === 'act-breathing-box';
          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs hover:border-[#168A6A]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#E8F7F1] text-[#168A6A]">
                    {act.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{act.durationMinutes} min</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#16302A] mb-1">{act.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{act.description}</p>
              </div>

              <div className="pt-3 border-t border-[#E5EAEA] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#64748B]">
                  Level: <strong className="text-[#16302A]">{act.difficulty}</strong>
                </span>

                {isBreathing ? (
                  <button
                    onClick={onOpenBreathingModal}
                    className="px-3.5 py-1.5 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Start Breathing</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleCompleteActivity(act)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFA] hover:bg-[#E8F7F1] text-[#168A6A] border border-[#168A6A]/20 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Done</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed History List */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAEA]">
          <h3 className="font-bold text-sm text-[#16302A] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#168A6A]" />
            <span>Activity History & Mindful Micro-Logs</span>
          </h3>
          <span className="text-xs text-[#64748B]">{historyList.length} Sessions Completed</span>
        </div>

        <div className="space-y-2.5">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F7F1] text-[#168A6A] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#16302A]">{item.activityTitle}</h4>
                  <p className="text-[11px] text-[#64748B]">{item.userReflection}</p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-[#168A6A]">{item.durationMinutes} mins</span>
                <span className="block text-[10px] text-[#64748B]">{item.completedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
