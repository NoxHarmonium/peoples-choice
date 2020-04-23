import { AppBar, Link, makeStyles, Toolbar } from "@material-ui/core";
import React from "react";

import { useTypedSelector } from "../state/store";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  toolbar: {
    justifyContent: "space-between",
    height: 64,
    [theme.breakpoints.up("sm")]: {
      height: 70,
    },
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
  root: {
    color: theme.palette.common.white,
  },
}));

export const Header = () => {
  const classes = useStyles();
  const { loading, votesRemaining } = useTypedSelector(({ votes }) => votes);

  return (
    <AppBar position="fixed" elevation={0} className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.left} />
        <Link variant="h6" className={classes.title} href="/">
          People's Choice Awards
        </Link>
        <div className={classes.right}>
          {loading ? undefined : `${votesRemaining} Votes Remaining`}
        </div>
      </Toolbar>
    </AppBar>
  );
};
