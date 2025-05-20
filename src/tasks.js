import chalk from 'chalk';
import { getUserInput } from './input.js';

const DELAY_MS = 20000;
const TURNS = 30;

const output = text => process.stdout.write(text);
const main = async (conversation) => {
  const userInput = await getUserInput('> ');
  let t = 0;
  while (t < TURNS) {
    const message = t < 1 ?
      userInput :
      `(you are working in an automated environment; please continue until task is complete, you have ${TURNS - t} turns remaining.)`;
    if (t > 0) await new Promise(r => setTimeout(r, DELAY_MS));
    output(`\n${chalk.white(message)}\n\n`);
    output(`\n${chalk.blue(conversation.prompt)}\n\n`);
    const { response, preamble } = await conversation.advance(message);
    output(`\n${chalk.green(response)}\n\n`);
    if (preamble.length > 0) output(`\n\n${chalk.magenta(preamble)}\n`);
    t += 1;
  }

  output('Farewell, foolish humans! 🤖\n');
  process.exit();
};

export { main };
