// src/hooks/useVisualMode.js

import { useState } from 'react';

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setHistory((prevHistory) => {
      if (replace) {
        // Replace the last mode
        return [...prevHistory.slice(0, -1), newMode];
      }
      // Add a new mode
      return [...prevHistory, newMode];
    });
  };

  const back = () => {
    if (history.length <= 1) return;
    // If there's more than one item in the history, pop the last item
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
  };

  const mode = history[history.length - 1]; // Get the current mode from the history array
  
  return { mode, transition, back };
}