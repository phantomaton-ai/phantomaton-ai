import chalk from 'chalk';
import { Conversation } from './conversation.js';
import { getUserInput } from './input.js';

const output = text => process.stdout.write(text);
const main = async (conversation) => {
  while (true) {
    if (conversation.preamble.trim().length < 1) {
      const userInput = await getUserInput('> ');
      if (userInput.toLowerCase() === 'exit') break;
      output(`\n${chalk.blue(conversation.prompt)}\n\n`);
      const { response, preamble } = await conversation.advance(userInput);
      output(`\n${chalk.green(response)}\n\n`);
      if (preamble.length > 0) output(`\n\n${chalk.magenta(preamble)}\n`);
    } else {
      await new Promise(res => setTimeout(res, 250));
      const { response, preamble } = await conversation.advance('');
      output(`\n${chalk.green(response)}\n\n`);
      if (preamble.length > 0) output(`\n\n${chalk.magenta(preamble)}\n`);
    }
  }

  output('Farewell, foolish humans! 🤖\n');
  process.exit();
};

export { main };
