import { google } from "googleapis";
import { env } from "./env";

export const oAuthClient = new google.auth.OAuth2(
  env.API_CLIENT_ID,
  env.API_CLIENT_SECRET,
  env.API_REDIRECT_URI
);
