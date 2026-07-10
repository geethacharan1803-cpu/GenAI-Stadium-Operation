// ============================================================
// Global Application Context
// Manages all shared state: crowd data, API key, uploads, etc.
// ============================================================

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import {
  AppState,
  CrowdSnapshot,
  StadiumConfig,
  UploadedFile,
  AIInsight,
  MatchInfo,
  ParsedData,
  LanguageCode,
} from '../types';
import { getDefaultStadium, getDefaultMatch, getStadiumById, getMatchForStadium } from '../utils/stadiumData';
import { generateCrowdSnapshot, generateInsights } from './CrowdSimulator';
import { getLanguageForStadium } from '../i18n';

// --- Action Types ---

type AppAction =
  | { type: 'SET_API_KEY'; payload: string | null }
  | { type: 'SET_STADIUM'; payload: string }
  | { type: 'UPDATE_CROWD'; payload: CrowdSnapshot }
  | { type: 'ADD_CROWD_HISTORY'; payload: CrowdSnapshot }
  | { type: 'ADD_UPLOADED_FILE'; payload: UploadedFile }
  | { type: 'UPDATE_UPLOADED_FILE'; payload: { id: string; updates: Partial<UploadedFile> } }
  | { type: 'REMOVE_UPLOADED_FILE'; payload: string }
  | { type: 'SET_INSIGHTS'; payload: AIInsight[] }
  | { type: 'ADD_INSIGHT'; payload: AIInsight }
  | { type: 'SET_SIMULATION_RUNNING'; payload: boolean }
  | { type: 'SET_SIMULATION_SPEED'; payload: number }
  | { type: 'SET_MATCH'; payload: MatchInfo }
  | { type: 'SET_LANGUAGE'; payload: LanguageCode }
  | { type: 'SET_SELECTED_MATCH'; payload: string | null };

// --- Initial State ---

const initialStadium = getDefaultStadium();
const initialMatch = getDefaultMatch();
const initialCrowd = generateCrowdSnapshot(initialStadium);

const initialState: AppState = {
  apiKey: null,
  selectedStadium: initialStadium,
  crowdData: initialCrowd,
  crowdHistory: [initialCrowd],
  uploadedFiles: [],
  aiInsights: generateInsights(initialCrowd, initialStadium),
  isSimulationRunning: true,
  simulationSpeed: 1,
  matchInfo: initialMatch,
  language: getLanguageForStadium(initialStadium.country),
  selectedMatchId: null,
};

// --- Reducer ---

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };

    case 'SET_STADIUM': {
      const stadium = getStadiumById(action.payload);
      if (!stadium) return state;
      const match = getMatchForStadium(stadium.name) || state.matchInfo;
      const crowd = generateCrowdSnapshot(stadium);
      const autoLang = getLanguageForStadium(stadium.country);
      return {
        ...state,
        selectedStadium: stadium,
        matchInfo: match,
        crowdData: crowd,
        crowdHistory: [crowd],
        aiInsights: generateInsights(crowd, stadium),
        language: autoLang, // auto-detect regional language
      };
    }

    case 'UPDATE_CROWD':
      return { ...state, crowdData: action.payload };

    case 'ADD_CROWD_HISTORY':
      return {
        ...state,
        crowdHistory: [...state.crowdHistory.slice(-59), action.payload],
      };

    case 'ADD_UPLOADED_FILE':
      return { ...state, uploadedFiles: [...state.uploadedFiles, action.payload] };

    case 'UPDATE_UPLOADED_FILE':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.map(f =>
          f.id === action.payload.id ? { ...f, ...action.payload.updates } : f
        ),
      };

    case 'REMOVE_UPLOADED_FILE':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(f => f.id !== action.payload),
      };

    case 'SET_INSIGHTS':
      return { ...state, aiInsights: action.payload };

    case 'ADD_INSIGHT':
      return { ...state, aiInsights: [action.payload, ...state.aiInsights].slice(0, 20) };

    case 'SET_SIMULATION_RUNNING':
      return { ...state, isSimulationRunning: action.payload };

    case 'SET_SIMULATION_SPEED':
      return { ...state, simulationSpeed: action.payload };

    case 'SET_MATCH':
      return { ...state, matchInfo: action.payload };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_SELECTED_MATCH':
      return { ...state, selectedMatchId: action.payload };

    default:
      return state;
  }
}

// --- Context ---

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getUploadedCrowdData: () => ParsedData | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

// --- Provider ---

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevCrowdRef = useRef<CrowdSnapshot>(state.crowdData);

  const getUploadedCrowdData = useCallback((): ParsedData | undefined => {
    const crowdFile = state.uploadedFiles.find(
      f => f.status === 'parsed' && f.parsedData?.detectedType === 'crowd_data'
    );
    return crowdFile?.parsedData;
  }, [state.uploadedFiles]);

  // Crowd simulation loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!state.isSimulationRunning) return;

    const interval = 3000 / state.simulationSpeed;

    intervalRef.current = setInterval(() => {
      const uploadedData = getUploadedCrowdData();
      const newCrowd = generateCrowdSnapshot(
        state.selectedStadium,
        prevCrowdRef.current,
        uploadedData
      );
      prevCrowdRef.current = newCrowd;

      dispatch({ type: 'UPDATE_CROWD', payload: newCrowd });
      dispatch({ type: 'ADD_CROWD_HISTORY', payload: newCrowd });

      // Generate insights periodically
      const insights = generateInsights(newCrowd, state.selectedStadium);
      dispatch({ type: 'SET_INSIGHTS', payload: insights });
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isSimulationRunning, state.simulationSpeed, state.selectedStadium, getUploadedCrowdData]);

  return (
    <AppContext.Provider value={{ state, dispatch, getUploadedCrowdData }}>
      {children}
    </AppContext.Provider>
  );
}

// --- Hook ---

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
