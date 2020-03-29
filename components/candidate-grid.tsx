import { Candidates, Candidate, Votes } from "../utils/types";
import { CandidateCard } from "./candidate-card";
import { Grid } from "@material-ui/core";

export const CandidateGrid = ({
  candidates,
  votes,
  setVotes
}: {
  candidates: Candidates;
  votes: Votes;
  setVotes: (votes: Votes) => void;
}) => (
  <Grid container spacing={3} alignItems="stretch">
    {candidates.map((candidate, index) => (
      <CandidateCard
        candidate={candidate}
        key={index}
        votes={votes}
        setVotes={setVotes}
      />
    ))}
  </Grid>
);
