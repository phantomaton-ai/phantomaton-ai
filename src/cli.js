import { getResponse } from './api.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const promptUser = async (prompt) => {
  process.stdout.write(prompt);
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
};

const main = async () => {
  let conversationId = process.argv[2] || uuidv4();
  const conversationPath = path.join('data', 'conversations', `${conversationId}.json`);
  let messages = [];

  if (fs.existsSync(conversationPath)) {
    messages = JSON.parse(fs.readFileSync(conversationPath, 'utf-8'));
    console.log(`Continuing conversation: ${conversationId}`);
  } else {
    console.log(`Starting new conversation: ${conversationId}`);
  }

  while (true) {
    const userInput = await promptUser('> ');
    if (userInput.toLowerCase() === 'exit') {
      process.stdout.write('Farewell, foolish humans! 🤖\n');
      fs.writeFileSync(conversationPath, JSON.stringify(messages, null, 2));
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