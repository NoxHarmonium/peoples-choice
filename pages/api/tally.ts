import { NowRequest } from "@now/node";
import { countBy, sortBy, toPairs, update } from "lodash";

import dynamoClient from "../../utils/dynamo-client";
import { env } from "../../utils/env";
import { authenticatedApiHandler } from "../../utils/handler";
import { ApiResponse, TallyResponse } from "../../utils/types";

/**
 * Gets a list of the votes submitted by all users
 */
const getTally = async (): Promise<ApiResponse<TallyResponse>> => {
  console.log(`Getting user records`);
  const userRecords = await dynamoClient
    .scan({
      TableName: env.DYNAMO_USER_TABLE_NAME,
    })
    .promise();

  const votes: readonly string[] =
    userRecords.Items === undefined
      ? []
      : userRecords.Items.flatMap((item) => item.vote_targets);

  // Future work: Find an Object.entries that supports number keys
  const voteTuples = Object.entries(countBy(votes));
  const groupedVotes = voteTuples.reduce<Record<number, ReadonlyArray<string>>>(
    (prev, [email, count]) =>
      update(prev, count, (emails?: readonly string[]) => [
        ...(emails ?? []),
        email,
      ]),
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
        emails,
      })),
    },
  };
};

/**
 * API handler for operations on the Votes resource
 */
export default authenticatedApiHandler<TallyResponse>(
  async (req: NowRequest, userEmail: string) => {
    const adminEmails = env.ADMIN_EMAILS.split(",");
    if (!adminEmails.includes(userEmail)) {
      return {
        statusCode: 403,
        body: { error: "Forbidden" },
      };
    }

    if (req.method === "GET") {
      return getTally();
    } else {
      return {
        statusCode: 400,
        body: {
          error: `Unsupported method [${req.method}]`,
        },
      };
    }
  }
);
