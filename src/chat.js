import chalk from 'chalk';
import { Conversation } from './conversation.js';
import { getUserInput } from './input.js';

const main = async () => {
  const conversation = new Conversation();
  await conversation.loadMessages();
  await conversation.loadSummary();

  while (true) {
    const userInput = await getUserInput('> ');
    if (userInput.toLowerCase() === 'exit') {
      process.stdout.write('Farewell, foolish humans! 🤖\n');
      process.exit();
    }
    const { response, preamble } = await conversation.advanceConversation(userInput);
    process.stdout.write('\n');
    process.stdout.write(chalk.green(response));
    process.stdout.write('\n\n');
    if (preamble.length > 0) {
      process.stdout.write('\n\n');
      process.stdout.write(chalk.magenta(preamble));
      process.stdout.write('\n');
    }
  }
};

export { main };