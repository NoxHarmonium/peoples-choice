import { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { CircularProgress, ThemeProvider } from "@material-ui/core";
import { knuthShuffle as knuthShuff } from "knuth-shuffle";
import {
  Candidates,
  Votes,
  CandidatesResponse,
  VotesResponse
} from "../utils/types";
import { CandidateGrid } from "../components/candidate-grid";
import { Header } from "../components/header";
import theme from "../utils/theme";

const Vote = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidates>([]);
  const [votes, setVotes] = useState<Votes>([]);
  const [votesRemaining, setVotesRemaining] = useState<number>(0);

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

        const {
          candidates
        } = (await candidateResponse.json()) as CandidatesResponse;
        const {
          votes,
          votesRemaining
        } = (await votesResponse.json()) as VotesResponse;
        // Do the knuth shuff
        const shuffledCandidates = knuthShuff(candidates);
        setCandidates(shuffledCandidates);
        setVotes(votes);
        setVotesRemaining(votesRemaining);
      } catch (e) {
        console.error("Error caught while fetching data: ", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Header votesRemaining={votesRemaining} />
      {loading ? (
        <CircularProgress />
      ) : (
        <CandidateGrid
          candidates={candidates}
          votes={votes}
          votesRemaining={votesRemaining}
          setVotes={setVotes}
          setVotesRemaining={setVotesRemaining}
        />
      )}
    </ThemeProvider>
  );
};

export default Vote;
