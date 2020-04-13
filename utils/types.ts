import { JsonValue } from "type-fest";
import { admin_directory_v1 } from "googleapis";

export type ApiResponse<ResponseType = JsonValue> = {
  readonly statusCode: number;
  readonly body?: ResponseType | ErrorResponse;
  readonly headers?: Record<string, string>;
};

export type ErrorResponse = {
  error: string;
};

export type Candidate = admin_directory_v1.Schema$User;
export type Candidates = Array<Candidate>;
export type CandidatesResponse = {
  candidates: Candidates;
};

export type Votes = ReadonlyArray<string>;
export type VotesResponse = {
  votes: Votes;
  votesRemaining: number;
};

export type TallyEntry = {
  rank: number;
  emails: ReadonlyArray<string>;
  count: number;
};
export type TallyResponse = {
  tallyEntries: ReadonlyArray<TallyEntry>;
};
