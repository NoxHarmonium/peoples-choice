import { cleanEnv, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  API_CLIENT_ID: str(),
  API_CLIENT_SECRET: str(),
  API_REDIRECT_URI: url(),
  JWT_SECRET: str()
});
