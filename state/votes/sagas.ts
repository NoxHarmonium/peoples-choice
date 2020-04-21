import {
  all,
  call,
  put,
  SagaGenerator,
  takeEvery,
  takeLatest,
} from "typed-redux-saga";

import { PerformOptimisticVoteAction } from ".";
import { createVote, deleteVote, listVotes } from "./api";

function* performSyncSaga() {
  yield put({
    type: "UPDATE_DATA",
    payload: {
      loading: true,
    },
  });

  try {
    const response = yield call(listVotes);
    yield put({ type: "UPDATE_DATA", payload: response });
  } catch (e) {
    // TODO: Error handling
    console.error(e);
  } finally {
    yield put({
      type: "UPDATE_DATA",
      payload: {
        loading: false,
      },
    });
  }
}

function* performOptimisticVoteSaga({
  payload: { targetEmail },
}: PerformOptimisticVoteAction) {
  yield put({ type: "ADD_VOTE", payload: { targetEmail } });

  try {
    yield call(createVote, targetEmail);
    yield put({
      type: "UPDATE_DATA",
      payload: { lastSuccessfulVote: targetEmail },
    });
  } catch (e) {
    // TODO: Error handling
    console.error(e);

    //lastSuccessfulVote
    yield put({ type: "REMOVE_VOTE", payload: { targetEmail } });
  }
}

function* undoOptimisticVoteSaga({
  payload: { targetEmail },
}: PerformOptimisticVoteAction) {
  yield put({ type: "REMOVE_VOTE", payload: { targetEmail } });
  try {
    yield call(deleteVote, targetEmail);
  } catch (e) {
    // TODO: Error handling
    console.error(e);
    yield put({ type: "ADD_VOTE", payload: { targetEmail } });
  }
}

export function* votesViewModelSaga(): SagaGenerator<void> {
  yield* all([
    takeLatest("PERFORM_SYNC", performSyncSaga),
    takeEvery("PERFORM_OPTIMISTIC_VOTE", performOptimisticVoteSaga),
    takeEvery("UNDO_OPTIMISTIC_VOTE", undoOptimisticVoteSaga),
  ]);
}
