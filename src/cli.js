import { getResponse } from './api.js';
import summarize from './summarize.js';
import { runXml } from './xml.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const MAX_CONVERSATION_TURNS = 20;
const MAX_CONVERSATION_LENGTH = MAX_CONVERSATION_TURNS * 2;
const SUMMARIZATION_THRESHOLD = MAX_CONVERSATION_LENGTH / 2;

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
  let conversationPath = path.join('data', 'conversations', `${conversationId}.json`);
  let summaryPath = path.join('data', 'conversations', 'summaries', `${conversationId}.json`);
  let messages = [];
  let summary = "(no summary)";
  let preamble = '';

  const saveSummary = newSummary => {
    fs.writeFileSync(summaryPath, newSummary);
    summary = newSummary;
  };


  if (fs.existsSync(summaryPath)) {
    summary = fs.readFileSync(summaryPath, 'utf-8');
  }

  if (action === '--fork') {
    const newConversationId = actionParam || uuidv4();
    const newConversationPath = path.join('data', 'conversations', `${newConversationId}.json`);
    console.log(`Forking conversation ${conversationId} to ${newConversationId}`);
    messages = JSON.parse(fs.readFileSync(conversationPath, 'utf-8'));
    fs.writeFileSync(newConversationPath, JSON.stringify(messages, null, 2));
    conversationId = newConversationId;
    conversationPath = path.join('data', 'conversations', `${conversationId}.json`);
    summaryPath = path.join('data', 'conversations', 'summaries', `${conversationId}.json`);
    saveSummary(summary);
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
    const messageContent = preamble.length > 0 ? `${preamble}\n\n${userInput}` : userInput;
    messages.push({ role: 'user', content: messageContent });
    const recentMessages = messages.slice(-(MAX_CONVERSATION_LENGTH + 1));
    const { role, content } = await getResponse(recentMessages, summary);
    process.stdout.write('\n');
    process.stdout.write('\x1b[32m'); // green text
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    const response = texts.join('\n\n---\n\n')
    process.stdout.write(response);
    process.stdout.write('\n\n');
    process.stdout.write('\x1b[0m');
    messages.push({ role, content });
    preamble = runXml(response);
    if (messages.length >= SUMMARIZATION_THRESHOLD && messages.length % SUMMARIZATION_THRESHOLD === 0) {
      summarize(messages.slice(-MAX_CONVERSATION_LENGTH), summary).then(saveSummary);
    }
  }
};

export { main };
