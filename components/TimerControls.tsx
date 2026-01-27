import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TimerStatus } from '../types/types';

interface TimerControlsProps {
    status: TimerStatus;
    isPaused: boolean;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
    status,
    isPaused,
    onStart,
    onPause,
    onResume,
    onReset,
}) => {
    const isRunning = status !== 'IDLE' && status !== 'FINISHED';

    return (
        <View style={styles.container}>
            {status === 'IDLE' && (
                <Pressable style={[styles.button, styles.startButton]} onPress={onStart}>
                    <Ionicons name="play" size={32} color="#fff" />
                    <Text style={styles.buttonText}>START</Text>
                </Pressable>
            )}

            {isRunning && !isPaused && (
                <View style={styles.row}>
                    <Pressable style={[styles.button, styles.pauseButton]} onPress={onPause}>
                        <Ionicons name="pause" size={28} color="#fff" />
                    </Pressable>
                    <Pressable style={[styles.button, styles.resetButton]} onPress={onReset}>
                        <Ionicons name="stop" size={28} color="#fff" />
                    </Pressable>
                </View>
            )}

            {isRunning && isPaused && (
                <View style={styles.row}>
                    <Pressable style={[styles.button, styles.resumeButton]} onPress={onResume}>
                        <Ionicons name="play" size={28} color="#fff" />
                    </Pressable>
                    <Pressable style={[styles.button, styles.resetButton]} onPress={onReset}>
                        <Ionicons name="stop" size={28} color="#fff" />
                    </Pressable>
                </View>
            )}

            {status === 'FINISHED' && (
                <Pressable style={[styles.button, styles.startButton]} onPress={onReset}>
                    <Ionicons name="refresh" size={32} color="#fff" />
                    <Text style={styles.buttonText}>RESTART</Text>
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 50,
        gap: 8,
    },
    startButton: {
        backgroundColor: '#4CAF50',
        minWidth: 180,
    },
    pauseButton: {
        backgroundColor: '#FFA500',
        minWidth: 80,
    },
    resumeButton: {
        backgroundColor: '#4CAF50',
        minWidth: 80,
    },
    resetButton: {
        backgroundColor: '#f44336',
        minWidth: 80,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
