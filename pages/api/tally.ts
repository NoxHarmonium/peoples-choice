import { NowRequest, NowResponse } from "@now/node";
import { oAuthClient } from "../../utils/oauth-client";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { DynamoDB } from "aws-sdk";
import { ApiResponse, VotesResponse, TallyResponse } from "../../utils/types";
import { apiHandler } from "../../utils/handler";
import { countBy, toPairs, sortBy, update } from "lodash";

const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Gets a list of the votes submitted by all users
 */
const getTally = async (): Promise<ApiResponse<TallyResponse>> => {
  console.log(`Getting user records`);
  const userRecords = await dynamoDb
    .scan({
      TableName: env.DYNAMO_USER_TABLE_NAME
    })
    .promise();

  const votes: string[] =
    userRecords.Items === undefined
      ? []
      : userRecords.Items.flatMap(item => item.vote_targets);

  // Future work: Find an Object.entries that supports number keys
  const voteTuples = Object.entries(countBy(votes));
  const groupedVotes = voteTuples.reduce<Record<number, ReadonlyArray<string>>>(
    (prev, [email, count]) =>
      update(prev, count, (emails?: string[]) => [...(emails ?? []), email]),
    {}
  );
  const rankedVotes = sortBy(toPairs(groupedVotes), ([count, _]) => -count);

  return {
    statusCode: 200,
    body: {
      tallyEntries: rankedVotes.map(([count, emails], index) => ({
        rank: index + 1,
        // 🙄
        count: parseInt(count, 10),
        emails
      }))
    }
  };
};

/**
 * API handler for operations on the Votes resource
 */
export default apiHandler<TallyResponse>(async (req: NowRequest) => {
  if (!req.cookies.jwt) {
    return {
      statusCode: 401,
      body: { error: "Unauthorized" }
    };
  }

  oAuthClient.credentials = jwt.verify(
    req.cookies.jwt,
    env.JWT_SECRET
  ) as Credentials;

  if (req.method === "GET") {
    return getTally();
  } else {
    return {
      statusCode: 400,
      body: {
        error: `Unsupported method [${req.method}]`
      }
    };
  }
});
