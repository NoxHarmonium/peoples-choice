import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";

import { candidatesCrudReducer } from "./candidates";
import { votesReducer } from "./votes";

export const rootReducer = combineReducers({
  ...candidatesCrudReducer,
  votes: votesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
