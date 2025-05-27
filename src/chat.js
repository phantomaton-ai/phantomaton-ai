import chalk from 'chalk';
import { Conversation } from './conversation.js';
import { getUserInput } from './input.js';
import interrupt from './interrupt.js';

const output = text => process.stdout.write(text);
const main = async (conversation) => {
  while (true) {
    const inputNeeded = (conversation.preamble.trim().length < 1) || await interrupt(5000);
    const userInput = inputNeeded ? await getUserInput('> ') : '';
    if (userInput.toLowerCase() === 'exit') break;
    output(`\n${chalk.blue(conversation.prompt)}\n\n`);
    const { response, preamble } = await conversation.advance(userInput);
    output(`\n${chalk.green(response)}\n\n`);
    if (preamble.length > 0) output(`\n\n${chalk.magenta(preamble)}\n`);
  }

  output('Farewell, foolish humans! 🤖\n');
  process.exit();
};

export { main };
