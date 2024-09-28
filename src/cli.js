import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { main as taskMain } from './tasks.js';
import { main as chatMain } from './chat.js';
import { Conversation } from './conversation.js';

const argv = yargs(hideBin(process.argv))
  .command('chat [conversationId]', 'Start a new chat conversation or continue an existing one', (yargs) => {
    yargs.positional('conversationId', {
      describe: 'The ID of the conversation to start or continue',
      default: Conversation.generateId(),
    });
  })
  .command('task [conversationId] [--fork <newConversationId>]', 'Start a new task conversation or continue an existing one', (yargs) => {
    yargs.positional('conversationId', {
      describe: 'The ID of the conversation to start or continue',
      default: Conversation.generateId(),
    });
    yargs.option('fork', {
      alias: 'f',
      type: 'string',
      description: 'Fork the conversation with the given new ID',
    });
  })
  .demandCommand(1, 'You must provide a command to run')
  .strict()
  .argv;

const { conversationId, fork } = argv;
let conversation = new Conversation(conversationId);

if (argv._.includes('task')) {
  if (fork) {
    const oldConversationId = conversation.conversationId;
    conversation = conversation.fork(fork);
    console.log(`Forked conversation ${oldConversationId} to ${conversation.conversationId}`);
  }
  taskMain(conversation);
} else {
  chatMain(conversation);
}