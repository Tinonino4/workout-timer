import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { deleteWorkout, getWorkouts, saveWorkout } from '@/storage/workoutStorage';
import { Workout } from '@/types/types';

const PRESET_WORKOUTS: Omit<Workout, 'id'>[] = [
  { name: 'Boxing', sets: 8, workDuration: 180, restDuration: 60 },
  { name: 'HIIT', sets: 10, workDuration: 30, restDuration: 15 },
  { name: 'Tabata', sets: 8, workDuration: 20, restDuration: 10 },
  { name: 'Stretching', sets: 5, workDuration: 60, restDuration: 30 },
];

export default function HomeScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const loadWorkouts = async () => {
    const data = await getWorkouts();
    setWorkouts(data);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Workout',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteWorkout(id);
            loadWorkouts();
          },
        },
      ]
    );
  };

  const handleAddPreset = async (preset: Omit<Workout, 'id'>) => {
    await saveWorkout(preset);
    loadWorkouts();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <Pressable
      style={[styles.workoutCard, isDark && styles.workoutCardDark]}
      onPress={() => router.push(`/workout/${item.id}/timer`)}
    >
      <View style={styles.workoutInfo}>
        <Text style={[styles.workoutName, isDark && styles.textLight]}>{item.name}</Text>
        <Text style={[styles.workoutDetails, isDark && styles.textMuted]}>
          {item.sets} sets • {formatDuration(item.workDuration)} work • {formatDuration(item.restDuration)} rest
        </Text>
      </View>
      <Pressable onPress={() => handleDelete(item.id, item.name)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color="#f44336" />
      </Pressable>
    </Pressable>
  );

  const renderPresetItem = (preset: Omit<Workout, 'id'>, index: number) => (
    <Pressable
      key={index}
      style={[styles.presetCard, isDark && styles.presetCardDark]}
      onPress={() => handleAddPreset(preset)}
    >
      <Ionicons name="add-circle" size={24} color="#4CAF50" />
      <View style={styles.presetInfo}>
        <Text style={[styles.presetName, isDark && styles.textLight]}>{preset.name}</Text>
        <Text style={[styles.presetDetails, isDark && styles.textMuted]}>
          {preset.sets} × {formatDuration(preset.workDuration)}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
        />
        <Text style={[styles.title, isDark && styles.textLight]}>Workout Timer</Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.welcomeSection}>
            <Ionicons name="fitness" size={60} color="#4CAF50" />
            <Text style={[styles.welcomeTitle, isDark && styles.textLight]}>
              Welcome!
            </Text>
            <Text style={[styles.welcomeSubtitle, isDark && styles.textMuted]}>
              Get started with a preset workout or create your own
            </Text>
          </View>

          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Quick Start</Text>
          <View style={styles.presetsGrid}>
            {PRESET_WORKOUTS.map((preset, index) => renderPresetItem(preset, index))}
          </View>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.sectionTitle, isDark && styles.textLight, styles.listHeader]}>
              My Workouts
            </Text>
          }
        />
      )}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  textLight: {
    color: '#fff',
  },
  textMuted: {
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#000',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  presetCardDark: {
    backgroundColor: '#1e1e1e',
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  presetDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  listHeader: {
    marginBottom: 12,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutCardDark: {
    backgroundColor: '#1e1e1e',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 10,
  },
});
