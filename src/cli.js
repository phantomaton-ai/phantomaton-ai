import { getResponse } from './api.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const MAX_CONVERSATION_LENGTH = 24;
const SUMMARIZATION_THRESHOLD = 12;

const promptUser = async (prompt) => {
  process.stdout.write(prompt);
  return new Promise((resolve) => {
    const lines = [];
    process.stdin.on('data', (data) => {
      const line = data.toString().trim();
      if (line.endsWith('\\')) {
        lines.push(line.slice(0, line.length - 1));
      } else {
        lines.push(line);
        resolve(lines.join('\n'))
      }
    });
  });
};

const main = async () => {
  let [, , conversationId, action, actionParam] = process.argv;
  const conversationPath = path.join('data', 'conversations', `${conversationId}.json`);
  const summaryPath = path.join('data', 'conversations', 'summaries', `${conversationId}.json`);
  let messages = [];

  if (action === '--fork') {
    const newConversationId = actionParam || uuidv4();
    const newConversationPath = path.join('data', 'conversations', `${newConversationId}.json`);
    console.log(`Forking conversation ${conversationId} to ${newConversationId}`);
    messages = JSON.parse(fs.readFileSync(conversationPath, 'utf-8'));
    fs.writeFileSync(newConversationPath, JSON.stringify(messages, null, 2));
    conversationId = newConversationId;
  } else if (fs.existsSync(conversationPath)) {
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

    if (messages.length >= SUMMARIZATION_THRESHOLD && messages.length % SUMMARIZATION_THRESHOLD === 0) {
      console.log(`Summarizing conversation ${conversationId}...`);
      // TODO: Implement summarization logic here
      fs.writeFileSync(summaryPath, JSON.stringify({ summary: 'TODO: Implement summarization logic' }, null, 2));
    }

    const recentMessages = messages.slice(-MAX_CONVERSATION_LENGTH);
    const { role, content } = await getResponse(recentMessages);
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
