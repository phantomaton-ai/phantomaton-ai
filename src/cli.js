import { getResponse } from './api.js';

const main = async () => {
  let messages = [
    { role: 'user', content: 'Hello, Phantomaton. What is your purpose?' },
  ];

  while (true) {
    const { role, content } = await getResponse(messages);
    console.log(`${role.toUpperCase()}:\n`);
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    console.log(texts.join('\n\n---\n\n'));

    const userInput = await promptUser('Enter your response (or "exit" to quit): ');
    if (userInput.toLowerCase() === 'exit') {
      console.log('Farewell, foolish humans! 🤖');
      break;
    }

    messages.push({ role: 'user', content: userInput });
  }
};

const promptUser = async (prompt) => {
  const { stdin, stdout } = process;
  stdout.write(prompt);
  return new Promise((resolve) => {
    stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
};

export { main };