import { NowRequest, NowResponse } from "@now/node";
import { oAuthClient } from "../../utils/oauth-client";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { google } from "googleapis";

export default (req: NowRequest, res: NowResponse) => {
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

  const users = directoryApi.users.list({
    auth: oAuthClient,
    domain: "agiledigital.com.au",
    maxResults: 500,
    viewType: "domain_public"
  });

  return users
    .then(users =>
      res.json({
        candidates: users.data.users
      })
    )
    .catch(error => {
      console.error(error);
      res.status(500).json({});
    });
};
