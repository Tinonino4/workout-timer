import { Audio } from 'expo-av';

let beepSound: Audio.Sound | null = null;

// Create a short beep using expo-av
export const playBeepSound = async (): Promise<void> => {
    try {
        // Configure audio mode for playback
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
        });

        // Unload previous sound if exists
        if (beepSound) {
            await beepSound.unloadAsync();
            beepSound = null;
        }

        // Create the sound from bundled asset
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/beep.wav'),
            { shouldPlay: true, volume: 1.0 }
        );
        beepSound = sound;

        // Clean up after playing
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
                beepSound = null;
            }
        });
    } catch (error) {
        console.log('Failed to play beep sound:', error);
    }
};

export const unloadBeepSound = async (): Promise<void> => {
    if (beepSound) {
        await beepSound.unloadAsync();
        beepSound = null;
    }
};
