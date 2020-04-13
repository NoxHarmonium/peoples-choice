import { env } from "./env";
import { DynamoDB } from "aws-sdk";

const dynamoClient = new DynamoDB.DocumentClient({
  accessKeyId: env.AWS_ACCESS_KEY_ID_,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY_,
  region: env.AWS_REGION_
});

export default dynamoClient;
