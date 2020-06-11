import { makeStyles } from "@material-ui/core/styles";
import MuiTypography, { TypographyProps } from "@material-ui/core/Typography";
import React from "react";

import { capitalizeFirstChar } from "../utils/misc";

const useStyles = makeStyles((theme) => ({
  markedH2Center: {
    height: 4,
    width: 73,
    display: "block",
    margin: `${theme.spacing(1)}px auto 0`,
    backgroundColor: theme.palette.secondary.main,
  },
  markedH3Center: {
    height: 4,
    width: 55,
    display: "block",
    margin: `${theme.spacing(1)}px auto 0`,
    backgroundColor: theme.palette.secondary.main,
  },
  markedH4Center: {
    height: 4,
    width: 55,
    display: "block",
    margin: `${theme.spacing(1)}px auto 0`,
    backgroundColor: theme.palette.secondary.main,
  },
  markedH6Left: {
    height: 2,
    width: 28,
    display: "block",
    marginTop: theme.spacing(0.5),
    background: "currentColor",
  },
}));

const variantMapping = {
  h1: "h1",
  h2: "h1",
  h3: "h1",
  h4: "h1",
  h5: "h3",
  h6: "h2",
  subtitle1: "h3",
};

function Typography(
  props: TypographyProps & {
    readonly marked?: "center" | "left";
  }
) {
  const { children, marked, variant, ...other } = props;
  const classes = useStyles();

  return (
    <MuiTypography variantMapping={variantMapping} variant={variant} {...other}>
      {children}
      {marked === undefined ? (
        undefined
      ) : (
        <span
          className={
            // eslint-disable-next-line total-functions/no-array-subscript
            classes[
              `marked${capitalizeFirstChar(variant) +
                capitalizeFirstChar(marked)}`
            ]
          }
        />
      )}
    </MuiTypography>
  );
}

export default Typography;
