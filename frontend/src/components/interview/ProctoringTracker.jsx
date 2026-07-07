import React, { useEffect, useRef } from "react";
import { logProctoringEvent } from "../../services/integrityService";

/**
 * A functional React wrapper that encapsulates candidate interview screens,
 * captures proctoring violations, and logs them to the backend in real-time.
 * 
 * @param {string} sessionId - Active interview session ID.
 * @param {string} status - Progression status of the session (e.g. 'in_progress', 'completed').
 * @param {React.ReactNode} children - Nested component structure representing the workspaces.
 */
const ProctoringTracker = ({ sessionId, status, children }) => {
  const lastLoggedRef = useRef({});

  // Helper dispatcher with debouncing
  const emitEvent = async (eventType, additionalMeta = {}) => {
    if (status !== "in_progress" || !sessionId) return;

    const now = Date.now();
    const lastTime = lastLoggedRef.current[eventType] || 0;
    
    // Debounce to block rapid duplicate events
    if (now - lastTime < 1500) {
      return;
    }
    lastLoggedRef.current[eventType] = now;

    try {
      console.log(`[Proctoring] Intercepted event: ${eventType}`, additionalMeta);
      
      await logProctoringEvent({
        interviewSessionId: sessionId,
        eventType,
        additionalMeta: {
          ...additionalMeta,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      });
    } catch (err) {
      console.error("[Proctoring] Failed to log telemetry item:", err);
    }
  };

  useEffect(() => {
    if (status !== "in_progress" || !sessionId) return;

    // 1. Tab Focus loss tracker
    const handleBlur = () => {
      emitEvent("TAB_BLUR", { 
        description: "Candidate navigated away from assessment window." 
      });
    };

    // 2. Viewport Resize tracker
    const handleResize = () => {
      emitEvent("WINDOW_RESIZE", { 
        description: "Candidate modified view size or attempted screen split.",
        size: `${window.innerWidth}x${window.innerHeight}`
      });
    };

    // 3. Clipboard copy/paste blocker
    const handleCopy = (e) => {
      e.preventDefault();
      emitEvent("COPY_PASTE_ATTEMPT", { 
        description: "Candidate attempted to copy interview question text." 
      });
    };

    const handlePaste = (e) => {
      e.preventDefault();
      emitEvent("COPY_PASTE_ATTEMPT", { 
        description: "Candidate attempted to paste content into answers container." 
      });
    };

    // Attach listeners
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", handleResize);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      // Cleanup listeners
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [sessionId, status]);

  return <>{children}</>;
};

export default ProctoringTracker;
