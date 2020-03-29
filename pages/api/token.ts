import { NowRequest } from "@now/node";
import { env } from "../../utils/env";

import { oAuthClient } from "../../utils/oauth-client";
import { serialize } from "cookie";

import jwt from "jsonwebtoken";
import { apiHandler } from "../../utils/handler";

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
        error: "Bad Request"
      }
    };
  } else {
    if (typeof req.query.code !== "string") {
      console.error("Code is not a single string");
      return {
        statusCode: 400,
        body: {
          error: "Bad Request"
        }
      };
    }

    const { tokens } = await oAuthClient.getToken(req.query.code);
    return {
      statusCode: 302,
      headers: {
        Location: "/",
        "Set-Cookie": serialize("jwt", jwt.sign(tokens, env.JWT_SECRET))
      }
    };
  }
});
