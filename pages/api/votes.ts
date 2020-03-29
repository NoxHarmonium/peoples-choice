import { NowRequest, NowResponse } from "@now/node";
import { oAuthClient } from "../../utils/oauth-client";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { google } from "googleapis";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

const performVote = async (
  email: string,
  targetEmail: string,
  res: NowResponse
) => {
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
    return res.status(400).json({
      error: `You have already voted the maximum number of times (${env.MAX_VOTES})`
    });
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
        ":max_votes": 3,
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

  return res.status(200).json({
    votesRemaining: env.MAX_VOTES - updated.Attributes.total_votes
  });
};

const getVotes = async (email: string, res: NowResponse) => {
  console.log(`Getting user record for: [${email}]`);
  const userRecord = await dynamoDb
    .get({
      TableName: env.DYNAMO_USER_TABLE_NAME,
      Key: {
        email: email
      }
    })
    .promise();

  const votes =
    userRecord.Item === undefined ? [] : userRecord.Item.vote_targets;

  return res.status(200).json({
    votes
  });
};

export default async (req: NowRequest, res: NowResponse) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({ error: "Unauthorized" });
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
    return performVote(decodedIdToken.email, targetEmail, res);
  } else if (req.method === "GET") {
    return getVotes(decodedIdToken.email, res);
  }
};
