import React, {
  useEffect,
  useState,
} from "react";

const InterviewTimer = ({
  duration,

  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] =
    useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();

      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (prev) => prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  return (
    <div className="interview-timer">
      {minutes}:
      {seconds
        .toString()
        .padStart(2, "0")}
    </div>
  );
};

export default InterviewTimer;