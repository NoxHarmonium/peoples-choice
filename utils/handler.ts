import { NowRequest, NowResponse } from "@now/node";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { JsonValue } from "type-fest";

import { env } from "./env";
import { makeOAuthClient } from "./oauth-client";
import { obfusticateEmail } from "./obfusticate";
import { ApiResponse } from "./types";

export const apiHandler = <ResponseType = JsonValue>(
  handler: (req: NowRequest) => Promise<ApiResponse<ResponseType>>
) => async (req: NowRequest, res: NowResponse) => {
  try {
    const { statusCode, headers, body } = await handler(req);
    res.status(statusCode);
    if (headers !== undefined) {
      Object.entries(headers).forEach(([key, value]) =>
        res.setHeader(key, value)
      );
    }
    if (body !== undefined) {
      res.json(body);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500);
    console.error("Unhandled error: ", error);
    res.json({
      status: "Internal Server Error",
    });
  }
};

export const authenticatedApiHandler = <ResponseType = JsonValue>(
  handler: (
    req: NowRequest,
    obfusticatedUserId: string
  ) => Promise<ApiResponse<ResponseType>>
) => async (req: NowRequest, res: NowResponse) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({
        error: "Unauthorized",
        detail: "No JWT provided",
      });
    }
    const oAuthClient = makeOAuthClient(req);
    // eslint-disable-next-line functional/immutable-data
    oAuthClient.credentials = jwt.verify(
      req.cookies.jwt,
      env.JWT_SECRET
    ) as Credentials;

    // Every API call from now on will use this auth method
    google.options({
      auth: oAuthClient,
    });

    const decodedIdToken = jwt.decode(oAuthClient.credentials.id_token);
    if (
      decodedIdToken === null ||
      typeof decodedIdToken !== "object" ||
      typeof decodedIdToken.email !== "string"
    ) {
      return res.status(401).json({
        error: "Unauthorized",
        detail: "Invalid ID token",
      });
    }

    const { statusCode, headers, body } = await handler(
      req,
      decodedIdToken.email
    );
    res.status(statusCode);
    if (headers !== undefined) {
      Object.entries(headers).forEach(([key, value]) =>
        res.setHeader(key, value)
      );
    }
    if (body !== undefined) {
      res.json(body);
    } else {
      res.json({});
    }
  } catch (error) {
    console.error("Unhandled error: ", error);
    res.status(500).json({
      status: "Internal Server Error",
    });
  }
};
