import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Clock,
  Minimize2,
  Maximize2,
  X,
  User,
  Activity,
  Stethoscope,
  ClipboardCheck,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { useInteractionContext } from '@/context/interactionContext';
import { useAuth } from '@/context/authContext';
import type { InteractionPhase, Interaction } from '@/types/api.types';

type PhaseConfig = Record<InteractionPhase, { label: string; icon: React.ReactNode; color: string }>;

const phaseConfig: PhaseConfig = {
  CHECKED_IN: { label: 'Checked In', icon: <ClipboardCheck className="h-3 w-3" />, color: 'bg-blue-500' },
  VITALS_IN_PROGRESS: { label: 'Vitals', icon: <Activity className="h-3 w-3" />, color: 'bg-yellow-500' },
  VITALS_COMPLETE: { label: 'Vitals Done', icon: <CheckCircle className="h-3 w-3" />, color: 'bg-green-500' },
  INTERACTION_IN_PROGRESS: { label: 'Consultation', icon: <Stethoscope className="h-3 w-3" />, color: 'bg-primary' },
  COMPLETED: { label: 'Complete', icon: <CheckCircle className="h-3 w-3" />, color: 'bg-accent' },
};

export function FloatingTimer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeInteraction, isMinimized, setIsMinimized, endInteraction } = useInteractionContext();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Only show for staff/admin users
  const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN';

  // Timer effect
  useEffect(() => {
    if (!activeInteraction) return;
    
    // Get current phase as InteractionPhase
    const currentPhase = activeInteraction.currentPhase as unknown as InteractionPhase;
    if (currentPhase === 'COMPLETED') return;

    const interval = setInterval(() => {
      const now = new Date();
      const phaseElapsed = Math.floor((now.getTime() - activeInteraction.phaseStartTime.getTime()) / 1000);
      setElapsedTime(phaseElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeInteraction]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViewDetails = () => {
    if (activeInteraction) {
      navigate(`/patient/${activeInteraction.patientId}`);
    }
  };

  if (!activeInteraction || !isStaff) return null;

  // Cast the current phase properly
  const currentPhase = activeInteraction.currentPhase as unknown as InteractionPhase;
  const currentPhaseConfig = phaseConfig[currentPhase] || phaseConfig.CHECKED_IN;
  const totalTime = activeInteraction.totalElapsed + elapsedTime;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        drag={!isMinimized}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
        className="fixed bottom-4 right-4 z-50"
        style={{ touchAction: 'none' }}
      >
        {isMinimized ? (
          // Minimized view - small pill
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !isDragging && setIsMinimized(false)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`w-2 h-2 rounded-full ${currentPhaseConfig.color} animate-pulse`} />
            <Clock className="h-4 w-4" />
            <span className="font-mono font-semibold">{formatTime(elapsedTime)}</span>
            <Maximize2 className="h-3 w-3 ml-1" />
          </motion.button>
        ) : (
          // Expanded view
          <Card className="w-72 shadow-xl border-l-4 border-l-primary overflow-hidden">
            {/* Header */}
            <div className="bg-primary/10 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentPhaseConfig.color} animate-pulse`} />
                <span className="text-sm font-medium">Active Interaction</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={endInteraction}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">
              {/* Patient Info */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activeInteraction.patientName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activeInteraction.department.replace(/_/g, ' ')}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {activeInteraction.priority.toLowerCase()}
                </Badge>
              </div>

              {/* Phase & Timer */}
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded ${currentPhaseConfig.color} text-white`}>
                      {currentPhaseConfig.icon}
                    </div>
                    <span className="text-xs font-medium">{currentPhaseConfig.label}</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-primary">
                    {formatTime(elapsedTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total time</span>
                  <span className="font-mono">{formatTime(totalTime)}</span>
                </div>
              </div>

              {/* Action */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={handleViewDetails}
              >
                View Details
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default FloatingTimer;
