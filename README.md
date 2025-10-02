# React Timer App

**Caleb Tony-Enwin**

Multiple timer management with individual and global controls. Built as a take-home assignment.

## Features

- Select 1-4 timers from dropdown
- Random tick intervals (200ms-2800ms) and initial values (0-60 seconds)
- Individual and global timer controls
- Start, stop, and reset functionality

## Setup

```bash
npm install
npm start
npm test
npm run build
```

App runs at [http://localhost:3000](http://localhost:3000)

## Requirements

This project implements 14 requirements:

### Core Functionality

1. Select element with at least 2 options, values > 0
2. Start All and Reset All buttons
3. Display timers matching selected value
4. Random initialization: interval (200-2800ms) and initial seconds (0-60)

### Timer Behavior

5. Start All: all timers tick, buttons change to Stop All
6. Stop All: all timers pause, buttons return to Start All/Reset All
7. Resume: Start All again continues from current values
8. Reset All: all timers reset to initial seconds

### State Management

9. Select change: stops all timers, creates new ones, resets UI
10. Individual controls: Start Me/Stop Me buttons on each timer
11. Individual start: only that timer starts, global buttons change
12. Global stop: stops all timers including individually started ones
13. Individual stop: only that timer stops, others unaffected
14. Last timer: when last running timer stops, global buttons reset

## Architecture

```
src/
├── App.tsx                    # Main component
├── components/
│   ├── timerCard.tsx         # Timer display
│   └── component.styles.css  # Styles
├── hooks/
│   └── useTimers.ts          # Timer logic
├── utils/
│   └── timerUtils.ts         # Utilities
└── App.test.tsx              # Tests
```

## Technical Implementation

### State Management

- Custom hook `useTimers` manages all timer state
- `isRunning` derived from individual timer states
- `useRef` stores interval IDs to prevent re-renders
- Proper cleanup of intervals on unmount

### Performance

- `useCallback` for event handlers
- `useMemo` for derived state
- Efficient updates with minimal re-renders

### Testing

- 14 test cases covering all requirements
- React Testing Library with Jest
- Fake timers for timer testing
- User interaction testing

## Key Technical Decisions

1. **Custom Hook**: Centralized timer logic in `useTimers`
2. **useRef for Intervals**: Prevents re-renders while managing intervals
3. **Derived State**: `isRunning` calculated from individual states
4. **Array-based Options**: Simple timer selection `[1, 2, 3, 4]`
5. **Comprehensive Testing**: All requirements covered

## Development Notes

- Implementation time: ~2 hours
- All 14 requirements implemented and tested
- Modern React patterns and best practices
- Clean, maintainable code structure
