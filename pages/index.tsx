import { useEffect, useState, useCallback } from "react";
import fetch from "isomorphic-unfetch";
import { makeStyles } from "@material-ui/core/styles";
import { admin_directory_v1 } from "googleapis/build/src/apis/admin/directory_v1";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid
} from "@material-ui/core";
import { knuthShuffle } from "knuth-shuffle";
import Reward from "react-rewards";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

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

type Candidate = admin_directory_v1.Schema$User;
type Candidates = Array<Candidate>;
type CandidatesResponse = {
  candidates: Candidates;
};

type Votes = ReadonlyArray<string>;
type VotesResponse = {
  votes: Votes;
};

const Home = () => {
  const [candidates, setCandidates] = useState<Candidates>([]);
  const [votes, setVotes] = useState<Votes>([]);

  useEffect(() => {
    fetch("/api/candidates")
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return resp.json();
      })
      .then(json =>
        setCandidates(knuthShuffle((json as CandidatesResponse).candidates))
      )
      .catch(err => console.error(err));
    fetch("/api/votes")
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return resp.json();
      })
      .then(json => setVotes((json as VotesResponse).votes))
      .catch(err => console.error(err));
  }, []);

  return (
    <Grid container spacing={3} alignItems="stretch">
      {candidates.length > 0 ? (
        candidates.map((candidate, index) => (
          <CandidateCard
            candidate={candidate}
            key={index}
            votes={votes}
            setVotes={setVotes}
          />
        ))
      ) : (
        <div>
          <h1>Voting</h1>
          <a href="/api/login">Login</a>
        </div>
      )}
    </Grid>
  );
};

const CandidateCard = ({
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
              image={candidate.thumbnailPhotoUrl}
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
    </Grid>
  );
};

export default Home;
