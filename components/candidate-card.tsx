import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Reward from "react-rewards";

import {
  performOptimisticVote,
  undoOptimisticVote,
  useTypedSelector,
} from "../state";
import { Candidate } from "../utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: 310,
    marginBottom: 32,
  },
  card: {},
  media: {
    width: 140,
    height: 140,
    backgroundSize: "contain",
    margin: theme.spacing(2),
    borderRadius: "50%",
  },
  voted: {
    backgroundColor: theme.palette.secondary.light,
  },
  cardActionArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  disabledActionArea: {
    pointerEvents: "none",
    "&:hover $focusHighlight": {
      opacity: 0,
    },
  },
  thumbsPanel: {
    minHeight: "2rem",
  },
  nameTitle: {
    marginBottom: "1rem",
  },
}));

export const CandidateCard = ({
  candidate,
  index,
}: {
  readonly candidate: Candidate;
  readonly index: number;
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [reward, setReward] = useState<
    | undefined
    | {
        readonly rewardMe: () => void;
      }
  >(undefined);
  const [undoShown, setUndoShown] = useState(false);
  const {
    loading,
    votes,
    votesRemaining,
    lastSuccessfulVote,
  } = useTypedSelector(({ votes }) => votes);

  const voteCount = votes.filter((v) => v === candidate.primaryEmail).length;

  const hasBeenVotedFor = voteCount > 0;
  const locked = votesRemaining <= 0;
  const votingDisabled = locked || loading;

  useEffect(() => {
    setUndoShown(lastSuccessfulVote === candidate.primaryEmail);
  }, [lastSuccessfulVote, candidate]);

  const onPerformVote = useCallback(() => {
    if (
      reward !== undefined &&
      !window.matchMedia("(prefers-reduced-motion)").matches
    ) {
      reward.rewardMe();
    }

    dispatch(performOptimisticVote(candidate.primaryEmail));
  }, [candidate, reward, dispatch]);

  const onUndoVote = useCallback(() => {
    dispatch(undoOptimisticVote(candidate.primaryEmail));
  }, [candidate, dispatch]);

  const closeUndo = useCallback(() => {
    setUndoShown(false);
  }, [setUndoShown]);

  // TODO: Does the Grow animation still occur with reduce motion on?
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={undoShown}
        autoHideDuration={20000}
        onClose={closeUndo}
        message="Vote Submitted"
        action={
          <>
            <Button color="secondary" size="small" onClick={onUndoVote}>
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeUndo}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
      <Grid item xs={12} md={3} key={index} className={classes.root}>
        <Reward
          ref={(ref) => {
            setReward(ref);
          }}
          type="emoji"
        >
          <Card className={hasBeenVotedFor ? classes.voted : ""}>
            <CardActionArea
              className={classes.cardActionArea}
              disabled={votingDisabled}
              onClick={onPerformVote}
            >
              <CardMedia
                className={classes.media}
                image={
                  candidate.thumbnailPhotoUrl ?? "/placeholder-portrait.png"
                }
                title={`Portrait of ${candidate.name.fullName}`}
              />
              <CardContent className={classes.content}>
                <Typography variant="h6" className={classes.nameTitle}>
                  {candidate.name.fullName}
                </Typography>
                <Typography>
                  {votesRemaining === 0
                    ? "Thanks for voting"
                    : voteCount > 0
                    ? "Click to Vote again!"
                    : "Click to Vote!"}
                </Typography>
                <div className={classes.thumbsPanel}>
                  {Array.from({ length: voteCount }, (_, index) => (
                    <span key={index}>
                      <ThumbUpIcon />
                      {"  "}
                    </span>
                  ))}
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        </Reward>
      </Grid>
    </>
  );
};
