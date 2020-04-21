import { checkResponse } from "..";
import { VotesResponse } from "../../utils/types";

const url = "/api/votes";

export const listVotes = async (): Promise<VotesResponse> => {
  const response = await fetch(url);

  checkResponse(response);

  return response.json() as Promise<VotesResponse>;
};

export const createVote = async (
  targetEmail: string
): Promise<VotesResponse> => {
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

  return response.json() as Promise<VotesResponse>;
};

export const deleteVote = async (
  targetEmail: string
): Promise<VotesResponse> => {
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

  return response.json() as Promise<VotesResponse>;
};
