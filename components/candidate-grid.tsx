import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

import { useTypedSelector } from "../state";
import { CandidateCard } from "./candidate-card";
import { ErrorComponent } from "./error";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(10, 0, 0, 2),
    padding: theme.spacing(0, 8, 8, 0),
  },
  loadingContainer: {
    margin: theme.spacing(20, 4, 4, 4),
    textAlign: "center",
  },
}));

export const CandidateGrid = () => {
  const classes = useStyles();

  const candidates = useTypedSelector(({ candidates }) => candidates.list);

  if (candidates.loading || candidates.result === undefined) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (candidates.error) {
    return <ErrorComponent error={candidates.error}></ErrorComponent>;
  }

  return (
    <Grid container spacing={3} alignItems="stretch" className={classes.root}>
      {candidates.result.candidates.map((candidate, index) => (
        <CandidateCard candidate={candidate} index={index} key={index} />
      ))}
    </Grid>
  );
};
