import { NowRequest } from "@now/node";

import dynamoClient from "../../utils/dynamo-client";
import { env } from "../../utils/env";
import { authenticatedApiHandler } from "../../utils/handler";
import { obfusticateEmail } from "../../utils/obfusticate";
import { ApiResponse, VotesResponse } from "../../utils/types";

/**
 * Submits a vote
 *
 * @param email the email of the user submitting the vote
 * @param targetEmail the email of the user the vote is for
 */
const performVote = async (
  email: string,
  targetEmail: string
): Promise<ApiResponse<VotesResponse>> => {
  const obfusticatedEmail = obfusticateEmail(email);

  console.log(`Getting user record for: [${obfusticatedEmail}]`);

  const userRecord = await dynamoClient
    .get({
      TableName: env.DYNAMO_USER_TABLE_NAME,
      Key: {
        email: obfusticatedEmail,
      },
    })
    .promise();

  const totalVotes: number =
    userRecord.Item === undefined ? 0 : userRecord.Item["total_votes"];

  if (totalVotes >= env.MAX_VOTES) {
    return {
      statusCode: 400,
      body: {
        error: `You have already voted the maximum number of times (${env.MAX_VOTES})`,
      },
    };
  }

  console.log(
    `Appending vote for [${targetEmail}] for user [${obfusticatedEmail}]`
  );

  const updated = await dynamoClient
    .update({
      TableName: env.DYNAMO_USER_TABLE_NAME,
      Key: {
        email: obfusticatedEmail,
      },
      UpdateExpression: `set total_votes = if_not_exists(total_votes, :default_votes) + :vote_increment,
                             vote_targets = list_append(if_not_exists(vote_targets, :default_vote_targets), :vote_target)`,
      ConditionExpression:
        "attribute_not_exists(total_votes) or total_votes <= :max_votes",
      ExpressionAttributeValues: {
        ":default_votes": 0,
        ":max_votes": env.MAX_VOTES,
        ":default_vote_targets": [],
        ":vote_increment": 1,
        ":vote_target": [targetEmail],
      },
      ReturnValues: "UPDATED_NEW",
    })
    .promise();

  console.log(
    `Updated vote count for [${obfusticatedEmail}] to [${updated.Attributes.total_votes}]`
  );

  return {
    statusCode: 200,
    body: {
      votesRemaining:
        env.MAX_VOTES - (updated.Attributes.total_votes as number),
      votes: updated.Attributes.vote_targets as readonly string[],
    },
  };
};

/**
 * Gets a list of votes that have been submitted by a user
 * @param email the email of the user to get the votes for
 */
const getVotes = async (email: string): Promise<ApiResponse<VotesResponse>> => {
  const obfusticatedEmail = obfusticateEmail(email);

  console.log(`Getting user record for: [${obfusticatedEmail}]`);
  const userRecord = await dynamoClient
    .get({
      TableName: env.DYNAMO_USER_TABLE_NAME,
      Key: {
        email: obfusticatedEmail,
      },
    })
    .promise();

  const votes: readonly string[] =
    userRecord.Item === undefined ? [] : userRecord.Item.vote_targets;

  return {
    statusCode: 200,
    body: {
      votesRemaining: env.MAX_VOTES - votes.length,
      votes,
    },
  };
};

/**
 * API handler for operations on the Votes resource
 */
export default authenticatedApiHandler<VotesResponse>(
  async (req: NowRequest, userEmail: string) => {
    if (req.method === "POST") {
      const targetEmail = req.body.targetEmail;

      if (typeof targetEmail !== "string") {
        return {
          statusCode: 400,
          body: {
            error: `Expected 'targetEmail' string param in body`,
          },
        };
      }

      return performVote(userEmail, targetEmail);
    } else if (req.method === "GET") {
      return getVotes(userEmail);
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
