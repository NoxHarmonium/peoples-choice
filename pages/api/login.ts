import { NowRequest } from "@now/node";

import { env } from "../../utils/env";
import { apiHandler } from "../../utils/handler";
import { makeOAuthClient } from "../../utils/oauth-client";

/**
 * Redirects the browser to the Google OAuth login screen
 */
// eslint-disable-next-line @typescript-eslint/require-await
export default apiHandler(async (req: NowRequest) => {
  const oAuthClient = makeOAuthClient(req);
  const loginLink = oAuthClient.generateAuthUrl({
    // eslint-disable-next-line @typescript-eslint/camelcase
    access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/admin.directory.user.readonly email",
    hd: env.DIRECTORY_DOMAIN,
    prompt: "consent",
  });

  return {
    statusCode: 302,
    headers: {
      Location: loginLink,
    },
  };
});
