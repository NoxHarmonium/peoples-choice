import { knuthShuffle } from "knuth-shuffle";
import { concoctCrud } from "sagamatron";

import { checkResponse } from "..";
import { unimplementedError } from "../../utils/errors";
import { CandidatesResponse } from "../../utils/types";

const candidateApi = {
  list: async (): Promise<CandidatesResponse> => {
    const response = await fetch("/api/candidates");

    checkResponse(response);

    // eslint-disable-next-line total-functions/no-unsafe-type-assertion
    const json = await (response.json() as Promise<CandidatesResponse>);

    return {
      ...json,
      // Do the knuff shuff so that no candidate has a favourable position
      candidates: knuthShuffle([...json.candidates]),
    };
  },
  get: unimplementedError,
  create: unimplementedError,
  update: unimplementedError,
  delete: unimplementedError,
};

const {
  actions: {
    list: [listCandidates],
  },
  rootReducer,
  rootSaga,
} = concoctCrud("candidate", "candidates", candidateApi);

export {
  listCandidates,
  rootReducer as candidatesCrudReducer,
  rootSaga as candidatesCrudSagas,
};
