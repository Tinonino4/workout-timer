import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimerStatus } from '../types/types';

interface PhaseIndicatorProps {
    status: TimerStatus;
    currentSet: number;
    totalSets: number;
}

const getPhaseLabel = (status: TimerStatus): string => {
    switch (status) {
        case 'GET_READY':
            return 'GET READY';
        case 'WORK':
            return 'WORK';
        case 'REST':
            return 'REST';
        case 'FINISHED':
            return 'FINISHED!';
        default:
            return 'READY';
    }
};

const getPhaseColor = (status: TimerStatus): string => {
    switch (status) {
        case 'GET_READY':
            return '#FFA500';
        case 'WORK':
            return '#4CAF50';
        case 'REST':
            return '#2196F3';
        case 'FINISHED':
            return '#9C27B0';
        default:
            return '#757575';
    }
};

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
    status,
    currentSet,
    totalSets,
}) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.phaseText, { color: getPhaseColor(status) }]}>
                {getPhaseLabel(status)}
            </Text>
            {status !== 'IDLE' && status !== 'FINISHED' && (
                <Text style={styles.setText}>
                    Set {currentSet} of {totalSets}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    phaseText: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    setText: {
        fontSize: 18,
        color: '#888',
        marginTop: 8,
    },
});
