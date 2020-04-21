import { NowRequest } from "@now/node";
import { google } from "googleapis";
import { OAuth2Client } from "googleapis/node_modules/google-auth-library";

import { env } from "./env";

export const makeOAuthClient = (req: NowRequest): OAuth2Client => {
  const referer = req.headers.referer ?? "http://localhost:3000/";
  const scheme = referer.startsWith("https") ? "https" : "http";

  return new google.auth.OAuth2(
    env.API_CLIENT_ID,
    env.API_CLIENT_SECRET,
    `${scheme}://${req.headers.host}/api/token`
  );
};
