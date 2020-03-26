import { NowRequest, NowResponse } from "@now/node";
import fetch from "isomorphic-unfetch";
import { oAuthClient } from "../../utils/oauth-client";

export default (_: NowRequest, res: NowResponse) => {
  const loginLink = oAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/admin.directory.user.readonly"
  });

  res.setHeader("Location", loginLink);
  return res.status(302).json({});
};
