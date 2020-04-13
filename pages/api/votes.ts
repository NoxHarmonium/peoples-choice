import { NowRequest, NowResponse } from "@now/node";
import { oAuthClient } from "../../utils/oauth-client";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { DynamoDB } from "aws-sdk";
import { ApiResponse, VotesResponse } from "../../utils/types";
import { apiHandler } from "../../utils/handler";

const dynamoDb = new DynamoDB.DocumentClient();

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
  console.log(`Getting user record for: [${email}]`);
  const userRecord = await dynamoDb
    .get({
      TableName: env.DYNAMO_USER_TABLE_NAME,
      Key: {
        email: email
      }
    })
    .promise();

  const totalVotes: number =
    userRecord.Item === undefined ? 0 : userRecord.Item["total_votes"];

  if (totalVotes >= env.MAX_VOTES) {
    return {
      statusCode: 400,
      body: {
        error: `You have already voted the maximum number of times (${env.MAX_VOTES})`
      }
    };
  }

  console.log(`Appending vote for [${targetEmail}] for user [${email}]`);

  const updated = await dynamoDb
    .update({
      TableName: env.DYNAMO_USER_TABLE_NAME,
      Key: {
        email: email
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
        ":vote_target": [targetEmail]
      },
      ReturnValues: "UPDATED_NEW"
    })
    .promise();

  console.log(
    `Updated vote count for [${email}] to [${updated.Attributes.total_votes}]`
  );

  return {
    statusCode: 200,
    body: {
      votesRemaining:
        env.MAX_VOTES - (updated.Attributes.total_votes as number),
      votes: updated.Attributes.vote_targets as string[]
    }
  };
};

/**
 * Gets a list of votes that have been submitted by a user
 * @param email the email of the user to get the votes for
 */
const getVotes = async (email: string): Promise<ApiResponse<VotesResponse>> => {
  console.log(`Getting user record for: [${email}]`);
  const userRecord = await dynamoDb
    .get({
      TableName: env.DYNAMO_USER_TABLE_NAME,
      Key: {
        email: email
      }
    })
    .promise();

  const votes: string[] =
    userRecord.Item === undefined ? [] : userRecord.Item.vote_targets;

  return {
    statusCode: 200,
    body: {
      votesRemaining: env.MAX_VOTES - votes.length,
      votes
    }
  };
};

/**
 * API handler for operations on the Votes resource
 */
export default apiHandler<VotesResponse>(async (req: NowRequest) => {
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

  const targetEmail = req.body.targetEmail;

  const decodedIdToken = jwt.decode(oAuthClient.credentials.id_token);
  if (
    decodedIdToken === null ||
    typeof decodedIdToken !== "object" ||
    typeof decodedIdToken.email !== "string"
  ) {
    throw new Error("Invalid ID token");
  }

  if (req.method === "POST") {
    return performVote(decodedIdToken.email, targetEmail);
  } else if (req.method === "GET") {
    return getVotes(decodedIdToken.email);
  } else {
    return {
      statusCode: 400,
      body: {
        error: `Unsupported method [${req.method}]`
      }
    };
  }
});
