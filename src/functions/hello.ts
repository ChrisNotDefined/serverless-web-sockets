import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      body: `WELCOME PERSON!!!`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'An error occured',
    };
  }
};
