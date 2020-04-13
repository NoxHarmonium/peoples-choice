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

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140,
    backgroundSize: "contain"
  },
  voted: {
    backgroundColor: "lightblue"
  }
});

export const CandidateCard = ({
  candidate,
  votes,
  setVotes
}: {
  candidate: Candidate;
  votes: Votes;
  setVotes: (votes: Votes) => void;
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

  return (
    <Grid item xs={6} md={2}>
      {// TODO: Does this still happen with reduce motion on?}
      <Grow in={true}>
        <Reward
          ref={ref => {
            setReward(ref);
          }}
          type="emoji"
        >
          <Card className={hasBeenVotedFor ? classes.voted : ""}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={
                  candidate.thumbnailPhotoUrl ?? "/placeholder-portrait.png"
                }
                title={`Portrait of ${candidate.name.fullName}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {candidate.name.fullName}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick={onVote}>
                Vote
              </Button>
              {Array.from({ length: voteCount }, () => (
                <ThumbUpIcon />
              ))}
            </CardActions>
          </Card>
        </Reward>
      </Grow>
    </Grid>
  );
};
