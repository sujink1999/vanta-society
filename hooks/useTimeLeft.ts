import moment from "moment";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseTimeLeftProps {
  targetDate?: string;
  onComplete?: () => void;
}

export function useTimeLeft({ targetDate, onComplete }: UseTimeLeftProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const startDate = moment(targetDate);
      const now = moment();
      const difference = startDate.diff(now);

      if (difference > 0) {
        const duration = moment.duration(difference);
        setTimeLeft({
          days: Math.floor(duration.asDays()),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        });
      } else {
        // Time has reached, call onComplete callback
        if (onComplete) {
          onComplete();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return timeLeft;
}
