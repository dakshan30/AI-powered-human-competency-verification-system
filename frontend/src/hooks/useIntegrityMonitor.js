import {
  useEffect,
  useState,
} from "react";

import {
  logIntegrityEvent,
} from "../services/integrityService";

/*
====================================
INTEGRITY MONITOR
====================================
*/

const useIntegrityMonitor =
  (
    interviewId
  ) => {
    const [
      violations,
      setViolations,
    ] = useState([]);

    /*
    ====================================
    LOG EVENT
    ====================================
    */

    const logViolation =
      async (
        type,
        severity = 1,
        metadata = {}
      ) => {
        try {
          /*
          PAYLOAD
          */

          const payload = {
            interviewId,

            type,

            severity,

            metadata,
          };

          /*
          API
          */

          await logIntegrityEvent(
            payload
          );

          /*
          STATE
          */

          setViolations(
            (
              prev
            ) => [
              ...prev,

              payload,
            ]
          );
        } catch (error) {
          console.log(error);
        }
      };

    /*
    ====================================
    TAB SWITCH
    ====================================
    */

    useEffect(() => {
      const handleVisibility =
        () => {
          if (
            document.hidden
          ) {
            logViolation(
              "TAB_SWITCH",

              2
            );
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
    }, []);

    /*
    ====================================
    WINDOW BLUR
    ====================================
    */

    useEffect(() => {
      const handleBlur =
        () => {
          logViolation(
            "WINDOW_BLUR",

            1
          );
        };

      window.addEventListener(
        "blur",

        handleBlur
      );

      return () => {
        window.removeEventListener(
          "blur",

          handleBlur
        );
      };
    }, []);

    /*
    ====================================
    COPY
    ====================================
    */

    useEffect(() => {
      const handleCopy =
        (e) => {
          e.preventDefault();

          logViolation(
            "COPY_ATTEMPT",

            3
          );
        };

      document.addEventListener(
        "copy",

        handleCopy
      );

      return () => {
        document.removeEventListener(
          "copy",

          handleCopy
        );
      };
    }, []);

    /*
    ====================================
    PASTE
    ====================================
    */

    useEffect(() => {
      const handlePaste =
        (e) => {
          e.preventDefault();

          logViolation(
            "PASTE_ATTEMPT",

            3
          );
        };

      document.addEventListener(
        "paste",

        handlePaste
      );

      return () => {
        document.removeEventListener(
          "paste",

          handlePaste
        );
      };
    }, []);

    /*
    ====================================
    RIGHT CLICK
    ====================================
    */

    useEffect(() => {
      const handleContext =
        (e) => {
          e.preventDefault();

          logViolation(
            "RIGHT_CLICK",

            1
          );
        };

      document.addEventListener(
        "contextmenu",

        handleContext
      );

      return () => {
        document.removeEventListener(
          "contextmenu",

          handleContext
        );
      };
    }, []);

    /*
    ====================================
    DEVTOOLS DETECTION
    ====================================
    */

    useEffect(() => {
      const threshold =
        160;

      const detect =
        () => {
          if (
            window.outerWidth -
              window.innerWidth >
              threshold ||
            window.outerHeight -
              window.innerHeight >
              threshold
          ) {
            logViolation(
              "DEVTOOLS_OPEN",

              5
            );
          }
        };

      const interval =
        setInterval(
          detect,

          3000
        );

      return () =>
        clearInterval(
          interval
        );
    }, []);

    return {
      violations,
    };
  };

export default useIntegrityMonitor;