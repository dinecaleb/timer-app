import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Timer, generateRandomTimer } from '../utils/timerUtils';

export const useTimers = () => {
    // State
    const [timers, setTimers] = useState<number>(0);
    const [timerList, setTimerList] = useState<Timer[]>([]);
    const intervalRefs = useRef<Map<number, number>>(new Map());

    // Check if any timer is running
    const isRunning = useMemo(() => {
        return timerList.some(timer => timer.isRunning);
    }, [timerList]);

    const clearAllIntervals = useCallback(() => {
        intervalRefs.current.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        intervalRefs.current.clear();
    }, []);

    // Stop all timers
    const stopAll = useCallback(() => {
        clearAllIntervals()
        setTimerList(prevList =>
            prevList.map(timer => ({ ...timer, isRunning: false }))
        );
    }, [clearAllIntervals]);

    // Create new timers after select element is changed
    const selectTimers = useCallback((value: number) => {

        // Stop all running timers first
        if (isRunning) {
            stopAll();
        }

        //update number of timers
        setTimers(value);

        if (value > 0) {
            //generate new timers with default values before starting them
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

        //update timer Ui to start immediately instead of waiting for the next tick
        setTimerList(prevList =>
            prevList.map(timer => ({ ...timer, isRunning: true }))
        );
    }, [timerList]);

    // Reset all timers
    const resetAll = useCallback(() => {
        //clear all intervals
        clearAllIntervals()

        //clear timer Ui to original values
        setTimerList(prevList =>
            prevList.map(timer => ({
                ...timer,
                currentSeconds: timer.initialSeconds,
                isRunning: false
            }))
        );
    }, [clearAllIntervals]);

    // Start individual timer
    const startTimer = useCallback((timerId: number) => {
        //find the timer by id and check if it is running
        const timer = timerList.find(t => t.id === timerId);
        if (timer && !timer.isRunning) {
            ///start the interval timer and increment the current seconds
            const intervalId = setInterval(() => {
                setTimerList(prevList =>
                    prevList.map(t =>
                        t.id === timerId
                            ? { ...t, currentSeconds: t.currentSeconds + 1 }
                            : t
                    )
                );
            }, timer.tickInterval);

            //store reference to the interval timer
            intervalRefs.current.set(timerId, intervalId as unknown as number);

            //update timer Ui to start immediately instead of waiting for the next tick
            setTimerList(prevList =>
                prevList.map(t =>
                    t.id === timerId ? { ...t, isRunning: true } : t
                )
            );
        }
    }, [timerList]);

    // Stop individual timer
    const stopTimer = useCallback((timerId: number) => {
        //prevents the interval timer from running by clearing and removing the ref.
        const intervalId = intervalRefs.current.get(timerId);
        if (intervalId) {
            clearInterval(intervalId);
            intervalRefs.current.delete(timerId);
        }

        //ui update stop running but retain current values  
        setTimerList(prevList =>
            prevList.map(t =>
                t.id === timerId ? { ...t, isRunning: false } : t
            )
        );
    }, []);

    // Cleanup on unmount
    useEffect(() => {

        return () => {
            clearAllIntervals()
        };
    }, [clearAllIntervals]);

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
