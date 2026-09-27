import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Wind,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Patient } from '../types';

interface BreathingExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onActivityCompleted?: () => void;
}

export const BreathingExerciseModal: React.FC<BreathingExerciseModalProps> = ({
  isOpen,
  onClose,
  patient,
  onActivityCompleted,
}) => {
  const [technique, setTechnique] = useState<'box' | '478' | 'resonance'>('box');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play gentle harmonic chime using Web Audio API
  const playTone = (freq: number, type: 'sine' | 'triangle' = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {
      // Audio not supported or autoplay blocked
    }
  };

  // Breathing loop timer
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setPhaseSeconds((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (technique === 'box') {
              if (phase === 'Inhale') {
                setPhase('Hold');
                playTone(528);
                return 4;
              }
              if (phase === 'Hold') {
                setPhase('Exhale');
                playTone(432);
                return 4;
              }
              if (phase === 'Exhale') {
                setPhase('Rest');
                playTone(396);
                return 4;
              }
              if (phase === 'Rest') {
                setPhase('Inhale');
                playTone(639);
                setCompletedCycles((c) => c + 1);
                return 4;
              }
            } else if (technique === '478') {
              if (phase === 'Inhale') {
                setPhase('Hold');
                playTone(528);
                return 7;
              }
              if (phase === 'Hold') {
                setPhase('Exhale');
                playTone(432);
                return 8;
              }
              if (phase === 'Exhale') {
                setPhase('Inhale');
                playTone(639);
                setCompletedCycles((c) => c + 1);
                return 4;
              }
            } else {
              // resonance 5.5s
              if (phase === 'Inhale') {
                setPhase('Exhale');
                playTone(432);
                return 5;
              }
              if (phase === 'Exhale') {
                setPhase('Inhale');
                playTone(528);
                setCompletedCycles((c) => c + 1);
                return 5;
              }
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Completed!
      setIsActive(false);
      setIsCompleted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      api.logActivityCompletion(
        patient.id,
        'act-breathing-box',
        '2-Minute Autonomic Breathing Reset',
        'Calm',
        2,
        'Finished 2-minute resonance breathing exercise. Autonomic heart rate and blood pressure feel stabilized.'
      );
      if (onActivityCompleted) onActivityCompleted();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, technique]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsCompleted(false);
    playTone(528);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(120);
    setPhase('Inhale');
    setPhaseSeconds(4);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5EAEA] relative overflow-hidden flex flex-col items-center text-center">
        {/* Top Controls */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-[#E5EAEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F7F1] text-[#168A6A] flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm text-[#16302A]">2-Minute Autonomic Reset</h3>
              <p className="text-[10px] text-[#64748B]">Paced Vagal Resonance Exercise</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-[#64748B] hover:text-[#168A6A] hover:bg-[#F8FAFA] rounded-xl transition-colors"
              title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#168A6A]" /> : <VolumeX className="w-4 h-4 text-[#64748B]" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#64748B] hover:text-[#DC5A5A] hover:bg-[#FEE2E2] rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Technique Mode Selector */}
        {!isActive && !isCompleted && (
          <div className="flex items-center gap-1.5 my-4 bg-[#F8FAFA] p-1.5 rounded-2xl border border-[#E5EAEA]">
            <button
              onClick={() => {
                setTechnique('box');
                setPhaseSeconds(4);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                technique === 'box' ? 'bg-[#168A6A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#16302A]'
              }`}
            >
              Box (4-4-4-4)
            </button>
            <button
              onClick={() => {
                setTechnique('478');
                setPhaseSeconds(4);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                technique === '478' ? 'bg-[#168A6A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#16302A]'
              }`}
            >
              4-7-8 Deep Calm
            </button>
            <button
              onClick={() => {
                setTechnique('resonance');
                setPhaseSeconds(5);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                technique === 'resonance' ? 'bg-[#168A6A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#16302A]'
              }`}
            >
              Coherent (5.5s)
            </button>
          </div>
        )}

        {/* Main Breathing Visualizer Canvas */}
        {!isCompleted ? (
          <div className="my-8 relative flex flex-col items-center justify-center">
            {/* Outer pulsating rings */}
            <div
              className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-1000 ${
                phase === 'Inhale'
                  ? 'scale-110 bg-[#E8F7F1]/80 ring-8 ring-[#168A6A]/20'
                  : phase === 'Hold'
                  ? 'scale-110 bg-[#EAF4FB]/80 ring-8 ring-[#3B82C4]/20'
                  : phase === 'Exhale'
                  ? 'scale-90 bg-[#F8FAFA] ring-4 ring-[#E5EAEA]'
                  : 'scale-90 bg-[#F8FAFA]'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#168A6A]">
                  {isActive ? phase : 'Ready'}
                </span>
                <span className="text-4xl font-black text-[#16302A]">{isActive ? phaseSeconds : '2:00'}</span>
                <span className="text-[11px] font-semibold text-[#64748B]">
                  {isActive ? `${formatTime(timeLeft)} remaining` : 'Click Start to begin'}
                </span>
              </div>
            </div>

            {isActive && (
              <div className="mt-4 text-xs font-semibold text-[#64748B]">
                Completed Cycles: <strong className="text-[#168A6A]">{completedCycles}</strong>
              </div>
            )}
          </div>
        ) : (
          /* Completion State */
          <div className="my-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#E8F7F1] text-[#168A6A] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[#16302A]">Autonomic Reset Complete!</h3>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto">
              Your 2-minute breathing session has been saved to your activity history and Whole Health profile.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full pt-4 border-t border-[#E5EAEA] flex items-center justify-center gap-3">
          {!isActive && !isCompleted && (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white text-xs font-bold shadow-md shadow-[#168A6A]/20 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 2-Min Exercise</span>
            </button>
          )}

          {isActive && (
            <>
              <button
                onClick={() => setIsActive(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F8FAFA] hover:bg-[#E5EAEA] text-[#16302A] text-xs font-bold border border-[#E5EAEA] transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
              <button
                onClick={handleReset}
                className="p-2.5 text-[#64748B] hover:text-[#DC5A5A] rounded-xl hover:bg-[#FEE2E2] transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {isCompleted && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#168A6A] hover:bg-[#127257] text-white text-xs font-bold shadow-xs transition-all"
            >
              Done & Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
