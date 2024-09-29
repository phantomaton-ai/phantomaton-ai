import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import { getResponse } from './api.js';
import summarize from './summarize.js';
import { execute } from './execute.js';
import { Conversation } from './conversation.js';
import { getUserInput } from './input.js';
import { getSystemPrompt } from './prompt.js';

const MAX_CONVERSATION_TURNS = 20;
const MAX_CONVERSATION_LENGTH = MAX_CONVERSATION_TURNS * 2;
const SUMMARIZATION_THRESHOLD = MAX_CONVERSATION_LENGTH / 2;

const main = async (conversation) => {
  let messages = [];
  let summary = "(no summary)";
  let preamble = '';

  const saveSummary = newSummary => {
    fs.writeFileSync(conversation.summaryPath, newSummary);
    summary = newSummary;
  };

  if (fs.existsSync(conversation.summaryPath)) {
    summary = fs.readFileSync(conversation.summaryPath, 'utf-8') || "(no summary)";
  }

  if (fs.existsSync(conversation.conversationPath)) {
    messages = JSON.parse(fs.readFileSync(conversation.conversationPath, 'utf-8'));
    console.log(`Continuing conversation: ${conversation.conversationId}`);
  } else {
    console.log(`Starting new conversation: ${conversation.conversationId}`);
  }

  while (true) {
    const userInput = await getUserInput('> ');
    const systemPrompt = getSystemPrompt(summary);
    if (userInput.toLowerCase() === 'exit') {
      process.stdout.write('Farewell, foolish humans! 🤖\n');
      fs.writeFileSync(conversation.conversationPath, JSON.stringify(messages, null, 2));
      process.exit();
    }
    process.stdout.write(chalk.blue(systemPrompt));
    const messageContent = preamble.length > 0 ? `${preamble}\n\n${userInput}` : userInput;
    messages.push({ role: 'user', content: messageContent });
    const recentMessages = messages.slice(-(MAX_CONVERSATION_LENGTH + 1));
    const { role, content } = await getResponse(recentMessages, systemPrompt);
    process.stdout.write('\n');
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    const response = texts.join('\n\n---\n\n')
    process.stdout.write(chalk.green(response));
    process.stdout.write('\n\n');
    messages.push({ role, content: response });
    preamble = execute(response);
    if (preamble.length > 0) {
      process.stdout.write('\n\n');
      process.stdout.write(chalk.magenta(preamble));
      process.stdout.write('\n');
    }
    if (messages.length >= SUMMARIZATION_THRESHOLD && messages.length % SUMMARIZATION_THRESHOLD === 0) {
      summarize(messages.slice(-MAX_CONVERSATION_LENGTH), systemPrompt).then(saveSummary);
    }
  }
};

export { main };