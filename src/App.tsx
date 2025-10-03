import "./App.css";
import "./components/component.styles.css";
import TimerCard from "./components/timerCard";
import { useTimers } from "./hooks/useTimers";

const TIMER_OPTIONS = [1, 2, 3, 4];

export default function App() {
  const {
    timers,
    timerList,
    isRunning,
    selectTimers,
    startAll,
    stopAll,
    resetAll,
    startTimer,
    stopTimer,
  } = useTimers();

  const handleSelectTimers = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    selectTimers(value);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">Timer App</h1>
        <p className="app-subtitle">Multiple timers with random intervals</p>
      </header>

      <main className="app-main">
        <div className="timer-selector">
          <label>Select the number of timers</label>
          <select onChange={handleSelectTimers} value={timers}>
            <option value={0}></option>
            {TIMER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="timer-list">
          {timerList.map((timer) => (
            <TimerCard
              key={timer.id}
              index={timer.id}
              timerValue={timer.currentSeconds}
              tickInterval={timer.tickInterval}
              initialSeconds={timer.initialSeconds}
              isRunning={timer.isRunning}
              onStart={() => startTimer(timer.id)}
              onStop={() => stopTimer(timer.id)}
            />
          ))}
        </div>

        {/* Global controls */}
        {timers > 0 && (
          <div className="global-controls">
            {!isRunning ? (
              <>
                <button onClick={startAll}>Start All</button>
                <button onClick={resetAll}>Reset All</button>
              </>
            ) : (
              <button onClick={stopAll}>Stop All</button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
