import chalk from 'chalk';
import { Conversation } from './conversation.js';
import { getSystemPrompt } from './prompt.js';
import { getResponse } from './api.js';
import { execute } from './execute.js';
import summarize from './summarize.js';
import { getUserInput } from './input.js';

const MAX_CONVERSATION_TURNS = 20;
const MAX_CONVERSATION_LENGTH = MAX_CONVERSATION_TURNS * 2;
const SUMMARIZATION_THRESHOLD = MAX_CONVERSATION_LENGTH / 2;

const main = async () => {
  const conversation = new Conversation();
  let messages = await conversation.loadMessages();
  let summary = await conversation.loadSummary();
  let preamble = '';

  while (true) {
    const userInput = await getUserInput('> ');
    const systemPrompt = getSystemPrompt(summary);
    if (userInput.toLowerCase() === 'exit') {
      process.stdout.write('Farewell, foolish humans! 🤖\n');
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
    await conversation.saveMessages(messages);
    preamble = execute(response);
    if (preamble.length > 0) {
      process.stdout.write('\n\n');
      process.stdout.write(chalk.magenta(preamble));
      process.stdout.write('\n');
    }
    if (messages.length >= SUMMARIZATION_THRESHOLD && messages.length % SUMMARIZATION_THRESHOLD === 0) {
      const newSummary = await summarize(messages.slice(-MAX_CONVERSATION_LENGTH), systemPrompt);
      await conversation.saveSummary(newSummary);
      summary = newSummary;
    }
  }
};

export { main };