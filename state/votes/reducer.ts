import { VoteAction, VotesState } from ".";

const defaultState: VotesState = {
  votesRemaining: 0,
  votes: [],
  loading: true,
};

export const votesReducer = (
  state: VotesState = defaultState,
  action: VoteAction
): VotesState => {
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
