import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { CandidateGrid } from "../components/candidate-grid";
import { Header } from "../components/header";
import { listCandidates, performSync } from "../state";

const Vote = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(performSync());
    dispatch(listCandidates());
  }, [dispatch]);

  return (
    <>
      <Header />
      <CandidateGrid />
    </>
  );
};

export default Vote;
