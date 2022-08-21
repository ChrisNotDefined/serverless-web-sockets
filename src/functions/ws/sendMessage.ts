import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyWebsocketEventV2,
} from 'aws-lambda';
import { successfullReponse } from '@src/util/lambdaResponses';
import { sendMessageToAllConnected } from '@src/connections/dynamoClient';

export const handler = (
  event: APIGatewayProxyWebsocketEventV2,
  context: APIGatewayEventWebsocketRequestContextV2,
  callback: APIGatewayProxyCallbackV2
) => {
  sendMessageToAllConnected(event)
    .then(() => {
      callback(null, successfullReponse);
    })
    .catch((err) => {
      callback(null, JSON.stringify(err));
    });
};
