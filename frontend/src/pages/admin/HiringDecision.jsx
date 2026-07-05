import React from "react";

import {
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import DecisionPanel from "../../components/admin/assessment/DecisionPanel";

import {
  updateDecision,
} from "../../services/interviewService";

const HiringDecision =
  () => {

    const { id } =
      useParams();

    const handleDecision =
      async (
        decision
      ) => {

        try {

          await updateDecision(
            id,
            decision
          );

          toast.success(
            "Decision saved"
          );

        } catch (
          error
        ) {

          toast.error(
            "Failed to save decision"
          );
        }
      };

    return (
      <DecisionPanel
        onSubmit={
          handleDecision
        }
      />
    );
  };

export default HiringDecision;