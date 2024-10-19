import chalk from 'chalk';
import { Conversation } from './conversation.js';
import { getSystemPrompt } from './prompt.js';
import { getResponse } from './api.js';
import { execute } from './execute.js';
import summarize from './summarize.js';
import { getUserInput } from './input.js';

const TASK_INTERVAL = 60000; // 60 seconds
const TASK_DURATION = 1800000; // 30 minutes

const runTask = async () => {
  const conversation = new Conversation();
  const task = await getUserInput('> ');
  const reminder = `No commands executed. Reminder, your task:\n\n ${task}\n\n`;

  let messages = await conversation.loadMessages();
  let summary = await conversation.loadSummary();
  let preamble = '';

  messages.push({ role: 'user', content: task });
  const startTime = Date.now();
  while (Date.now() - startTime < TASK_DURATION) {
    const systemPrompt = getSystemPrompt(summary) + `# Task\n\n${task}\n`;
    console.log(chalk.blue(systemPrompt));
    const { role, content } = await getResponse(messages, systemPrompt);
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    const response = texts.join('\n\n---\n\n');
    console.log(chalk.green(response));
    preamble = execute(response);
    messages.push({ role, content: response });
    if (messages.length >= 10 && messages.length % 10 === 0) {
      const newSummary = await summarize(messages.slice(-10), summary);
      await conversation.saveSummary(newSummary);
      summary = newSummary;
    }
    const nextContent = preamble.length > 0 ? preamble : reminder;
    console.log(chalk.magenta(nextContent));
    messages.push({ role: 'user', content: nextContent });
    await conversation.saveMessages(messages);
    await new Promise(resolve => setTimeout(resolve, TASK_INTERVAL));
  }
};

const main = async () => {
  await runTask();
};

export { main };