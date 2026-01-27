export type TimerStatus = 'IDLE' | 'GET_READY' | 'WORK' | 'REST' | 'FINISHED';

export interface Workout {
    id: string;
    name: string;
    workDuration: number; // in seconds
    restDuration: number; // in seconds
    sets: number;
    motivationalQuote?: string;
}
