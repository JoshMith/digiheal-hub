import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Interaction, Department, PriorityLevel, AppointmentType } from '@/types/api.types';

interface ActiveInteraction {
  interactionId: string;
  appointmentId: string;
  patientName: string;
  patientId: string;
  department: Department;
  priority: PriorityLevel;
  appointmentType: AppointmentType;
  currentPhase: Interaction;
  startTime: Date;
  phaseStartTime: Date;
  totalElapsed: number;
}

interface InteractionContextType {
  activeInteraction: ActiveInteraction | null;
  startInteraction: (interaction: Omit<ActiveInteraction, 'startTime' | 'phaseStartTime' | 'totalElapsed'>) => void;
  updatePhase: (phase: Interaction, elapsedInPhase: number) => void;
  endInteraction: () => void;
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
}

const STORAGE_KEY = 'dkut_active_interaction';

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export function InteractionProvider({ children }: { children: ReactNode }) {
  const [activeInteraction, setActiveInteraction] = useState<ActiveInteraction | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveInteraction({
          ...parsed,
          startTime: new Date(parsed.startTime),
          phaseStartTime: new Date(parsed.phaseStartTime),
        });
      } catch (e) {
        console.error('Failed to restore interaction state:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (activeInteraction) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...activeInteraction,
        startTime: activeInteraction.startTime.toISOString(),
        phaseStartTime: activeInteraction.phaseStartTime.toISOString(),
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeInteraction]);

  const startInteraction = useCallback((interaction: Omit<ActiveInteraction, 'startTime' | 'phaseStartTime' | 'totalElapsed'>) => {
    const now = new Date();
    setActiveInteraction({
      ...interaction,
      startTime: now,
      phaseStartTime: now,
      totalElapsed: 0,
    });
    setIsMinimized(false);
  }, []);

  const updatePhase = useCallback((phase: Interaction, elapsedInPhase: number) => {
    setActiveInteraction(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentPhase: phase,
        phaseStartTime: new Date(),
        totalElapsed: prev.totalElapsed + elapsedInPhase,
      };
    });
  }, []);

  const endInteraction = useCallback(() => {
    setActiveInteraction(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <InteractionContext.Provider value={{
      activeInteraction,
      startInteraction,
      updatePhase,
      endInteraction,
      isMinimized,
      setIsMinimized,
    }}>
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteractionContext() {
  const context = useContext(InteractionContext);
  if (context === undefined) {
    throw new Error('useInteractionContext must be used within an InteractionProvider');
  }
  return context;
}
