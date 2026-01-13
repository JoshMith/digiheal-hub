import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Play, 
  Pause, 
  CheckCircle, 
  Activity,
  Stethoscope,
  ClipboardCheck
} from "lucide-react";
import type { InteractionPhase } from "@/types/api.types";

interface InteractionTimerProps {
  appointmentId: string;
  patientName: string;
  predictedDuration?: number;
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

export const InteractionTimer = ({
  appointmentId,
  patientName,
  predictedDuration,
  onPhaseChange,
  onComplete,
  initialPhase = 'CHECKED_IN'
}: InteractionTimerProps) => {
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

  const advancePhase = useCallback(() => {
    const currentIndex = getPhaseIndex(currentPhase);
    if (currentIndex < phases.length - 1) {
      const now = new Date();
      
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
      }
    }
  }, [currentPhase, phases, elapsedTime, totalDuration, onPhaseChange, onComplete]);

  const getNextPhaseLabel = (): string => {
    const currentIndex = getPhaseIndex(currentPhase);
    if (currentIndex < phases.length - 1) {
      return phases[currentIndex + 1].label;
    }
    return 'Done';
  };

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

  return (
    <Card className="shadow-medium border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{patientName}</h3>
            <p className="text-sm text-muted-foreground">Appointment #{appointmentId.slice(0, 8)}</p>
          </div>
          {predictedDuration && (
            <Badge variant="outline" className="text-xs">
              Predicted: {predictedDuration} min
            </Badge>
          )}
        </div>

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
        {!isCompleted && (
          <Button 
            className="w-full bg-accent hover:bg-accent-hover text-accent-foreground"
            onClick={advancePhase}
          >
            {currentPhase === 'CHECKED_IN' || currentPhase === 'VITALS_COMPLETE' ? (
              <Play className="h-4 w-4 mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {getButtonLabel()}
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
