import { NowRequest } from "@now/node";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

import { env } from "../../utils/env";
import { apiHandler } from "../../utils/handler";
import { makeOAuthClient } from "../../utils/oauth-client";

/**
 * Handles the redirect back from Google auth
 */
export default apiHandler(async (req: NowRequest) => {
  if (req.query.error) {
    // The user did not give us permission.
    console.error("Authentication error: ", req.query.error);
    return {
      statusCode: 400,
      body: {
        error: "Bad Request",
      },
    };
  } else {
    if (typeof req.query.code !== "string") {
      console.error("Code is not a single string");
      return {
        statusCode: 400,
        body: {
          error: "Bad Request",
        },
      };
    }

    const oAuthClient = makeOAuthClient(req);
    // eslint-disable-next-line total-functions/no-array-destructuring
    const { tokens } = await oAuthClient.getToken(req.query.code);
    return {
      statusCode: 302,
      headers: {
        Location: "/vote",
        "Set-Cookie": serialize("jwt", jwt.sign(tokens, env.JWT_SECRET)),
      },
    };
  }
});
