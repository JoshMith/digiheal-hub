import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Play, 
  CheckCircle, 
  Activity,
  Stethoscope,
  ClipboardCheck,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useInteraction,
  useStartVitals,
  useEndVitals,
  useStartConsultation,
  useEndConsultation,
  useCheckout,
  useDurationPrediction
} from "@/hooks/use-interactions";
import type { InteractionPhase, Department, Priority, AppointmentType } from "@/types/api.types";

interface InteractionTimerProps {
  interactionId?: string;
  appointmentId: string;
  patientName: string;
  department?: Department;
  priority?: Priority;
  appointmentType?: AppointmentType;
  symptomCount?: number;
  onPhaseChange?: (phase: InteractionPhase, timestamp: Date) => void;
  onComplete?: (totalDuration: number) => void;
  initialPhase?: InteractionPhase;
}

interface PhaseData {
  phase: InteractionPhase;
  label: string;
  icon: React.ReactNode;
  color: string;
  duration: number;
  startTime?: Date;
  endTime?: Date;
}

const STORAGE_KEY_PREFIX = 'dkut_interaction_timer_';

export const InteractionTimer = ({
  interactionId: externalInteractionId,
  appointmentId,
  patientName,
  department = 'GENERAL_MEDICINE',
  priority = 'NORMAL',
  appointmentType = 'ROUTINE_CHECKUP',
  symptomCount = 1,
  onPhaseChange,
  onComplete,
  initialPhase = 'CHECKED_IN'
}: InteractionTimerProps) => {
  const { toast } = useToast();
  
  // API hooks
  const { data: interactionData, isLoading: isLoadingInteraction } = useInteraction(externalInteractionId || '');
  const startVitalsMutation = useStartVitals();
  const endVitalsMutation = useEndVitals();
  const startConsultationMutation = useStartConsultation();
  const endConsultationMutation = useEndConsultation();
  const checkoutMutation = useCheckout();
  
  // Get ML prediction
  const { data: prediction } = useDurationPrediction({
    department,
    priority,
    appointmentType,
    symptomCount,
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay()
  });

  const [currentPhase, setCurrentPhase] = useState<InteractionPhase>(initialPhase);
  const [phases, setPhases] = useState<PhaseData[]>([
    { phase: 'CHECKED_IN', label: 'Check-in', icon: <ClipboardCheck className="h-4 w-4" />, color: 'bg-blue-500', duration: 0 },
    { phase: 'VITALS_IN_PROGRESS', label: 'Vitals', icon: <Activity className="h-4 w-4" />, color: 'bg-yellow-500', duration: 0 },
    { phase: 'VITALS_COMPLETE', label: 'Vitals Done', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-500', duration: 0 },
    { phase: 'INTERACTION_IN_PROGRESS', label: 'Consultation', icon: <Stethoscope className="h-4 w-4" />, color: 'bg-primary', duration: 0 },
    { phase: 'COMPLETED', label: 'Complete', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-accent', duration: 0 },
  ]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [phaseStartTime, setPhaseStartTime] = useState<Date | null>(new Date());
  const [isRunning, setIsRunning] = useState(true);
  const [totalDuration, setTotalDuration] = useState(0);
  const [interactionId, setInteractionId] = useState<string | undefined>(externalInteractionId);

  // Load state from localStorage on mount
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${appointmentId}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentPhase(parsed.currentPhase);
        setPhases(parsed.phases);
        setTotalDuration(parsed.totalDuration);
        setInteractionId(parsed.interactionId);
        
        if (parsed.phaseStartTime && parsed.currentPhase !== 'COMPLETED') {
          const savedStart = new Date(parsed.phaseStartTime);
          setPhaseStartTime(savedStart);
          setIsRunning(true);
        }
      } catch (e) {
        console.error('Failed to restore timer state:', e);
      }
    }
  }, [appointmentId]);

  // Sync with backend interaction data
  useEffect(() => {
    if (interactionData) {
      // Map backend phase to frontend phase
      if (interactionData.checkoutTime) {
        setCurrentPhase('COMPLETED');
        setIsRunning(false);
      } else if (interactionData.interactionStartTime) {
        setCurrentPhase('INTERACTION_IN_PROGRESS');
      } else if (interactionData.vitalsEndTime) {
        setCurrentPhase('VITALS_COMPLETE');
      } else if (interactionData.vitalsStartTime) {
        setCurrentPhase('VITALS_IN_PROGRESS');
      } else if (interactionData.checkInTime) {
        setCurrentPhase('CHECKED_IN');
      }
      
      // Update durations from backend
      if (interactionData.vitalsDuration) {
        setPhases(prev => prev.map(p => 
          p.phase === 'VITALS_IN_PROGRESS' ? { ...p, duration: interactionData.vitalsDuration! * 60 } : p
        ));
      }
      if (interactionData.interactionDuration) {
        setPhases(prev => prev.map(p => 
          p.phase === 'INTERACTION_IN_PROGRESS' ? { ...p, duration: interactionData.interactionDuration! * 60 } : p
        ));
      }
    }
  }, [interactionData]);

  // Save state to localStorage on changes
  useEffect(() => {
    if (currentPhase !== 'CHECKED_IN' || totalDuration > 0) {
      const storageKey = `${STORAGE_KEY_PREFIX}${appointmentId}`;
      localStorage.setItem(storageKey, JSON.stringify({
        currentPhase,
        phases,
        totalDuration,
        phaseStartTime: phaseStartTime?.toISOString(),
        interactionId
      }));
    }
  }, [currentPhase, phases, totalDuration, phaseStartTime, appointmentId, interactionId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && phaseStartTime && currentPhase !== 'COMPLETED') {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - phaseStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, phaseStartTime, currentPhase]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseIndex = (phase: InteractionPhase): number => {
    return phases.findIndex(p => p.phase === phase);
  };

  const isLoading = startVitalsMutation.isPending || 
    endVitalsMutation.isPending || 
    startConsultationMutation.isPending || 
    endConsultationMutation.isPending ||
    checkoutMutation.isPending;

  const advancePhase = useCallback(async () => {
    if (!interactionId) {
      toast({
        title: "Error",
        description: "No active interaction. Please start the interaction first.",
        variant: "destructive"
      });
      return;
    }

    const currentIndex = getPhaseIndex(currentPhase);
    if (currentIndex < phases.length - 1) {
      const now = new Date();
      
      try {
        // Call API based on current phase
        switch (currentPhase) {
          case 'CHECKED_IN':
            await startVitalsMutation.mutateAsync(interactionId);
            break;
          case 'VITALS_IN_PROGRESS':
            await endVitalsMutation.mutateAsync(interactionId);
            break;
          case 'VITALS_COMPLETE':
            await startConsultationMutation.mutateAsync(interactionId);
            break;
          case 'INTERACTION_IN_PROGRESS':
            await endConsultationMutation.mutateAsync(interactionId);
            await checkoutMutation.mutateAsync(interactionId);
            break;
        }

        // Update current phase end time and duration
        setPhases(prev => prev.map((p, i) => {
          if (i === currentIndex) {
            return { ...p, endTime: now, duration: elapsedTime };
          }
          return p;
        }));

        // Set total duration
        setTotalDuration(prev => prev + elapsedTime);

        // Move to next phase
        const nextPhase = phases[currentIndex + 1].phase;
        setCurrentPhase(nextPhase);
        setPhaseStartTime(now);
        setElapsedTime(0);
        
        // Update next phase start time
        setPhases(prev => prev.map((p, i) => {
          if (i === currentIndex + 1) {
            return { ...p, startTime: now };
          }
          return p;
        }));

        onPhaseChange?.(nextPhase, now);

        // Check if completed
        if (nextPhase === 'COMPLETED') {
          setIsRunning(false);
          onComplete?.(totalDuration + elapsedTime);
          
          // Clear localStorage
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${appointmentId}`);
          
          toast({
            title: "Consultation Complete",
            description: `Total time: ${formatTime(totalDuration + elapsedTime)}`,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update phase",
          variant: "destructive"
        });
      }
    }
  }, [currentPhase, phases, elapsedTime, totalDuration, interactionId, appointmentId, onPhaseChange, onComplete, toast, startVitalsMutation, endVitalsMutation, startConsultationMutation, endConsultationMutation, checkoutMutation]);

  const getButtonLabel = (): string => {
    switch (currentPhase) {
      case 'CHECKED_IN':
        return 'Start Vitals';
      case 'VITALS_IN_PROGRESS':
        return 'Complete Vitals';
      case 'VITALS_COMPLETE':
        return 'Start Consultation';
      case 'INTERACTION_IN_PROGRESS':
        return 'Complete Consultation';
      default:
        return 'Done';
    }
  };

  const isCompleted = currentPhase === 'COMPLETED';
  const predictedDuration = prediction?.predictedDuration;

  if (isLoadingInteraction && externalInteractionId) {
    return (
      <Card className="shadow-medium border-l-4 border-l-primary">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading interaction...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{patientName}</h3>
            <p className="text-sm text-muted-foreground">
              {interactionId ? `Interaction #${interactionId.slice(0, 8)}` : `Appointment #${appointmentId.slice(0, 8)}`}
            </p>
          </div>
          <div className="flex gap-2">
            {predictedDuration && (
              <Badge variant="outline" className="text-xs">
                Predicted: {predictedDuration} min
              </Badge>
            )}
            {prediction?.confidence && (
              <Badge variant="secondary" className="text-xs">
                {Math.round(prediction.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>

        {!interactionId && (
          <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <p className="text-sm text-warning">Waiting for interaction to start...</p>
          </div>
        )}

        {/* Phase Progress */}
        <div className="flex items-center gap-2 mb-4">
          {phases.map((phase, index) => {
            const currentIndex = getPhaseIndex(currentPhase);
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;
            
            return (
              <div key={phase.phase} className="flex items-center">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-white
                    ${isActive ? phase.color + ' animate-pulse' : ''}
                    ${isPast ? 'bg-accent' : ''}
                    ${!isActive && !isPast ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {isPast ? <CheckCircle className="h-4 w-4" /> : phase.icon}
                </div>
                {index < phases.length - 1 && (
                  <div 
                    className={`w-8 h-1 ${isPast ? 'bg-accent' : 'bg-muted'}`} 
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Phase Timer */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Phase</p>
              <p className="font-semibold">{phases[getPhaseIndex(currentPhase)]?.label}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-mono font-bold text-primary">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              {!isCompleted && (
                <p className="text-xs text-muted-foreground">
                  Total: {formatTime(totalDuration + elapsedTime)}
                </p>
              )}
            </div>
          </div>
          
          {/* Progress bar comparing to predicted */}
          {predictedDuration && !isCompleted && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round(((totalDuration + elapsedTime) / 60 / predictedDuration) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    (totalDuration + elapsedTime) / 60 > predictedDuration 
                      ? 'bg-warning' 
                      : 'bg-accent'
                  }`}
                  style={{ 
                    width: `${Math.min(100, ((totalDuration + elapsedTime) / 60 / predictedDuration) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Phase Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {phases.slice(0, 4).map((phase) => (
            <div 
              key={phase.phase} 
              className="text-center p-2 bg-muted/30 rounded"
            >
              <p className="text-xs text-muted-foreground">{phase.label}</p>
              <p className="font-mono text-sm">
                {phase.duration > 0 ? formatTime(phase.duration) : '--:--'}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {!isCompleted && interactionId && (
          <Button 
            className="w-full bg-accent hover:bg-accent-hover text-accent-foreground"
            onClick={advancePhase}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : currentPhase === 'CHECKED_IN' || currentPhase === 'VITALS_COMPLETE' ? (
              <Play className="h-4 w-4 mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Processing...' : getButtonLabel()}
          </Button>
        )}

        {isCompleted && (
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <CheckCircle className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="font-semibold text-accent">Consultation Complete</p>
            <p className="text-sm text-muted-foreground">
              Total Time: {formatTime(totalDuration)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractionTimer;
