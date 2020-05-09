import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  // Trailing underscore gets around zeit reserved environment variable
  // https://zeit.co/docs/v2/platform/limits/#reserved-variables
  AWS_ACCESS_KEY_ID_: str(),
  AWS_SECRET_ACCESS_KEY_: str(),
  AWS_REGION_: str(),

  API_CLIENT_ID: str(),
  API_CLIENT_SECRET: str(),
  JWT_SECRET: str(),
  DIRECTORY_DOMAIN: str(),
  EXCLUDED_EMAILS: str(),
  ADMIN_EMAILS: str(),
  DYNAMO_USER_TABLE_NAME: str(),
  MAX_VOTES: num(),
  OBFUSTICATION_PEPPER: str(),
});
