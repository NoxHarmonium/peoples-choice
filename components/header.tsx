import { AppBar, Toolbar, makeStyles } from "@material-ui/core";
import Typography from "./typography";

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 24,
    color: theme.palette.common.white
  },
  toolbar: {
    justifyContent: "space-between",
    height: 64,
    [theme.breakpoints.up("sm")]: {
      height: 70
    }
  },
  left: {
    flex: 1
  },
  leftLinkActive: {
    color: theme.palette.common.white
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3)
  },
  linkSecondary: {
    color: theme.palette.secondary.main
  },
  root: {
    color: theme.palette.common.white
  }
}));

export const Header = ({ votesRemaining }: { votesRemaining?: number }) => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" elevation={0} className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.left} />
        <Typography variant="h6" className={classes.title}>
          People's Choice Awards
        </Typography>
        <div className={classes.right}>
          {votesRemaining === undefined
            ? undefined
            : `${votesRemaining} Votes Remaining`}
        </div>
      </Toolbar>
    </AppBar>
  );
};
