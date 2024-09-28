import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { main as taskMain } from './tasks.js';
import { main as chatMain } from './chat.js';
import { Conversation } from './conversation.js';

function main () {
  const argv = yargs(hideBin(process.argv))
    .usage('$0 [id]', 'starts or continues a conversation', (yargs) => {
      yargs.positional('id', {
        describe: 'The ID of the conversation to start or continue',
        type: 'string'
      })
    })
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
    .strict()
    .argv;

  const { id, fork, task } = argv;
  let conversation = new Conversation(id);

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
}

export { main };