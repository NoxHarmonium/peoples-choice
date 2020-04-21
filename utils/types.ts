// eslint-disable-next-line @typescript-eslint/camelcase
import { admin_directory_v1 } from "googleapis";
import { JsonValue } from "type-fest";

export type ApiResponse<ResponseType = JsonValue> = {
  readonly statusCode: number;
  readonly body?: ResponseType | ErrorResponse;
  readonly headers?: Record<string, string>;
};

export type ErrorResponse = {
  readonly error: string;
};

export type Candidate = admin_directory_v1.Schema$User;
export type Candidates = ReadonlyArray<Candidate>;
export type CandidatesResponse = {
  readonly candidates: Candidates;
};

export type Votes = ReadonlyArray<string>;
export type VotesResponse = {
  readonly votes: Votes;
  readonly votesRemaining: number;
};

export type TallyEntry = {
  readonly rank: number;
  readonly emails: ReadonlyArray<string>;
  readonly count: number;
};
export type TallyResponse = {
  readonly tallyEntries: ReadonlyArray<TallyEntry>;
};
