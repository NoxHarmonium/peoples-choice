import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

import CustomButton from "../components/custom-button";
import { Header } from "../components/header";
import { TallyEntry, TallyResponse } from "../utils/types";

const useStyles = makeStyles((theme) => ({
  mainContent: {
    margin: theme.spacing(14, 4, 4, 4),
  },
  loadingContainer: {
    margin: theme.spacing(20, 4, 4, 4),
    textAlign: "center",
  },
}));

// eslint-disable-next-line sonarjs/cognitive-complexity
const Admin = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [tally, setTally] = useState<ReadonlyArray<TallyEntry>>([]);
  const [error, setError] = useState<string | undefined>();
  const [confirmationOpen, setConfirmationOpen] = useState(false);

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

  const onReset = useCallback(() => {
    setConfirmationOpen(true);
  }, []);

  const onCancel = useCallback(() => {
    setConfirmationOpen(false);
  }, []);

  const onConfirm = useCallback(() => {
    const doReset = async () => {
      const resetResponse = await fetch("/api/reset", {
        method: "POST",
      });
      if (resetResponse.status === 401) {
        console.log("Unauthorized response. Redirecting to login.");
        window.location.replace("/api/login");
        return;
      }

      if (!resetResponse.ok) {
        throw new Error("One ore more network responses were not ok");
      }

      // eslint-disable-next-line no-restricted-globals
      location.reload();
    };
    doReset();
    setConfirmationOpen(false);
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
        onClick={onReset}
      >
        Reset All Votes
      </CustomButton>
    </>
  );

  const ConfirmationDialog = () => (
    <div>
      <Dialog
        open={confirmationOpen}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Reset Tally</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all votes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  return (
    <>
      <ConfirmationDialog />
      <Header />
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.mainContent}>
          {error === undefined ? <MainSection /> : <p>{error}</p>}
        </div>
      )}
    </>
  );
};

export default Admin;
