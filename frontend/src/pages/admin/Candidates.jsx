import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import SectionHeader from "../../components/dashboard/shared/SectionHeader";
import SearchBar from "../../components/dashboard/shared/SearchBar";
import FilterDropdown from "../../components/dashboard/shared/FilterDropdown";
import CandidateTable from "../../components/dashboard/admin/CandidateTable";

import API from "../../services/api";

const Candidates = () => {

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [candidates, setCandidates] =
    useState([]);

  const loadCandidates =
    async () => {

      try {

        const response =
          await API.get(
            "/admin/candidates"
          );

        setCandidates(
          response.data.data || []
        );

      }

      catch (error) {

        console.error(
          "Candidate Fetch Error",
          error
        );

      }

      finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    loadCandidates();

  }, []);

  const filteredCandidates =
    useMemo(() => {

      return candidates.filter(
        (candidate) => {

          const matchesSearch =

            candidate.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            candidate.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =

            status === "All"

              ? true

              : candidate.status ===
                status;

          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      candidates,
      search,
      status,
    ]);

  return (

    <DashboardLayout>

      <SectionHeader

        title="Candidate Management"

        subtitle="Monitor interview progress, competency scores and recruiter decisions."

      />

      <div className="table-controls">

        <SearchBar

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          placeholder="Search by candidate or email"

        />

        <FilterDropdown

          value={status}

          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }

          options={[

            "All",

            "Completed",

            "Pending",

            "Rejected",

            "Hold",

            "Hired",

          ]}

        />

      </div>

      <CandidateTable

        loading={loading}

        candidates={
          filteredCandidates
        }

      />

    </DashboardLayout>

  );

};

export default Candidates;