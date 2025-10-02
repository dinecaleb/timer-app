import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

// Mock timers to make tests deterministic
jest.useFakeTimers();

describe("Timer App - All Test Cases", () => {
  beforeEach(() => {
    // Reset any timers before each test
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean up after each test
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe("Test Case 1: Select Element with Options", () => {
    test("should render select element with at least two options with values > 0", () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      expect(selectElement).toBeInTheDocument();

      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThanOrEqual(2);

      // Check that all option values are > 0 (excluding the empty option)
      const nonEmptyOptions = options.filter(
        (option) => option.getAttribute("value") !== "0"
      );
      nonEmptyOptions.forEach((option) => {
        const value = parseInt(option.getAttribute("value") || "0");
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe("Test Case 2: Start All and Reset All Buttons", () => {
    test("should render Start All and Reset All buttons after selecting timers", () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      const startAllButton = screen.getByText("Start All");
      const resetAllButton = screen.getByText("Reset All");

      expect(startAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeInTheDocument();
    });
  });

  describe("Test Case 3: Display Timers Matching Select Value", () => {
    test("should display correct number of timers based on select value", () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");

      // Select 2 timers
      fireEvent.change(selectElement, { target: { value: "2" } });

      const timerCards = screen.getAllByText(/Timer \d+/);
      expect(timerCards).toHaveLength(2);

      // Select 3 timers
      fireEvent.change(selectElement, { target: { value: "3" } });

      const timerCards3 = screen.getAllByText(/Timer \d+/);
      expect(timerCards3).toHaveLength(3);
    });
  });

  describe("Test Case 4: Random Initialization", () => {
    test("should initialize timers with random intervals and initial seconds", () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      // Check that intervals are displayed (should be between 200-2800ms)
      const intervalElements = screen.getAllByText(/Interval: \d+ms/);
      expect(intervalElements).toHaveLength(2);

      intervalElements.forEach((element) => {
        const intervalText = element.textContent || "";
        const interval = parseInt(intervalText.match(/\d+/)?.[0] || "0");
        expect(interval).toBeGreaterThanOrEqual(200);
        expect(interval).toBeLessThanOrEqual(2800);
      });

      // Check that initial seconds are displayed (should be 0-60)
      const initialElements = screen.getAllByText(/Initial: \d{2}:\d{2}/);
      expect(initialElements).toHaveLength(2);
    });
  });

  describe("Test Case 5: Start All Behavior", () => {
    test("should start all timers and show Stop All button", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      const startAllButton = screen.getByText("Start All");
      fireEvent.click(startAllButton);

      // Start All and Reset All should disappear
      expect(screen.queryByText("Start All")).not.toBeInTheDocument();
      expect(screen.queryByText("Reset All")).not.toBeInTheDocument();

      // Stop All should appear
      expect(screen.getByText("Stop All")).toBeInTheDocument();

      // Timers should be running (check for Start Me buttons to be replaced with Stop Me)
      const stopMeButtons = screen.getAllByText("Stop Me");
      expect(stopMeButtons).toHaveLength(2);
    });
  });

  describe("Test Case 6: Stop All Behavior", () => {
    test("should stop all timers and show Start All/Reset All buttons", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      // Start all timers
      const startAllButton = screen.getByText("Start All");
      fireEvent.click(startAllButton);

      // Stop all timers
      const stopAllButton = screen.getByText("Stop All");
      fireEvent.click(stopAllButton);

      // Stop All should disappear
      expect(screen.queryByText("Stop All")).not.toBeInTheDocument();

      // Start All and Reset All should reappear
      expect(screen.getByText("Start All")).toBeInTheDocument();
      expect(screen.getByText("Reset All")).toBeInTheDocument();

      // Individual timers should show Start Me buttons
      const startMeButtons = screen.getAllByText("Start Me");
      expect(startMeButtons).toHaveLength(2);
    });
  });

  describe("Test Case 7: Start All Again (Resume)", () => {
    test("should resume timers from current values, not initial seconds", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "1" } });

      // Start timer
      const startAllButton = screen.getByText("Start All");
      fireEvent.click(startAllButton);

      // Let timer run for a bit
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Stop timer
      const stopAllButton = screen.getByText("Stop All");
      fireEvent.click(stopAllButton);

      // Get current value from timer display (not initial value)
      const timerDisplays = screen.getAllByText(/\d{2}:\d{2}/);
      const timerDisplay = timerDisplays[0]; // Get the first one (timer display, not initial)
      const currentValue = timerDisplay.textContent;

      // Start again
      const startAllButton2 = screen.getByText("Start All");
      fireEvent.click(startAllButton2);

      // Timer should continue from current value, not reset
      expect(timerDisplay.textContent).toBe(currentValue);
    });
  });

  describe("Test Case 8: Reset All Behavior", () => {
    test("should reset all timers to initial seconds", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "1" } });

      // Get initial value
      const initialElement = screen.getByText(/Initial: \d{2}:\d{2}/);
      const initialValue = initialElement.textContent?.replace("Initial: ", "");

      // Start timer and let it run
      const startAllButton = screen.getByText("Start All");
      fireEvent.click(startAllButton);
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Reset all
      const stopAllButton = screen.getByText("Stop All");
      fireEvent.click(stopAllButton);

      const resetAllButton = screen.getByText("Reset All");
      fireEvent.click(resetAllButton);

      // Timer should be back to initial value
      const timerDisplays = screen.getAllByText(/\d{2}:\d{2}/);
      const timerDisplay = timerDisplays[0]; // Get the first one (timer display, not initial)
      expect(timerDisplay.textContent).toBe(initialValue);
    });
  });

  describe("Test Case 9: Select Value Change", () => {
    test("should stop all timers and create new ones when select value changes", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");

      // Select 2 timers and start them
      fireEvent.change(selectElement, { target: { value: "2" } });
      const startAllButton = screen.getByText("Start All");
      fireEvent.click(startAllButton);

      // Change to 3 timers
      fireEvent.change(selectElement, { target: { value: "3" } });

      // Should show Start All and Reset All buttons (timers stopped)
      expect(screen.getByText("Start All")).toBeInTheDocument();
      expect(screen.getByText("Reset All")).toBeInTheDocument();
      expect(screen.queryByText("Stop All")).not.toBeInTheDocument();

      // Should have 3 new timers
      const timerCards = screen.getAllByText(/Timer \d+/);
      expect(timerCards).toHaveLength(3);
    });
  });

  describe("Test Case 10: Individual Control Buttons", () => {
    test("should have Start Me and Stop Me buttons on each timer", () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      // Should have Start Me buttons initially
      const startMeButtons = screen.getAllByText("Start Me");
      expect(startMeButtons).toHaveLength(2);
    });
  });

  describe("Test Case 11: Individual Start Me", () => {
    test("should start only that timer and show Stop All button", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      // Start individual timer
      const startMeButtons = screen.getAllByText("Start Me");
      fireEvent.click(startMeButtons[0]);

      // Global buttons should change to Stop All
      expect(screen.queryByText("Start All")).not.toBeInTheDocument();
      expect(screen.queryByText("Reset All")).not.toBeInTheDocument();
      expect(screen.getByText("Stop All")).toBeInTheDocument();

      // First timer should show Stop Me, second should show Start Me
      const stopMeButtons = screen.getAllByText("Stop Me");
      const startMeButtonsAfter = screen.getAllByText("Start Me");
      expect(stopMeButtons).toHaveLength(1);
      expect(startMeButtonsAfter).toHaveLength(1);
    });
  });

  describe("Test Case 12: Stop All Affects Individual Timers", () => {
    test("should stop all timers including individually started ones", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      // Start individual timer
      const startMeButtons = screen.getAllByText("Start Me");
      fireEvent.click(startMeButtons[0]);

      // Stop all
      const stopAllButton = screen.getByText("Stop All");
      fireEvent.click(stopAllButton);

      // All timers should show Start Me buttons
      const startMeButtonsAfter = screen.getAllByText("Start Me");
      expect(startMeButtonsAfter).toHaveLength(2);

      // Global buttons should be Start All and Reset All
      expect(screen.getByText("Start All")).toBeInTheDocument();
      expect(screen.getByText("Reset All")).toBeInTheDocument();
      expect(screen.queryByText("Stop All")).not.toBeInTheDocument();
    });
  });

  describe("Test Case 13: Individual Stop Me", () => {
    test("should stop only that timer, others remain unaffected", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      // Start both timers
      const startAllButton = screen.getByText("Start All");
      fireEvent.click(startAllButton);

      // Stop first timer individually
      const stopMeButtons = screen.getAllByText("Stop Me");
      fireEvent.click(stopMeButtons[0]);

      // First timer should show Start Me, second should show Stop Me
      const startMeButtons = screen.getAllByText("Start Me");
      const stopMeButtonsAfter = screen.getAllByText("Stop Me");
      expect(startMeButtons).toHaveLength(1);
      expect(stopMeButtonsAfter).toHaveLength(1);

      // Global Stop All should still be visible (one timer still running)
      expect(screen.getByText("Stop All")).toBeInTheDocument();
    });
  });

  describe("Test Case 14: Last Running Timer Stopped", () => {
    test("should show Start All/Reset All when last running timer is stopped", async () => {
      render(<App />);

      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "2" } });

      // Start both timers
      const startAllButton = screen.getByText("Start All");
      fireEvent.click(startAllButton);

      // Stop first timer
      const stopMeButtons = screen.getAllByText("Stop Me");
      fireEvent.click(stopMeButtons[0]);

      // Stop All should still be visible (one timer still running)
      expect(screen.getByText("Stop All")).toBeInTheDocument();

      // Stop second timer (last running timer)
      const stopMeButtonsAfter = screen.getAllByText("Stop Me");
      fireEvent.click(stopMeButtonsAfter[0]);

      // Stop All should disappear, Start All and Reset All should appear
      expect(screen.queryByText("Stop All")).not.toBeInTheDocument();
      expect(screen.getByText("Start All")).toBeInTheDocument();
      expect(screen.getByText("Reset All")).toBeInTheDocument();
    });
  });
});
