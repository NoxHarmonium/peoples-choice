import { NowRequest } from "@now/node";

import dynamoClient from "../../utils/dynamo-client";
import { env } from "../../utils/env";
import { authenticatedApiHandler } from "../../utils/handler";
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
        [env.DYNAMO_USER_TABLE_NAME]: userRecords.Items.map(
          ({ obfusticatedEmail }) => ({
            DeleteRequest: {
              Key: {
                email: obfusticatedEmail,
              },
            },
          })
        ),
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
export default authenticatedApiHandler<void>(
  async (req: NowRequest, userEmail: string) => {
    const adminEmails = env.ADMIN_EMAILS.split(",");
    if (!adminEmails.includes(userEmail)) {
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
  }
);
