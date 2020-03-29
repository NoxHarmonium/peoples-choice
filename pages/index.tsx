import { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, CircularProgress } from "@material-ui/core";
import { knuthShuffle } from "knuth-shuffle";
import {
  Candidates,
  Votes,
  CandidatesResponse,
  VotesResponse
} from "../utils/types";
import { CandidateCard } from "../components/candidate-card";
import { CandidateGrid } from "../components/candidate-grid";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidates>([]);
  const [votes, setVotes] = useState<Votes>([]);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        const responses = await Promise.all([
          fetch("/api/candidates"),
          fetch("/api/votes")
        ]);

        const [candidateResponse, votesResponse] = responses;

        if (candidateResponse.status === 401) {
          console.log("Unauthorized response. Redirecting to login.");
          window.location.replace("/api/login");
          return;
        }

        if (!responses.every(r => r.ok)) {
          throw new Error("One ore more network responses were not ok");
        }

        const candidateJson = await candidateResponse.json();
        const votesJson = await votesResponse.json();
        setCandidates(
          knuthShuffle((candidateJson as CandidatesResponse).candidates)
        );
        setVotes((votesJson as VotesResponse).votes);
      } catch (e) {
        console.error("Error caught while fetching data: ", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return loading ? (
    <CircularProgress />
  ) : (
    <CandidateGrid candidates={candidates} votes={votes} setVotes={setVotes} />
  );
};

export default Home;
