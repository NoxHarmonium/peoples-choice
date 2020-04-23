import {
  all,
  call,
  put,
  SagaGenerator,
  takeEvery,
  takeLatest,
} from "typed-redux-saga";

import { VotesResponse } from "../../utils/types";
import { addVote, PerformOptimisticVoteAction, updateData } from ".";
import { removeVote } from "./actions";
import VoteAPI from "./api";

function* performSyncSaga() {
  yield put(
    updateData({
      loading: true,
    })
  );

  try {
    const response: VotesResponse = yield call(VoteAPI.listVotes);
    yield put(updateData(response));
  } catch (e) {
    console.error(e);
    yield put(
      updateData({
        error: e,
      })
    );
  } finally {
    yield put(
      updateData({
        loading: false,
      })
    );
  }
}

function* performOptimisticVoteSaga({
  payload: { targetEmail },
}: PerformOptimisticVoteAction) {
  yield put(addVote(targetEmail));

  try {
    yield call(VoteAPI.createVote, targetEmail);
    yield put(updateData({ lastSuccessfulVote: targetEmail }));
  } catch (e) {
    console.error(e);
    yield put(
      updateData({
        error: e,
      })
    );
    yield put(removeVote(targetEmail));
  }
}

function* undoOptimisticVoteSaga({
  payload: { targetEmail },
}: PerformOptimisticVoteAction) {
  yield put(removeVote(targetEmail));
  try {
    yield call(VoteAPI.deleteVote, targetEmail);
  } catch (e) {
    console.error(e);
    yield put(
      updateData({
        error: e,
      })
    );
    yield put(addVote(targetEmail));
  }
}

export function* votesViewModelSaga(): SagaGenerator<void> {
  yield* all([
    // We only want the latest version of the data from the server, so discard older results
    takeLatest("PERFORM_SYNC", performSyncSaga),
    // Adding/removing a vote is an associative operation so we don't care what order they happen in
    takeEvery("PERFORM_OPTIMISTIC_VOTE", performOptimisticVoteSaga),
    takeEvery("UNDO_OPTIMISTIC_VOTE", undoOptimisticVoteSaga),
  ]);
}
