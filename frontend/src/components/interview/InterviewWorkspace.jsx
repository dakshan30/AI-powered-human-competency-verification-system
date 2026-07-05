import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import "./InterviewWorkspace.css";

const InterviewWorkspace = ({
  interview,
  currentQuestion,
  answer,
  setAnswer,
  onSubmit,
  submitting,
  onFraudDetected,
}) => {
  const [timeLeft, setTimeLeft] =
    useState(180);

  const [
    warningCount,
    setWarningCount,
  ] = useState(0);

  const [
    tabSwitchCount,
    setTabSwitchCount,
  ] = useState(0);

  const [
    fullscreenExited,
    setFullscreenExited,
  ] = useState(false);

  const [
    cameraBlocked,
    setCameraBlocked,
  ] = useState(false);

  const videoRef =
    useRef(null);

  /*
  ====================================
  FORCE FULLSCREEN
  ====================================
  */

  const enableFullscreen =
    async () => {
      try {
        if (
          !document.fullscreenElement
        ) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log(error);
      }
    };

  /*
  ====================================
  DETECT FULLSCREEN EXIT
  ====================================
  */

  useEffect(() => {
    const handleFullscreen =
      () => {
        if (
          !document.fullscreenElement
        ) {
          setFullscreenExited(
            true
          );

          setWarningCount(
            (prev) =>
              prev + 1
          );

          enableFullscreen();

          if (
            warningCount >= 2
          ) {
            onFraudDetected();
          }
        }
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      );
    };
  }, [warningCount]);

  /*
  ====================================
  TAB SWITCH DETECTION
  ====================================
  */

  useEffect(() => {
    const handleVisibility =
      () => {
        if (
          document.hidden
        ) {
          setTabSwitchCount(
            (prev) =>
              prev + 1
          );

          setWarningCount(
            (prev) =>
              prev + 1
          );

          if (
            warningCount >= 2
          ) {
            onFraudDetected();
          }
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [warningCount]);

  /*
  ====================================
  CAMERA
  ====================================
  */

  useEffect(() => {
    const startCamera =
      async () => {
        try {
          const stream =
            await navigator.mediaDevices.getUserMedia(
              {
                video: true,
              }
            );

          if (
            videoRef.current
          ) {
            videoRef.current.srcObject =
              stream;
          }
        } catch (error) {
          setCameraBlocked(
            true
          );
        }
      };

    startCamera();
  }, []);

  /*
  ====================================
  TIMER
  ====================================
  */

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit();
      return;
    }

    const interval =
      setInterval(() => {
        setTimeLeft(
          (prev) =>
            prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [timeLeft]);

  /*
  ====================================
  FORMAT
  ====================================
  */

  const formatTime = (
    seconds
  ) => {
    const mins =
      Math.floor(
        seconds / 60
      );

    const secs =
      seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="workspace-wrapper">
      <div className="workspace-navbar">
        <div>
          <h1>
            Enterprise AI Interview
          </h1>

          <p>
            Question{" "}
            {interview.currentQuestion +
              1}
            /{" "}
            {
              interview
                .questions
                .length
            }
          </p>
        </div>

        <div className="workspace-top-right">
          <div className="timer-box">
            ⏱{" "}
            {formatTime(
              timeLeft
            )}
          </div>

          <div className="warning-box">
            ⚠{" "}
            {warningCount}
          </div>
        </div>
      </div>

      <div className="workspace-main">
        {/* LEFT */}

        <div className="workspace-left">
          <div className="question-card">
            <div className="question-badge">
              AI Interview Question
            </div>

            <h2>
              {
                currentQuestion.question
              }
            </h2>
          </div>

          <div className="answer-card">
            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
              placeholder="Write your answer here..."
            />

            <button
              onClick={
                onSubmit
              }
              disabled={
                submitting
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit Answer"}
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div className="workspace-right">
          <div className="monitor-card">
            <div className="monitor-header">
              Live Monitoring
            </div>

            {cameraBlocked ? (
              <div className="camera-error">
                Camera Access Denied
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
              />
            )}
          </div>

          <div className="integrity-card">
            <h3>
              Integrity Status
            </h3>

            <div className="integrity-item">
              Fullscreen:
              {" "}
              {fullscreenExited
                ? "Exited"
                : "Active"}
            </div>

            <div className="integrity-item">
              Tab Switches:
              {" "}
              {
                tabSwitchCount
              }
            </div>

            <div className="integrity-item">
              Camera:
              {" "}
              {cameraBlocked
                ? "Blocked"
                : "Active"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkspace;