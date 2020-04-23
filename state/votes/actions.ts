import { FluxStandardAction } from "flux-standard-action";

export type VotesState = {
  readonly votesRemaining: number;
  readonly votes: ReadonlyArray<string>;
  readonly loading: boolean;
  readonly lastSuccessfulVote?: string;
  readonly error?: Error;
};

export type VotesActionTypes =
  | "ADD_VOTE"
  | "REMOVE_VOTE"
  | "UPDATE_DATA"
  | "PERFORM_SYNC"
  | "PERFORM_OPTIMISTIC_VOTE";

export type AddVoteAction = FluxStandardAction<
  "ADD_VOTE",
  {
    readonly targetEmail: string;
  }
>;

export type RemoveVoteAction = FluxStandardAction<
  "REMOVE_VOTE",
  {
    readonly targetEmail: string;
  }
>;

export type UpdateDataAction = FluxStandardAction<
  "UPDATE_DATA",
  Partial<VotesState>
>;

export type PerformSyncAction = FluxStandardAction<"PERFORM_SYNC", {}>;

export type PerformOptimisticVoteAction = FluxStandardAction<
  "PERFORM_OPTIMISTIC_VOTE",
  {
    readonly targetEmail: string;
  }
>;

export type UndoOptimisticVoteAction = FluxStandardAction<
  "UNDO_OPTIMISTIC_VOTE",
  {
    readonly targetEmail: string;
  }
>;

export type VoteAction =
  | AddVoteAction
  | RemoveVoteAction
  | UpdateDataAction
  | PerformSyncAction
  | PerformOptimisticVoteAction
  | UndoOptimisticVoteAction;

export const addVote = (targetEmail: string): AddVoteAction => ({
  type: "ADD_VOTE",
  payload: {
    targetEmail,
  },
});

export const removeVote = (targetEmail: string): RemoveVoteAction => ({
  type: "REMOVE_VOTE",
  payload: {
    targetEmail,
  },
});

export const updateData = (
  partialState: Partial<VotesState>
): UpdateDataAction => ({
  type: "UPDATE_DATA",
  payload: partialState,
});

export const performSync = (): PerformSyncAction => ({
  type: "PERFORM_SYNC",
});

export const performOptimisticVote = (
  targetEmail: string
): PerformOptimisticVoteAction => ({
  type: "PERFORM_OPTIMISTIC_VOTE",
  payload: {
    targetEmail,
  },
});

export const undoOptimisticVote = (
  targetEmail: string
): UndoOptimisticVoteAction => ({
  type: "UNDO_OPTIMISTIC_VOTE",
  payload: {
    targetEmail,
  },
});
