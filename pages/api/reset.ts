import { NowRequest } from "@now/node";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import jwt from "jsonwebtoken";

import dynamoClient from "../../utils/dynamo-client";
import { env } from "../../utils/env";
import { apiHandler } from "../../utils/handler";
import { makeOAuthClient } from "../../utils/oauth-client";
import { ApiResponse } from "../../utils/types";

/**
 * Gets a list of the votes submitted by all users
 */
const postReset = async (): Promise<ApiResponse<void>> => {
  console.log(`Deleting all user records`);

  const userRecords = await dynamoClient
    .scan({
      TableName: env.DYNAMO_USER_TABLE_NAME,
    })
    .promise();

  if (userRecords.Items === undefined) {
    return;
  }

  await dynamoClient
    .batchWrite({
      RequestItems: {
        [env.DYNAMO_USER_TABLE_NAME]: userRecords.Items.map(({ email }) => ({
          DeleteRequest: {
            Key: {
              email,
            },
          },
        })),
      },
    })
    .promise();

  return {
    statusCode: 202,
  };
};

/**
 * API handler for operations on the Votes resource
 */
export default apiHandler<void>(async (req: NowRequest) => {
  if (!req.cookies.jwt) {
    return {
      statusCode: 401,
      body: { error: "Unauthorized" },
    };
  }

  const oAuthClient = makeOAuthClient(req);

  // eslint-disable-next-line functional/immutable-data
  oAuthClient.credentials = jwt.verify(
    req.cookies.jwt,
    env.JWT_SECRET
  ) as Credentials;

  const decodedIdToken = jwt.decode(oAuthClient.credentials.id_token);
  if (
    decodedIdToken === null ||
    typeof decodedIdToken !== "object" ||
    typeof decodedIdToken.email !== "string"
  ) {
    throw new Error("Invalid ID token");
  }

  const adminEmails = env.ADMIN_EMAILS.split(",");
  if (!adminEmails.includes(decodedIdToken.email)) {
    return {
      statusCode: 403,
      body: { error: "Forbidden" },
    };
  }

  if (req.method === "POST") {
    return postReset();
  } else {
    return {
      statusCode: 400,
      body: {
        error: `Unsupported method [${req.method}]`,
      },
    };
  }
});
