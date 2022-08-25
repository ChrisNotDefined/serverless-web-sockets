import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyWebsocketEventV2,
} from 'aws-lambda';
import { successfullReponse } from '@src/util/lambdaResponses';
import { addConnection, deleteConnection } from '@src/connections/dynamoClient';
import { sendWSConnected } from '@src/connections/wsSender';

export const handler = (
  event: APIGatewayProxyWebsocketEventV2,
  context: APIGatewayEventWebsocketRequestContextV2,
  callback: APIGatewayProxyCallbackV2
) => {
  const requestEventType = event.requestContext.eventType;
  console.log(requestEventType);

  if (requestEventType === 'CONNECT') {
    // Handle connection
    addConnection(event.requestContext.connectionId)
      .then(() => {
        onConnected(event);
        callback(null, successfullReponse);
      })
      .catch((err) => {
        callback(null, JSON.stringify(err));
      });
  } else if (requestEventType === 'DISCONNECT') {
    // Handle disconnection
    deleteConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullReponse);
      })
      .catch((err) => {
        console.log(err);
        callback(null, {
          statusCode: 500,
          body: 'Failed to connect: ' + JSON.stringify(err),
        });
      });
  }
};

const onConnected = (event: APIGatewayProxyWebsocketEventV2) => {
  console.log('sendOnConnected');
  sendWSConnected(event);
};
