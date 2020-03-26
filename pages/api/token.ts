import { NowRequest, NowResponse } from "@now/node";
import { env } from "../../utils/env";

import { oAuthClient } from "../../utils/oauth-client";
import { serialize } from "cookie";

import jwt from "jsonwebtoken";

export default (req: NowRequest, res: NowResponse) => {
  if (req.query.error) {
    // The user did not give us permission.
    console.error(req.query.error);
    return res.status(400).json({
      error: "Bad Request"
    });
  } else {
    if (typeof req.query.code !== "string") {
      console.error("Code is not a single string");
      return res.status(400).json({
        error: "Bad Request"
      });
    }

    oAuthClient.getToken(req.query.code, function(error, token) {
      if (error) {
        console.error(error);
        return res.status(500).json({});
      }

      res.setHeader("Location", "/");
      res.setHeader(
        "Set-Cookie",
        serialize("jwt", jwt.sign(token, env.JWT_SECRET))
      );
      return res.status(302).json({});
    });
  }
};
