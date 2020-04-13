import { Header } from "../components/header";
import theme from "../utils/theme";
import { makeStyles } from "@material-ui/core";
import { TallyEntry, TallyResponse } from "../utils/types";
import { useState, useEffect, useCallback } from "react";
import CustomButton from "../components/custom-button";

const useStyles = makeStyles(theme => ({
  mainContent: {
    margin: theme.spacing(14, 4, 4, 4)
  }
}));

const Admin = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [tally, setTally] = useState<ReadonlyArray<TallyEntry>>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        const tallyResponse = await fetch("/api/tally");

        if (tallyResponse.status === 401) {
          console.log("Unauthorized response. Redirecting to login.");
          window.location.replace("/api/login");
          return;
        }

        if (tallyResponse.status === 403) {
          throw new Error(
            "Cannot access the admin page if you're not an admin."
          );
        }

        if (!tallyResponse.ok) {
          throw new Error("One ore more network responses were not ok");
        }

        const { tallyEntries } = (await tallyResponse.json()) as TallyResponse;

        setTally(tallyEntries);
      } catch (e) {
        console.error("Error caught while fetching data: ", e);
        setError(e.message ?? "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const resetOnClick = useCallback(() => {
    const doReset = async () => {
      const resetResponse = await fetch("/api/reset", {
        method: "POST"
      });
      if (resetResponse.status === 401) {
        console.log("Unauthorized response. Redirecting to login.");
        window.location.replace("/api/login");
        return;
      }

      if (!resetResponse.ok) {
        throw new Error("One ore more network responses were not ok");
      }

      location.reload();
    };
    doReset();
  }, []);

  const MainSection = () => (
    <>
      <h3>Current Tally</h3>
      <ol>
        {tally.map(({ emails, rank, count }, index) => (
          <p key={index}>
            {rank}: ({count} votes) - {emails.join(", ")}
          </p>
        ))}
      </ol>
      <CustomButton
        color="secondary"
        variant="contained"
        size="large"
        onClick={resetOnClick}
      >
        Reset All Votes
      </CustomButton>
    </>
  );

  return (
    <>
      <Header />
      <div className={classes.mainContent}>
        {error === undefined ? <MainSection /> : <p>{error}</p>}
      </div>
    </>
  );
};

export default Admin;
