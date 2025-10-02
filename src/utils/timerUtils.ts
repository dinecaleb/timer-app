// Constants
export const MIN_INTERVAL = 200;
export const MAX_INTERVAL = 2800;
export const MAX_INITIAL_SECONDS = 60;

// Types
export interface Timer {
    id: number;
    tickInterval: number;
    initialSeconds: number;
    currentSeconds: number;
    isRunning: boolean;
}

// Utility function to generate random timer values
export const generateRandomTimer = (id: number): Timer => {
    const tickInterval = Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL;
    const initialSeconds = Math.floor(Math.random() * (MAX_INITIAL_SECONDS + 1));
    return {
        id,
        tickInterval,
        initialSeconds,
        currentSeconds: initialSeconds,
        isRunning: false,
    };
};

// Utility function to format time as MM:SS
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
};

// Validation functions
export const validateTimerCount = (count: number): boolean => {
    return Number.isInteger(count) && count >= 0 && count <= 4;
};

export const validateTimerId = (id: number, timers: Timer[]): boolean => {
    return timers.some(timer => timer.id === id);
};
