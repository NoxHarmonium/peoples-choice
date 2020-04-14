import { google } from "googleapis";
import { env } from "./env";
import { NowRequest } from "@now/node";
import { OAuth2Client } from "googleapis/node_modules/google-auth-library";

export const makeOAuthClient = (req: NowRequest): OAuth2Client => {
  const scheme = req.headers.referer.startsWith("https") ? "https" : "http";

  return new google.auth.OAuth2(
    env.API_CLIENT_ID,
    env.API_CLIENT_SECRET,
    `${scheme}://${req.headers.host}/api/token`
  );
};
