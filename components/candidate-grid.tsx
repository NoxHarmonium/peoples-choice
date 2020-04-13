import { Candidates, Candidate, Votes } from "../utils/types";
import { CandidateCard } from "./candidate-card";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 0, 0, 2),
    padding: theme.spacing(0, 8, 8, 0)
  }
}));

export const CandidateGrid = ({
  candidates,
  votes,
  setVotes
}: {
  candidates: Candidates;
  votes: Votes;
  setVotes: (votes: Votes) => void;
}) => {
  const styles = useStyles();
  return (
    <Grid container spacing={3} alignItems="stretch" className={styles.root}>
      {candidates.map((candidate, index) => (
        <CandidateCard
          candidate={candidate}
          index={index}
          votes={votes}
          setVotes={setVotes}
          key={index}
        />
      ))}
    </Grid>
  );
};
