import { makeStyles } from "@material-ui/core/styles";
import React from "react";

import CustomButton from "./custom-button";
import ProductHeroLayout from "./product-hero-layout";
import Typography from "./typography";

const backgroundImage = "/trophy.jpg";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: "#7fc7d9", // Average color of the background image.
    backgroundPosition: "center",
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
}));

function ProductHero() {
  const classes = useStyles();

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Recognise Your Teammates
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        className={classes.h5}
      >
        Feeling grateful? Want to recognise a colleague?
      </Typography>
      <CustomButton
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button}
        // component="a"
        href="/vote"
      >
        Start Voting!
      </CustomButton>
      <Typography variant="body2" color="inherit" className={classes.more}>
        Use your corporate Google account
      </Typography>
    </ProductHeroLayout>
  );
}

export default ProductHero;
