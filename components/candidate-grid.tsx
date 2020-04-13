import { Candidates, Candidate, Votes } from "../utils/types";
import { CandidateCard } from "./candidate-card";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(10, 0, 0, 2),
    padding: theme.spacing(0, 8, 8, 0)
  }
}));

export const CandidateGrid = ({
  candidates,
  votes,
  votesRemaining,
  setVotes,
  setVotesRemaining
}: {
  candidates: Candidates;
  votes: Votes;
  votesRemaining: number;
  setVotes: (votes: Votes) => void;
  setVotesRemaining: (votesRemaining: number) => void;
}) => {
  const styles = useStyles();
  return (
    <Grid container spacing={3} alignItems="stretch" className={styles.root}>
      {candidates.map((candidate, index) => (
        <CandidateCard
          candidate={candidate}
          index={index}
          votes={votes}
          votesRemaining={votesRemaining}
          setVotes={setVotes}
          setVotesRemaining={setVotesRemaining}
          key={index}
        />
      ))}
    </Grid>
  );
};
