import { formatTime } from "../utils/timerUtils";
import "./component.styles.css";

interface TimerCardProps {
  index: number;
  timerValue: number;
  tickInterval: number;
  initialSeconds: number;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function TimerCard({
  index,
  timerValue,
  tickInterval,
  initialSeconds,
  isRunning,
  onStart,
  onStop,
}: TimerCardProps) {
  return (
    <div className="timer-card">
      <div>Timer {index}</div>
      <div className="timer-display">{formatTime(timerValue)}</div>
      <div className="timer-info">
        <div>Interval: {tickInterval}ms</div>
        <div>Initial: {formatTime(initialSeconds)}</div>
      </div>
      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={onStart} className="start-button">
            Start Me
          </button>
        ) : (
          <button onClick={onStop} className="stop-button">
            Stop Me
          </button>
        )}
      </div>
    </div>
  );
}
