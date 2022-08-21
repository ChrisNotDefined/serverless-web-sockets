import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';

export const handler: SNSHandler = async (event: SNSEvent) => {
  const records: SNSEventRecord[] = event.Records;
  records.forEach((record) => {
    console.log(`Message is: ${record.Sns.Message}`);
  });
};
