import { NowRequest } from "@now/node";
// eslint-disable-next-line @typescript-eslint/camelcase
import { admin_directory_v1, google } from "googleapis";

import { env } from "../../utils/env";
import { authenticatedApiHandler } from "../../utils/handler";
import { ApiResponse, CandidatesResponse } from "../../utils/types";

/**
 * Gets a list of candidates from the Google Directory
 * @param directoryApi the API client to use to fetch users
 * @param excludedEmails a list of email addresses that indicate users that should be excluded
 */
export const getCandidates = async (
  // eslint-disable-next-line @typescript-eslint/camelcase
  directoryApi: admin_directory_v1.Admin,
  excludedEmails: readonly string[]
): Promise<ApiResponse<CandidatesResponse>> => {
  const {
    data: { users },
  } = await directoryApi.users.list({
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
export default authenticatedApiHandler<CandidatesResponse>(
  async (req: NowRequest) => {
    const directoryApi = google.admin({
      version: "directory_v1",
    });

    const excludedEmails = env.EXCLUDED_EMAILS.split(",");

    if (req.method === "GET") {
      return getCandidates(directoryApi, excludedEmails);
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
