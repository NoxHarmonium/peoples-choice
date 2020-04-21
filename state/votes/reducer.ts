import {
  AddVoteAction,
  RemoveVoteAction,
  UpdateDataAction,
  VotesViewModel,
} from ".";

const defaultState: VotesViewModel = {
  votesRemaining: 0,
  votes: [],
  loading: true,
};

export const votesViewModelReducer = (
  state: VotesViewModel = defaultState,
  action: AddVoteAction | RemoveVoteAction | UpdateDataAction
): VotesViewModel => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case "ADD_VOTE":
      return {
        ...state,
        votesRemaining: state.votesRemaining - 1,
        votes: [...state.votes, action.payload.targetEmail],
        lastSuccessfulVote: undefined,
      };
    case "REMOVE_VOTE": {
      const index = state.votes.indexOf(action.payload.targetEmail);
      const newVotes = state.votes.filter((_, i) => i !== index);
      return {
        ...state,
        votesRemaining: state.votesRemaining + 1,
        votes: newVotes,
        lastSuccessfulVote: undefined,
      };
    }
    case "UPDATE_DATA": {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
