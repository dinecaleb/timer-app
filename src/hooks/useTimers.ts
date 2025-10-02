import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Timer, generateRandomTimer, validateTimerCount } from '../utils/timerUtils';

export const useTimers = () => {
    // State
    const [timers, setTimers] = useState<number>(0);
    const [timerList, setTimerList] = useState<Timer[]>([]);
    const intervalRefs = useRef<Map<number, number>>(new Map());

    // Check if any timer is running
    const isRunning = useMemo(() => {
        return timerList.some(timer => timer.isRunning);
    }, [timerList]);

    // Stop all timers
    const stopAll = useCallback(() => {
        intervalRefs.current.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        intervalRefs.current.clear();

        setTimerList(prevList =>
            prevList.map(timer => ({ ...timer, isRunning: false }))
        );
    }, []);

    // Create new timers
    const selectTimers = useCallback((value: number) => {
        if (!validateTimerCount(value)) {
            console.warn('Invalid timer count:', value);
            return;
        }

        // Stop all running timers first
        if (isRunning) {
            stopAll();
        }

        setTimers(value);

        if (value > 0) {
            const newTimers = [...Array(value)].map((_, i) => generateRandomTimer(i + 1));
            setTimerList(newTimers);
        } else {
            setTimerList([]);
        }
    }, [isRunning, stopAll]);

    // Start all timers
    const startAll = useCallback(() => {
        timerList.forEach((timer) => {
            if (!timer.isRunning) {
                const intervalId = setInterval(() => {
                    setTimerList(prevList =>
                        prevList.map(t =>
                            t.id === timer.id
                                ? { ...t, currentSeconds: t.currentSeconds + 1 }
                                : t
                        )
                    );
                }, timer.tickInterval);

                intervalRefs.current.set(timer.id, intervalId as unknown as number);
            }
        });

        setTimerList(prevList =>
            prevList.map(timer => ({ ...timer, isRunning: true }))
        );
    }, [timerList]);

    // Reset all timers
    const resetAll = useCallback(() => {
        stopAll();
        setTimerList(prevList =>
            prevList.map(timer => ({
                ...timer,
                currentSeconds: timer.initialSeconds,
                isRunning: false
            }))
        );
    }, [stopAll]);

    // Start individual timer
    const startTimer = useCallback((timerId: number) => {
        const timer = timerList.find(t => t.id === timerId);
        if (timer && !timer.isRunning) {
            const intervalId = setInterval(() => {
                setTimerList(prevList =>
                    prevList.map(t =>
                        t.id === timerId
                            ? { ...t, currentSeconds: t.currentSeconds + 1 }
                            : t
                    )
                );
            }, timer.tickInterval);

            intervalRefs.current.set(timerId, intervalId as unknown as number);

            setTimerList(prevList =>
                prevList.map(t =>
                    t.id === timerId ? { ...t, isRunning: true } : t
                )
            );
        }
    }, [timerList]);

    // Stop individual timer
    const stopTimer = useCallback((timerId: number) => {
        const intervalId = intervalRefs.current.get(timerId);
        if (intervalId) {
            clearInterval(intervalId);
            intervalRefs.current.delete(timerId);
        }

        setTimerList(prevList =>
            prevList.map(t =>
                t.id === timerId ? { ...t, isRunning: false } : t
            )
        );
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        const intervals = intervalRefs.current;
        return () => {
            intervals.forEach((intervalId) => {
                clearInterval(intervalId);
            });
            intervals.clear();
        };
    }, []);

    return {
        timers,
        timerList,
        isRunning,
        selectTimers,
        startAll,
        stopAll,
        resetAll,
        startTimer,
        stopTimer,
    };
};
