import { useEffect, useState } from 'react';

export const useCountdownTimer = (endTime: string | Date | undefined | null) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
    isEnded: boolean;
  }>(() => calculateTimeLeft(endTime));

  useEffect(() => {
    // If endTime is missing, don't set an interval
    if (!endTime) {
      setTimeLeft(calculateTimeLeft(endTime));
      return;
    }

    setTimeLeft(calculateTimeLeft(endTime));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime && new Date(endTime).getTime()]); // Use numeric timestamp for stable comparison

  return timeLeft;
};

function calculateTimeLeft(endTime: string | Date | undefined | null) {
  if (!endTime) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: 'Loading...',
      isEnded: false,
    };
  }
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: 'Auction Ended',
      isEnded: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted,
    isEnded: false,
  };
}
