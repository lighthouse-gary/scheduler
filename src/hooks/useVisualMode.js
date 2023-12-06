// src/hooks/useVisualMode.js
import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);

    setHistory((prevHistory) => {
      if (replace) {
        // If replace is true, replace the last item in the history with the new mode
        return [...prevHistory.slice(0, -1), newMode];
      }
      // If replace is false, add the new mode to the history
      return [...prevHistory, newMode];

    });
  };

  const back = () => {
    if (history.length <= 1) return;
    // If there's more than one item in the history, pop the last item
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    // Set the mode to the previous item in the history array
    const previousMode = newHistory[newHistory.length - 1];
    setMode(previousMode);
  };

  return { mode, transition, back };
}