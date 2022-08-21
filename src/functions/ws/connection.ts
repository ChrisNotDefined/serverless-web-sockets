import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyWebsocketEventV2,
} from 'aws-lambda';
import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { successfullReponse } from '@src/util/lambdaResponses';

const dynClient = new AWS.DynamoDB.DocumentClient();

export const handler = (
  event: APIGatewayProxyWebsocketEventV2,
  context: APIGatewayEventWebsocketRequestContextV2,
  callback: APIGatewayProxyCallbackV2
) => {
  console.log(event);

  const requestEventType = event.requestContext.eventType;

  if (requestEventType === 'CONNECT') {
    // Handle connection
    addConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullReponse);
      })
      .catch((err) => {
        console.log(err);
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

const addConnection = async (
  connectionID: string
): Promise<PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>> => {
  const chatIDTable = 'chatIdTable';

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: chatIDTable,
    Item: {
      connectionId: connectionID,
    },
  };

  return dynClient.put(params).promise();
};

const deleteConnection = async (
  connectionID: string
): Promise<PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>> => {
  const chatIDTable = 'chatIdTable';

  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: chatIDTable,
    Key: {
      connectionId: connectionID,
    },
  };

  return dynClient.delete(params).promise();
};
