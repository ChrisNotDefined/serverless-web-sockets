import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyWebsocketEventV2,
} from 'aws-lambda';

export const handler = (
  event: APIGatewayProxyWebsocketEventV2,
  context: APIGatewayEventWebsocketRequestContextV2,
  callback: APIGatewayProxyCallbackV2
) => {
  console.log('Called default handler');
  console.log(event);

  callback(null, {
    statusCode: 200,
    body: 'defaultHandler',
  });
};
