import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Workout } from '../types/types';

const WORKOUT_STORAGE_KEY = '@workout_timer_workouts';

export const saveWorkout = async (workout: Omit<Workout, 'id'> | Workout): Promise<Workout> => {
    try {
        const storedWorkouts = await getWorkouts();

        let newWorkout: Workout;

        if ('id' in workout) {
            // Update existing
            newWorkout = workout as Workout;
            const index = storedWorkouts.findIndex(w => w.id === workout.id);
            if (index !== -1) {
                storedWorkouts[index] = newWorkout;
            } else {
                storedWorkouts.push(newWorkout);
            }
        } else {
            // Create new
            newWorkout = {
                ...workout,
                id: Crypto.randomUUID(),
            };
            storedWorkouts.push(newWorkout);
        }

        await AsyncStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(storedWorkouts));
        return newWorkout;
    } catch (error) {
        console.error('Error saving workout:', error);
        throw error;
    }
};

export const getWorkouts = async (): Promise<Workout[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(WORKOUT_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error getting workouts:', error);
        return [];
    }
};

export const deleteWorkout = async (id: string): Promise<void> => {
    try {
        const storedWorkouts = await getWorkouts();
        const filteredWorkouts = storedWorkouts.filter(w => w.id !== id);
        await AsyncStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(filteredWorkouts));
    } catch (error) {
        console.error('Error deleting workout:', error);
        throw error;
    }
};
