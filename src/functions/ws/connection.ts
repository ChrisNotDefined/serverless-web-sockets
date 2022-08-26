import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
} from 'aws-lambda';
import * as log from 'lambda-log';
import { buildErrorResponse, successfullReponse } from '@src/util/lambdaResponses';
import { addConnection, deleteConnection } from '@src/connections/dynamoClient';
import { sendWSConnected } from '@src/connections/wsSender';

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2,
  context: APIGatewayEventWebsocketRequestContextV2,
  callback: APIGatewayProxyCallbackV2
) => {
  const requestEventType = event.requestContext.eventType;
  log.debug('@@@ Event body', { event });

  if (requestEventType === 'CONNECT') {
    // Handle connection
    const response = await onConnected(event);
    callback(null, response);
  } else if (requestEventType === 'DISCONNECT') {
    // Handle disconnection
    const response = await onDisconnected(event);
    callback(null, response);
  }
};

const onConnected = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    log.debug('@@@ OnConnected');
    await addConnection(event.requestContext.connectionId);
    // You cant send messages before the connection endpoint has responded
    // TODO: Implement Dynamo Event or SQS Execution Queue
    // await sendWSConnected(event);
    return successfullReponse;
  } catch (error) {
    log.error(error as Error, { msg: '@ Connect error' });
    return buildErrorResponse(error as Error, 'Failed to connect to server');
  }
};

const onDisconnected = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    log.debug('@@@ OnDissconnected');
    const { connectionId } = event.requestContext;
    await deleteConnection(connectionId);
    return successfullReponse;
  } catch (error) {
    log.error(error as Error, { msg: '@ Disconnect error' });
    return buildErrorResponse(error as Error, 'Error when failing to disconnect to server');
  }
};
