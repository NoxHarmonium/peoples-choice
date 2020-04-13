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
import Head from "next/head";

const Vote = () => {
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

        const {
          candidates
        } = (await candidateResponse.json()) as CandidatesResponse;
        const { votes } = (await votesResponse.json()) as VotesResponse;
        // Do the knuth shuff
        const shuffledCandidates = knuthShuff(candidates);
        setCandidates(shuffledCandidates);
        setVotes(votes);
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
      <Head>
        <title>People's Choice Awards :: Voting</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      {loading ? (
        <CircularProgress />
      ) : (
        <CandidateGrid
          candidates={candidates}
          votes={votes}
          setVotes={setVotes}
        />
      )}
    </ThemeProvider>
  );
};

export default Vote;
