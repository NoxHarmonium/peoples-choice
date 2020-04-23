import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    margin: theme.spacing(20, 4, 4, 4),
    textAlign: "center",
  },
  errorText: {
    color: theme.palette.error.main,
  },
}));

export const ErrorComponent = ({ error }: { readonly error: Error }) => {
  const classes = useStyles();
  return (
    <div className={classes.errorContainer}>
      <h1>An Error Occurred</h1>
      <p>Please try again later</p>
      <p className={classes.errorText}>{error.message}</p>
    </div>
  );
};
