import { APIGatewayEventWebsocketRequestContextV2, APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import * as log from 'lambda-log';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { PostToConnectionRequest } from 'aws-sdk/clients/apigatewaymanagementapi';

enum MessageTypes {
  CONNECTED = 'CONNECTED',
  NEW_MESSAGE = 'NEW_MESSAGE',
}

interface MessageData {
  action: MessageTypes;
  data?: Record<string, unknown>;
}

// TODO: Memoize function to return the same instance
const buildManagementApi = (requestContext: APIGatewayEventWebsocketRequestContextV2): ApiGatewayManagementApi => {
  const { domainName, stage } = requestContext;

  const endpoint = [domainName, stage].join('/');

  return new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: !process.env.IS_OFFLINE ? endpoint : 'http://localhost:3001',
  });
};

export const sendWSConnected = (event: APIGatewayProxyWebsocketEventV2): Promise<unknown> => {
  const managementApi = buildManagementApi(event.requestContext);
  const { connectionId } = event.requestContext;
  const msgInfo: MessageData = {
    action: MessageTypes.CONNECTED,
    data: {
      connectionId,
    },
  };

  const params: PostToConnectionRequest = {
    ConnectionId: connectionId,
    Data: JSON.stringify(msgInfo),
  };

  log.debug('@Send conneccted: ', params);

  return managementApi.postToConnection(params).promise();
};

export const sendWSMessage = (
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string
): Promise<unknown> | void => {
  if (!event.body) {
    return;
  }
  const managementApi = buildManagementApi(event.requestContext);
  const body = JSON.parse(event.body);
  const postData: MessageData = {
    action: MessageTypes.NEW_MESSAGE,
    data: body.data,
  };

  const params: PostToConnectionRequest = {
    ConnectionId: connectionId,
    Data: JSON.stringify(postData),
  };

  log.debug('@Send message: ', params);

  return managementApi.postToConnection(params).promise();
};
