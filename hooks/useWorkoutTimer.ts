import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getRandomQuote } from '../constants/quotes';
import { TimerStatus, Workout } from '../types/types';
import { playBeepSound } from '../utils/audio';

const GET_READY_DURATION = 3;

interface UseWorkoutTimerReturn {
    timeLeft: number;
    currentSet: number;
    totalSets: number;
    status: TimerStatus;
    isPaused: boolean;
    currentQuote: string;
    progress: number;
    phaseDuration: number;
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
}

export const useWorkoutTimer = (workout: Workout | null): UseWorkoutTimerReturn => {
    const [status, setStatus] = useState<TimerStatus>('IDLE');
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [currentQuote, setCurrentQuote] = useState('');
    const [phaseDuration, setPhaseDuration] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);



    const playBeep = useCallback(async (isBig: boolean = false) => {
        try {
            await playBeepSound(isBig);
            await Haptics.notificationAsync(
                isBig 
                    ? Haptics.NotificationFeedbackType.Success 
                    : Haptics.NotificationFeedbackType.Warning
            );
        } catch (error) {
            console.log('Feedback failed:', error);
        }
    }, []);

    const triggerHaptic = useCallback(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, []);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const transitionToNextPhase = useCallback(() => {
        if (!workout) return;

        playBeep(true);

        if (status === 'GET_READY') {
            setStatus('WORK');
            setTimeLeft(workout.workDuration);
            setPhaseDuration(workout.workDuration);
            setCurrentQuote(getRandomQuote());
            triggerHaptic();
        } else if (status === 'WORK') {
            if (currentSet < workout.sets) {
                setStatus('REST');
                setTimeLeft(workout.restDuration);
                setPhaseDuration(workout.restDuration);
                triggerHaptic();
            } else {
                setStatus('FINISHED');
                clearTimer();
                triggerHaptic();
            }
        } else if (status === 'REST') {
            setCurrentSet(prev => prev + 1);
            setStatus('WORK');
            setTimeLeft(workout.workDuration);
            setPhaseDuration(workout.workDuration);
            setCurrentQuote(getRandomQuote());
            triggerHaptic();
        }
    }, [workout, status, currentSet, clearTimer, triggerHaptic, playBeep]);

    useEffect(() => {
        if (status === 'IDLE' || status === 'FINISHED' || isPaused) {
            clearTimer();
            return;
        }

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    transitionToNextPhase();
                    return 0;
                }

                // Beep at 3, 2, 1 seconds remaining
                if (prev <= 4 && prev > 1) {
                    playBeep();
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearTimer();
    }, [status, isPaused, transitionToNextPhase, playBeep, clearTimer]);



    const start = useCallback(() => {
        if (!workout) return;
        setStatus('GET_READY');
        setTimeLeft(GET_READY_DURATION);
        setPhaseDuration(GET_READY_DURATION);
        setCurrentSet(1);
        setIsPaused(false);
        setCurrentQuote(getRandomQuote());
        playBeep();
    }, [workout, playBeep]);

    const pause = useCallback(() => {
        setIsPaused(true);
    }, []);

    const resume = useCallback(() => {
        setIsPaused(false);
    }, []);

    const reset = useCallback(() => {
        clearTimer();
        setStatus('IDLE');
        setTimeLeft(0);
        setCurrentSet(1);
        setIsPaused(false);
        setCurrentQuote('');
        setPhaseDuration(0);
    }, [clearTimer]);

    const progress = phaseDuration > 0 ? timeLeft / phaseDuration : 0;

    return {
        timeLeft,
        currentSet,
        totalSets: workout?.sets ?? 0,
        status,
        isPaused,
        currentQuote,
        progress,
        phaseDuration,
        start,
        pause,
        resume,
        reset,
    };
};
