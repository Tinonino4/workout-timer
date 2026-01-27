import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimerStatus } from '../types/types';
import { CircularProgress } from './CircularProgress';

interface TimerDisplayProps {
    timeLeft: number;
    progress: number;
    status: TimerStatus;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getColorForStatus = (status: TimerStatus): string => {
    switch (status) {
        case 'GET_READY':
            return '#FFA500'; // Orange
        case 'WORK':
            return '#4CAF50'; // Green
        case 'REST':
            return '#2196F3'; // Blue
        case 'FINISHED':
            return '#9C27B0'; // Purple
        default:
            return '#757575'; // Grey
    }
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
    timeLeft,
    progress,
    status,
}) => {
    const color = getColorForStatus(status);

    return (
        <View style={styles.container}>
            <CircularProgress
                size={280}
                strokeWidth={12}
                progress={progress}
                color={color}
                backgroundColor="#2a2a2a"
            >
                <Text style={[styles.timeText, { color }]}>{formatTime(timeLeft)}</Text>
            </CircularProgress>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    timeText: {
        fontSize: 64,
        fontWeight: '300',
        fontVariant: ['tabular-nums'],
    },
});
