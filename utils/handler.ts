import { NowRequest, NowResponse } from "@now/node";
import { ApiResponse } from "./types";
import { JsonValue } from "type-fest";

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
      status: "Internal Server Error"
    });
  }
};
