import { APIGatewayProxyResultV2 } from 'aws-lambda';

interface ErrorBody {
  message: string;
  error: string;
}

export const successfullReponse: APIGatewayProxyResultV2 = {
  statusCode: 200,
  body: 'Request completed sucessfully',
};

export const buildErrorRespone = (error: Error, msg: string): APIGatewayProxyResultV2 => {
  const errorBody: ErrorBody = {
    error: error.message,
    message: msg,
  };

  return {
    statusCode: 500,
    body: JSON.stringify(errorBody),
  };
};
