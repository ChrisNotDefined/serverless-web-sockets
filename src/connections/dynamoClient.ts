import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { sendWSMessage } from './wsSender';

const dynClient = new DynamoDB.DocumentClient();
const CHAT_ID_TABLE = 'chatIdTable';

// Internal utils
const getConnectionIds = () => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: CHAT_ID_TABLE,
    ProjectionExpression: 'connectionId',
  };

  return dynClient.scan(params).promise();
};

// External utils
export const addConnection = async (
  connectionID: string
): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: CHAT_ID_TABLE,
    Item: {
      connectionId: connectionID,
    },
  };

  return dynClient.put(params).promise();
};

export const deleteConnection = async (
  connectionID: string
): Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWSError>> => {
  const params: DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: CHAT_ID_TABLE,
    Key: {
      connectionId: connectionID,
    },
  };

  return dynClient.delete(params).promise();
};

export const sendMessageToAllConnected = async (event: APIGatewayProxyWebsocketEventV2) => {
  return getConnectionIds().then((connectionData) => {
    return connectionData.Items?.map((connectionId) => {
      return sendWSMessage(event, connectionId.connectionId);
    });
  });
};
