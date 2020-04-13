import { cleanEnv, str, url, num } from "envalid";

export const env = cleanEnv(process.env, {
  API_CLIENT_ID: str(),
  API_CLIENT_SECRET: str(),
  API_REDIRECT_URI: url(),
  JWT_SECRET: str(),
  DIRECTORY_DOMAIN: str(),
  EXCLUDED_EMAILS: str(),
  DYNAMO_USER_TABLE_NAME: str(),
  MAX_VOTES: num(),
  WORKPLACE_NAME: str()
});
