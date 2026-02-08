import { createAudioPlayer } from 'expo-audio';

const beepSource = require('../assets/sounds/beep.wav');

/**
 * Plays a beep sound using the new expo-audio API (SDK 54+).
 * @param isBig If true, plays a "bigger" (lower pitch/slower) beep.
 */
export const playBeepSound = async (isBig: boolean = false): Promise<void> => {
    try {
        const player = createAudioPlayer(beepSource);
        
        // Set playback properties
        player.volume = 1.0;
        player.setPlaybackRate(isBig ? 0.8 : 1.0);
        
        // Listen for completion to clean up
        const subscription = player.addListener('playbackStatusUpdate', (status) => {
            if (status.didJustFinish) {
                subscription.remove();
                player.remove();
            }
        });

        // Play the sound
        player.play();

    } catch (error) {
        console.log('Failed to play beep sound:', error);
    }
};

/**
 * No-op for compatibility as players are now managed per-play in this utility.
 */
export const unloadBeepSound = async (): Promise<void> => {
    // In this new implementation, players are removed automatically after playback.
};
