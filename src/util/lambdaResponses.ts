import { APIGatewayProxyResultV2 } from 'aws-lambda';

export const successfullReponse: APIGatewayProxyResultV2 = {
  statusCode: 200,
  body: 'Request completed sucessfully',
};
