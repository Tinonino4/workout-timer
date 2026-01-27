import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveWorkout } from '@/storage/workoutStorage';

export default function CreateWorkoutScreen() {
    const [name, setName] = useState('');
    const [sets, setSets] = useState('');
    const [workMinutes, setWorkMinutes] = useState('');
    const [workSeconds, setWorkSeconds] = useState('');
    const [restMinutes, setRestMinutes] = useState('');
    const [restSeconds, setRestSeconds] = useState('');

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a workout name');
            return;
        }

        const setsNum = parseInt(sets) || 1;
        const workDuration = (parseInt(workMinutes) || 0) * 60 + (parseInt(workSeconds) || 0);
        const restDuration = (parseInt(restMinutes) || 0) * 60 + (parseInt(restSeconds) || 0);

        if (workDuration === 0) {
            Alert.alert('Error', 'Work duration must be greater than 0');
            return;
        }

        try {
            await saveWorkout({
                name: name.trim(),
                sets: setsNum,
                workDuration,
                restDuration,
            });

            // Clear form
            setName('');
            setSets('');
            setWorkMinutes('');
            setWorkSeconds('');
            setRestMinutes('');
            setRestSeconds('');

            Alert.alert('Success', 'Workout saved!', [
                { text: 'OK', onPress: () => router.push('/(tabs)') },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to save workout');
        }
    };

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, isDark && styles.textLight]}>New Workout</Text>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, isDark && styles.textMuted]}>Workout Name</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        placeholder="e.g., Boxing, HIIT, Tabata"
                        placeholderTextColor={isDark ? '#666' : '#999'}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, isDark && styles.textMuted]}>Number of Sets</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        placeholder="8"
                        placeholderTextColor={isDark ? '#666' : '#999'}
                        keyboardType="number-pad"
                        value={sets}
                        onChangeText={setSets}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, isDark && styles.textMuted]}>Work Duration</Text>
                    <View style={styles.durationRow}>
                        <TextInput
                            style={[styles.durationInput, isDark && styles.inputDark]}
                            placeholder="3"
                            placeholderTextColor={isDark ? '#666' : '#999'}
                            keyboardType="number-pad"
                            value={workMinutes}
                            onChangeText={setWorkMinutes}
                        />
                        <Text style={[styles.durationLabel, isDark && styles.textMuted]}>min</Text>
                        <TextInput
                            style={[styles.durationInput, isDark && styles.inputDark]}
                            placeholder="0"
                            placeholderTextColor={isDark ? '#666' : '#999'}
                            keyboardType="number-pad"
                            value={workSeconds}
                            onChangeText={setWorkSeconds}
                        />
                        <Text style={[styles.durationLabel, isDark && styles.textMuted]}>sec</Text>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, isDark && styles.textMuted]}>Rest Duration</Text>
                    <View style={styles.durationRow}>
                        <TextInput
                            style={[styles.durationInput, isDark && styles.inputDark]}
                            placeholder="1"
                            placeholderTextColor={isDark ? '#666' : '#999'}
                            keyboardType="number-pad"
                            value={restMinutes}
                            onChangeText={setRestMinutes}
                        />
                        <Text style={[styles.durationLabel, isDark && styles.textMuted]}>min</Text>
                        <TextInput
                            style={[styles.durationInput, isDark && styles.inputDark]}
                            placeholder="0"
                            placeholderTextColor={isDark ? '#666' : '#999'}
                            keyboardType="number-pad"
                            value={restSeconds}
                            onChangeText={setRestSeconds}
                        />
                        <Text style={[styles.durationLabel, isDark && styles.textMuted]}>sec</Text>
                    </View>
                </View>

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Ionicons name="save" size={24} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Workout</Text>
                </Pressable>
            </ScrollView>
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
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#000',
    },
    textLight: {
        color: '#fff',
    },
    textMuted: {
        color: '#888',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputDark: {
        backgroundColor: '#1e1e1e',
        color: '#fff',
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        color: '#000',
        width: 70,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    durationLabel: {
        fontSize: 16,
        marginHorizontal: 10,
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
