import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Grow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import clsx from "clsx";
import fetch from "isomorphic-unfetch";
import React, { useCallback,useState } from "react";
import Reward from "react-rewards";

import { Candidate, Votes } from "../utils/types";

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
}));

export const CandidateCard = ({
  candidate,
  votes,
  votesRemaining,
  setVotes,
  setVotesRemaining,
  index,
}: {
  readonly candidate: Candidate;
  readonly votes: Votes;
  readonly votesRemaining: number;
  readonly setVotes: (votes: Votes) => void;
  readonly setVotesRemaining: (votesRemaining: number) => void;
  readonly index: number;
}) => {
  const classes = useStyles();
  const [reward, setReward] = useState<
    | undefined
    | {
        readonly rewardMe: () => void;
      }
  >(undefined);
  const [submittingVote, setSubmittingVote] = useState(false);

  const voteCount = votes.filter((v) => v === candidate.primaryEmail).length;
  const hasBeenVotedFor = voteCount > 0;
  const locked = votesRemaining === 0;

  const onVote = useCallback(() => {
    setSubmittingVote(true);
    fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetEmail: candidate.primaryEmail,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        setVotes([...votes, candidate.primaryEmail]);
        setVotesRemaining(votesRemaining - 1);

        if (reward !== undefined) {
          reward.rewardMe();
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setSubmittingVote(false));
  }, [candidate, votes, setVotes, reward, votesRemaining, setVotesRemaining]);

  // TODO: Does the Grow animation still occur with reduce motion on?
  return (
    <Grid item xs={12} md={3} key={index} className={classes.root}>
      <Grow in={true}>
        <Reward
          ref={(ref) => {
            setReward(ref);
          }}
          type="emoji"
        >
          <Card
            className={hasBeenVotedFor ? classes.voted : ""}
            onClick={onVote}
          >
            <CardActionArea
              className={clsx({
                [classes.cardActionArea]: true,
                [classes.disabledActionArea]: locked || submittingVote,
              })}
            >
              <CardMedia
                className={classes.media}
                image={
                  candidate.thumbnailPhotoUrl ?? "/placeholder-portrait.png"
                }
                title={`Portrait of ${candidate.name.fullName}`}
              />
              <CardContent className={classes.content}>
                <Typography variant="h6" style={{ marginBottom: "1rem" }}>
                  {candidate.name.fullName}
                </Typography>
                <Typography>
                  {votesRemaining === 0
                    ? "Thanks for voting"
                    : voteCount > 0
                    ? "Click to Vote again!"
                    : "Click to Vote!"}
                </Typography>
                <div style={{ minHeight: "2rem" }}>
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
      </Grow>
    </Grid>
  );
};
