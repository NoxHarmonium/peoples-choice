import { NowRequest } from "@now/node";
import { makeOAuthClient } from "../../utils/oauth-client";
import {
  OAuth2Client,
  Credentials,
} from "googleapis/node_modules/google-auth-library";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env";
import { admin_directory_v1, google } from "googleapis";
import { apiHandler } from "../../utils/handler";
import { ApiResponse, CandidatesResponse } from "../../utils/types";

/**
 * Gets a list of candidates from the Google Directory
 * @param directoryApi the API client to use to fetch users
 * @param excludedEmails a list of email addresses that indicate users that should be excluded
 */
export const getCandidates = async (
  directoryApi: admin_directory_v1.Admin,
  excludedEmails: readonly string[],
  oAuthClient: OAuth2Client
): Promise<ApiResponse<CandidatesResponse>> => {
  const {
    data: { users },
  } = await directoryApi.users.list({
    auth: oAuthClient,
    domain: env.DIRECTORY_DOMAIN,
    maxResults: 500,
    viewType: "domain_public",
  });
  return {
    statusCode: 200,
    body: {
      candidates: users
        .map(
          ({
            primaryEmail,
            thumbnailPhotoUrl,
            name: { fullName, givenName, familyName },
          }) => ({
            primaryEmail,
            thumbnailPhotoUrl,
            name: {
              fullName,
              givenName,
              familyName,
            },
          })
        )
        .filter((user) => !excludedEmails.includes(user.primaryEmail)),
    },
  };
};

/**
 * API handler for operations on the Candidate resource
 */
export default apiHandler<CandidatesResponse>(async (req: NowRequest) => {
  if (!req.cookies.jwt) {
    return {
      statusCode: 401,
      body: { error: "Unauthorized" },
    };
  }

  const oAuthClient = makeOAuthClient(req);

  oAuthClient.credentials = jwt.verify(
    req.cookies.jwt,
    env.JWT_SECRET
  ) as Credentials;

  const directoryApi = google.admin({
    version: "directory_v1",
  });

  const excludedEmails = env.EXCLUDED_EMAILS.split(",");

  if (req.method === "GET") {
    return getCandidates(directoryApi, excludedEmails, oAuthClient);
  } else {
    return {
      statusCode: 400,
      body: {
        error: `Unsupported method [${req.method}]`,
      },
    };
  }
});
