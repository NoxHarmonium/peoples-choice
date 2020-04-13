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

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    height: 310
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
  }
}));

export const CandidateCard = ({
  candidate,
  votes,
  setVotes,
  index
}: {
  candidate: Candidate;
  votes: Votes;
  setVotes: (votes: Votes) => void;
  index: number;
}) => {
  const classes = useStyles();
  const [reward, setReward] = useState<undefined | any>(undefined);

  const voteCount = votes.filter(v => v === candidate.primaryEmail).length;
  const hasBeenVotedFor = voteCount > 0;

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

        if (reward !== undefined) {
          reward.rewardMe();
        }
      })
      .catch(err => console.error(err));
  }, [candidate, votes, setVotes, reward]);

  // TODO: Does the Grow animation still occur with reduce motion on?
  return (
    <Grid item xs={12} md={2} key={index} className={classes.root}>
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
            <CardActionArea className={classes.cardActionArea}>
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
                  {voteCount > 0 ? "Click to Vote again!" : "Click to Vote!"}
                </Typography>
                <Typography>
                  <div style={{ minHeight: "2rem" }}>
                    {Array.from({ length: voteCount }, (_, index) => (
                      <span key={index}>
                        <ThumbUpIcon />
                        {"  "}
                      </span>
                    ))}
                  </div>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Reward>
      </Grow>
    </Grid>
  );
};
