import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

type SoundType = 'click' | 'hover' | 'success' | 'warning' | 'critical' | 'notification' | 'delete';

interface SoundContextType {
    play: (type: SoundType) => void;
    volume: number;
    setVolume: (volume: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    // Use AudioContext for synthesized sounds to ensure no external asset dependency issues initially
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction or mount if allowed
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtxRef.current = new AudioContextClass();
        }

        return () => {
            audioCtxRef.current?.close();
        };
    }, []);

    const playSynthesizedSound = (type: SoundType) => {
        if (!audioCtxRef.current || isMuted) return;

        // Resume context if suspended (browser autoplay policy)
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        // Different sound profiles for different events
        switch (type) {
            case 'click':
                // Short, high-ish pitch click
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, now);
                oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                gainNode.gain.setValueAtTime(volume * 0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'hover':
                // Very subtle, quick pop
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(200, now);
                gainNode.gain.setValueAtTime(volume * 0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;

            case 'success':
                // Ascending major third
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, now); // A4
                oscillator.frequency.setValueAtTime(554.37, now + 0.1); // C#5
                gainNode.gain.setValueAtTime(volume * 0.2, now);
                gainNode.gain.linearRampToValueAtTime(volume * 0.2, now + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                oscillator.start(now);
                oscillator.stop(now + 0.4);
                break;

            case 'warning':
                // Dissonant interval
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(300, now);
                gainNode.gain.setValueAtTime(volume * 0.15, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

                // Add a second oscillator for dissonance
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'square';
                osc2.frequency.setValueAtTime(310, now); // Slight beat
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                gain2.gain.setValueAtTime(volume * 0.15, now);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

                oscillator.start(now);
                oscillator.stop(now + 0.3);
                osc2.start(now);
                osc2.stop(now + 0.3);
                break;

            case 'critical':
                // Alarm-like pattern
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.linearRampToValueAtTime(400, now + 0.2);
                gainNode.gain.setValueAtTime(volume * 0.4, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
                oscillator.start(now);
                oscillator.stop(now + 0.4);
                break;

            case 'delete':
                // Downward sweep
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(300, now);
                oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                gainNode.gain.setValueAtTime(volume * 0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            default:
                // Generic blip
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, now);
                gainNode.gain.setValueAtTime(volume * 0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
        }
    };

    const play = (type: SoundType) => {
        playSynthesizedSound(type);
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{ play, volume, setVolume, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
