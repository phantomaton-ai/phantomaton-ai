import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { main as taskMain } from './tasks.js';
import { main as chatMain } from './chat.js';
import { Conversation } from './conversation.js';

const argv = yargs(hideBin(process.argv))
  .option('task', {
    alias: 't',
    type: 'boolean',
    description: 'Run the conversation in task mode'
  })
  .option('fork', {
    alias: 'f',
    type: 'string',
    description: 'Fork the conversation with the given new ID'
  })
  .positional('conversationId', {
    describe: 'The ID of the conversation to start or continue',
    default: Conversation.generateId(),
  })
  .demandOption(['conversationId'])
  .strict()
  .argv;

const { conversationId, fork, task } = argv;
let conversation = new Conversation(conversationId);

if (fork) {
  const oldConversationId = conversation.conversationId;
  conversation = conversation.fork(fork);
  console.log(`Forked conversation ${oldConversationId} to ${conversation.conversationId}`);
}

if (task) {
  taskMain(conversation);
} else {
  chatMain(conversation);
}