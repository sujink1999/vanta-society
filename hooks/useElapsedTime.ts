import moment from "moment";
import { useEffect, useState } from "react";

interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseElapsedTimeProps {
  startDate?: string;
}

export function useElapsedTime({ startDate }: UseElapsedTimeProps) {
  const [elapsedTime, setElapsedTime] = useState<ElapsedTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!startDate) return;

    const calculateElapsedTime = () => {
      const start = moment(startDate);
      const now = moment();
      const difference = now.diff(start);

      if (difference > 0) {
        const duration = moment.duration(difference);
        setElapsedTime({
          days: Math.floor(duration.asDays()),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        });
      }
    };

    calculateElapsedTime();
    const timer = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return elapsedTime;
}
