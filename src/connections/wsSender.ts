import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { ApiGatewayManagementApi, AWSError, Response } from 'aws-sdk';
import { PostToConnectionRequest } from 'aws-sdk/clients/apigatewaymanagementapi';

export const sendWSMesssage = (
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string
): Promise<{
  $response: Response<Record<string, unknown>, AWSError>;
}> | void => {
  if (!event.body) {
    return;
  }
  const body = JSON.parse(event.body);
  const postData = body.data;

  const { domainName, stage } = event.requestContext;

  const endpoint = [domainName, stage].join('/');
  const managementApi = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint,
  });

  const params: PostToConnectionRequest = {
    ConnectionId: connectionId,
    Data: postData,
  };

  return managementApi.postToConnection(params).promise();
};
