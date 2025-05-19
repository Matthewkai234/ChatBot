import { handler as listEC2 } from './intents/listEC2.mjs';
import { handler as terminateEC2} from './intents/terminateEC2.mjs';
import { handler as fallbackHandler} from './intents/fallbackHandler.mjs';
import {handler as listS3} from './intents/listS3.mjs'
import {handler as deleteS3Bucket} from './intents/deleteS3Bucket.mjs'
export async function handler(event) {
  const intentName = event.sessionState.intent.name;
  

  switch (intentName) {
    case 'listEC2Instances':
      return await listEC2(event);

    case 'TerminateEC2Instances':
      return await terminateEC2(event);

    case 'ListS3Buckets':
        return await listS3(event) 
    
    case 'DeleteS3Bucket':
      return await deleteS3Bucket(event)

    case 'FallbackIntent':
      return await fallbackHandler(event);
    
    default:
      return {
        sessionState: {
          dialogAction: {
            type: 'Close',
          },
          intent: {
            name: intentName,
            state: 'Failed',
          },
        },
        messages: [
          {
            contentType: 'PlainText',
            content: `Unhandled intent: ${intentName}`,
          },
        ],
      };
  }
}
