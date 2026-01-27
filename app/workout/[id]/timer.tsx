import { Ionicons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhaseIndicator } from '@/components/PhaseIndicator';
import { TimerControls } from '@/components/TimerControls';
import { TimerDisplay } from '@/components/TimerDisplay';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { getWorkouts } from '@/storage/workoutStorage';
import { Workout } from '@/types/types';

export default function TimerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const {
        timeLeft,
        currentSet,
        totalSets,
        status,
        isPaused,
        currentQuote,
        progress,
        start,
        pause,
        resume,
        reset,
    } = useWorkoutTimer(workout);

    useEffect(() => {
        loadWorkout();
        activateKeepAwakeAsync();
        return () => {
            deactivateKeepAwake();
        };
    }, [id]);

    const loadWorkout = async () => {
        const workouts = await getWorkouts();
        const found = workouts.find((w) => w.id === id);
        if (found) {
            setWorkout(found);
        }
    };

    if (!workout) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <Text style={[styles.loadingText, isDark && styles.textLight]}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={isDark ? '#fff' : '#000'} />
                </Pressable>
                <Text style={[styles.workoutName, isDark && styles.textLight]}>{workout.name}</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                <PhaseIndicator status={status} currentSet={currentSet} totalSets={totalSets} />

                <TimerDisplay timeLeft={timeLeft} progress={progress} status={status} />

                {currentQuote && status !== 'IDLE' && status !== 'FINISHED' && (
                    <View style={styles.quoteContainer}>
                        <Text style={[styles.quoteText, isDark && styles.textMuted]}>"{currentQuote}"</Text>
                    </View>
                )}

                <TimerControls
                    status={status}
                    isPaused={isPaused}
                    onStart={start}
                    onPause={pause}
                    onResume={resume}
                    onReset={reset}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    workoutName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    placeholder: {
        width: 44,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
        color: '#000',
    },
    textLight: {
        color: '#fff',
    },
    textMuted: {
        color: '#888',
    },
    quoteContainer: {
        paddingHorizontal: 40,
        marginTop: 20,
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#666',
        lineHeight: 24,
    },
});
