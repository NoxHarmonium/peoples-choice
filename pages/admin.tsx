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

        if (!tallyResponse.ok) {
          throw new Error("One ore more network responses were not ok");
        }

        const { tallyEntries } = (await tallyResponse.json()) as TallyResponse;

        setTally(tallyEntries);
      } catch (e) {
        console.error("Error caught while fetching data: ", e);
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

  return (
    <>
      <Header />
      <div className={classes.mainContent}>
        <h3>Current Tally</h3>
        <ol>
          {tally.map(({ email, rank }, index) => (
            <p key={index}>
              {rank} - {email}
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
      </div>
    </>
  );
};

export default Admin;
