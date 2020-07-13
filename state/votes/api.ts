import { checkResponse } from "..";
import { VotesResponse } from "../../utils/types";

const url = "/api/votes";

const listVotes = async (): Promise<VotesResponse> => {
  const response = await fetch(url);

  checkResponse(response);

  // eslint-disable-next-line total-functions/no-unsafe-type-assertion
  return response.json() as Promise<VotesResponse>;
};

const createVote = async (targetEmail: string): Promise<VotesResponse> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetEmail,
    }),
  });

  checkResponse(response);

  // eslint-disable-next-line total-functions/no-unsafe-type-assertion
  return response.json() as Promise<VotesResponse>;
};

const deleteVote = async (targetEmail: string): Promise<VotesResponse> => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetEmail,
    }),
  });

  checkResponse(response);

  // eslint-disable-next-line total-functions/no-unsafe-type-assertion
  return response.json() as Promise<VotesResponse>;
};

const VoteAPI = {
  listVotes,
  createVote,
  deleteVote,
};

export default VoteAPI;
