import chalk from 'chalk';
import { Conversation } from './conversation.js';
import { getUserInput } from './input.js';

const TASK_INTERVAL = 60000; // 60 seconds
const TASK_DURATION = 1800000; // 30 minutes

const runTask = async () => {
  const conversation = new Conversation();
  await conversation.loadMessages();
  await conversation.loadSummary();

  const task = await getUserInput('> ');
  const reminder = `No commands executed. Reminder, your task:\n\n ${task}\n\n`;

  conversation.messages.push({ role: 'user', content: task });
  const startTime = Date.now();
  while (Date.now() - startTime < TASK_DURATION) {
    const systemPrompt = await conversation.getSystemPrompt() + `# Task\n\n${task}\n`;
    console.log(chalk.blue(systemPrompt));
    const { response, preamble } = await conversation.advanceConversation();
    console.log(chalk.green(response));
    if (preamble.length > 0) {
      console.log(chalk.magenta(preamble));
    } else {
      console.log(chalk.magenta(reminder));
      conversation.messages.push({ role: 'user', content: reminder });
    }
    await new Promise(resolve => setTimeout(resolve, TASK_INTERVAL));
  }
};

const main = async () => {
  await runTask();
};

export { main };