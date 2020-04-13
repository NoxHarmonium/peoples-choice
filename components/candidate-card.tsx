import { useState, useCallback } from "react";
import fetch from "isomorphic-unfetch";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Grow
} from "@material-ui/core";
import Reward from "react-rewards";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { Candidate, Votes } from "../utils/types";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    height: 310,
    marginBottom: 32
  },
  card: {},
  media: {
    width: 140,
    height: 140,
    backgroundSize: "contain",
    margin: theme.spacing(2),
    borderRadius: "50%"
  },
  voted: {
    backgroundColor: theme.palette.secondary.light
  },
  cardActionArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  disabledActionArea: {
    pointerEvents: "none",
    "&:hover $focusHighlight": {
      opacity: 0
    }
  }
}));

export const CandidateCard = ({
  candidate,
  votes,
  votesRemaining,
  setVotes,
  setVotesRemaining,
  index
}: {
  candidate: Candidate;
  votes: Votes;
  votesRemaining: number;
  setVotes: (votes: Votes) => void;
  setVotesRemaining: (votesRemaining: number) => void;
  index: number;
}) => {
  const classes = useStyles();
  const [reward, setReward] = useState<undefined | any>(undefined);

  const voteCount = votes.filter(v => v === candidate.primaryEmail).length;
  const hasBeenVotedFor = voteCount > 0;
  const locked = votesRemaining === 0;

  const onVote = useCallback(() => {
    fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        targetEmail: candidate.primaryEmail
      })
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        setVotes([...votes, candidate.primaryEmail]);
        setVotesRemaining(votesRemaining - 1);

        if (reward !== undefined) {
          reward.rewardMe();
        }
      })
      .catch(err => console.error(err));
  }, [candidate, votes, setVotes, reward, votesRemaining, setVotesRemaining]);

  // TODO: Does the Grow animation still occur with reduce motion on?
  return (
    <Grid item xs={12} md={3} key={index} className={classes.root}>
      <Grow in={true}>
        <Reward
          ref={ref => {
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
                [classes.disabledActionArea]: locked
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
