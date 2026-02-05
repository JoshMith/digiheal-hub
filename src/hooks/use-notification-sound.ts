import { useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseNotificationSoundOptions {
  /** Threshold in seconds before triggering alert */
  thresholdSeconds: number;
  /** Current elapsed time in seconds */
  elapsedSeconds: number;
  /** Whether the timer is active */
  isActive: boolean;
  /** Optional label for the notification */
  label?: string;
}

// Web Audio API-based notification sound generator
const createNotificationSound = (type: 'warning' | 'alert' = 'warning') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'warning') {
      // Two-tone warning beep
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.15); // E5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else {
      // Urgent triple beep
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.01, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.01, audioContext.currentTime + 0.25);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.45);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.45);
    }
  } catch (e) {
    console.warn('Web Audio API not available:', e);
  }
};

export function useNotificationSound({
  thresholdSeconds,
  elapsedSeconds,
  isActive,
  label = 'Interaction',
}: UseNotificationSoundOptions) {
  const hasAlertedRef = useRef(false);
  const hasWarningRef = useRef(false);
  const warningThreshold = Math.floor(thresholdSeconds * 0.8); // 80% of threshold

  const playWarningSound = useCallback(() => {
    createNotificationSound('warning');
  }, []);

  const playAlertSound = useCallback(() => {
    createNotificationSound('alert');
  }, []);

  const resetAlerts = useCallback(() => {
    hasAlertedRef.current = false;
    hasWarningRef.current = false;
  }, []);

  useEffect(() => {
    if (!isActive || thresholdSeconds <= 0) return;

    // Warning at 80% of predicted time
    if (elapsedSeconds >= warningThreshold && !hasWarningRef.current) {
      hasWarningRef.current = true;
      playWarningSound();
      toast.warning(`${label} approaching predicted time`, {
        description: `${Math.floor((thresholdSeconds - elapsedSeconds) / 60)}:${String((thresholdSeconds - elapsedSeconds) % 60).padStart(2, '0')} remaining`,
        duration: 4000,
      });
    }

    // Alert when exceeding predicted time
    if (elapsedSeconds >= thresholdSeconds && !hasAlertedRef.current) {
      hasAlertedRef.current = true;
      playAlertSound();
      toast.error(`${label} exceeded predicted duration!`, {
        description: 'Consider wrapping up or adjusting the schedule',
        duration: 6000,
      });
    }
  }, [elapsedSeconds, thresholdSeconds, warningThreshold, isActive, label, playWarningSound, playAlertSound]);

  return { 
    playWarningSound, 
    playAlertSound, 
    resetAlerts,
    isOverTime: elapsedSeconds >= thresholdSeconds,
    isNearLimit: elapsedSeconds >= warningThreshold && elapsedSeconds < thresholdSeconds,
  };
}

export default useNotificationSound;
