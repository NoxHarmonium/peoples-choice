import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { EmojiEvents,HowToReg, HowToVote } from "@material-ui/icons";
import React from "react";

import Button from "./custom-button";
import Typography from "./typography";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.common.white,
    overflow: "hidden"
  },
  container: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(15),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(0, 5)
  },
  title: {
    marginBottom: theme.spacing(14)
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180,
    opacity: 0.7
  },
  button: {
    marginTop: theme.spacing(8)
  },
  icons: {
    fontSize: 70,
    color: theme.palette.common.black,
    margin: theme.spacing(5)
  }
}));

function ProductHowItWorks(props) {
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <img
          src="/curvy-lines.png"
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Typography
          variant="h4"
          marked="center"
          className={classes.title}
          //   component="h2"
        >
          How it works
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>1.</div>
                <HowToVote className={classes.icons} />
                <Typography variant="h5" align="center">
                  You get three votes every voting period
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>2.</div>
                <HowToReg className={classes.icons} />
                <Typography variant="h5" align="center">
                  You can give all three votes to one person or to separate
                  people. Its up to you!
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>3.</div>
                <EmojiEvents className={classes.icons} />
                <Typography variant="h5" align="center">
                  Results will be announced at the company wide meeting
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          className={classes.button}
          //   component="a"
          href="/api/login"
        >
          Get started
        </Button>
      </Container>
    </section>
  );
}

export default ProductHowItWorks;
