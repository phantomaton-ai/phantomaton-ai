import 'dotenv/config';
import { main as taskMain } from './tasks.js';
import { main as chatMain } from './chat.js';
import { Conversation } from './conversation.js';

const [, , conversationId, action, actionParam] = process.argv;

let conversation = new Conversation(conversationId);

if (action === '--fork') {
  const oldConversationId = conversation.conversationId;
  conversation = conversation.fork(actionParam);
  console.log(`Forked conversation ${oldConversationId} to ${conversation.conversationId}`);
}

if (action === '--tasks') {
  taskMain(conversation);
} else {
  chatMain(conversation);
}