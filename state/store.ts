import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";

import { candidatesCrudReducer } from "./candidates";
import { votesViewModelReducer } from "./votes";

export const rootReducer = combineReducers({
  ...candidatesCrudReducer,
  votesViewModel: votesViewModelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
