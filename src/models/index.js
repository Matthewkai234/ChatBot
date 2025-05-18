// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Conversation, Utterance } = initSchema(schema);

export {
  Conversation,
  Utterance
};