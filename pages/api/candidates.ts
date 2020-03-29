import { NowRequest, NowResponse } from "@now/node";
import { oAuthClient } from "../../utils/oauth-client";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { google } from "googleapis";

export default async (req: NowRequest, res: NowResponse) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  oAuthClient.credentials = jwt.verify(
    req.cookies.jwt,
    env.JWT_SECRET
  ) as Credentials;

  const directoryApi = google.admin({
    version: "directory_v1"
  });

  const excludedEmails = env.EXCLUDED_EMAILS.split(",");

  try {
    const {
      data: { users }
    } = await directoryApi.users.list({
      auth: oAuthClient,
      domain: env.DIRECTORY_DOMAIN,
      maxResults: 500,
      viewType: "domain_public"
    });
    res.json({
      candidates: users
        .map(({ primaryEmail, thumbnailPhotoUrl, name }) => ({
          primaryEmail,
          thumbnailPhotoUrl,
          name
        }))
        .filter(user => !excludedEmails.includes(user.primaryEmail))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
};
