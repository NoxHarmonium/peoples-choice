import { useEffect, useState } from "react";
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
  Button
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

type Candidate = admin_directory_v1.Schema$User;
type Candidates = ReadonlyArray<Candidate>;
type CanididatesResponse = {
  candidates: Candidates;
};

const Home = () => {
  const [candidates, setCandidates] = useState<Candidates>([]);
  useEffect(() => {
    fetch("/api/candidates")
      .then(resp => resp.json())
      .then(json => setCandidates((json as CanididatesResponse).candidates));
  }, []);

  console.log(candidates);

  return candidates.length > 0 ? (
    candidates.map((candidate, index) => (
      <CandidateCard candidate={candidate} key={index} />
    ))
  ) : (
    <div>
      <h1>Voting</h1>
      <a href="/api/login">Login</a>
    </div>
  );
};

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={candidate.thumbnailPhotoUrl}
          title={`Portrait of ${candidate.name.fullName}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {candidate.name.fullName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {JSON.stringify(candidate.keywords)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default Home;
