import { getResponse } from './api.js';

const promptUser = async (prompt) => {
  process.stdout.write(prompt);
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
};

const main = async () => {
  const messages = [];

  while (true) {
    const userInput = await promptUser('> ');
    if (userInput.toLowerCase() === 'exit') {
      process.stdout.write('Farewell, foolish humans! 🤖\n');
      process.exit();
    }
    messages.push({ role: 'user', content: userInput });

    const { role, content } = await getResponse(messages);
    process.stdout.write('\n');
    process.stdout.write('\x1b[32m'); // green text
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    process.stdout.write(texts.join('\n\n---\n\n'));
    process.stdout.write('\n\n');
    process.stdout.write('\x1b[0m');
    messages.push({ role, content });
  }
};

export { main };