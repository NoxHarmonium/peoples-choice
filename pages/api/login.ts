import { oAuthClient } from "../../utils/oauth-client";
import { apiHandler } from "../../utils/handler";

/**
 * Redirects the browser to the Google OAuth login screen
 */
export default apiHandler(async () => {
  const loginLink = oAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/admin.directory.user.readonly email"
  });

  return {
    statusCode: 302,
    headers: {
      Location: loginLink
    }
  };
});
