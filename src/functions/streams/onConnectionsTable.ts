import { Callback, Context, DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import * as log from 'lambda-log';
import { sendWSConnected } from '@src/connections/wsSender';

log.options.debug = true;

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent, _ctx: Context, callback: Callback) => {
  log.debug('@ DB stream called', { event });

  try {
    if (event.Records.length === 1) {
      const connectionID = event.Records[0].dynamodb?.NewImage?.connectionId.S;
      if (!connectionID) {
        throw new Error('No connectionID found');
      }
      // TODO: Find out how to get websocket endpoint (Alts: SNS | SQS | Invoke)
      // await sendWSConnected(event);
    }

    callback(null, 'Finished Insert Stream Event');
  } catch (error) {
    log.error(error as Error, { msg: 'Failed Insert Stream Handler' });
  }
};
