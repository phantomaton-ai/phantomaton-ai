import chalk from 'chalk';
import fs from 'fs';

import { getResponse } from './api.js';
import { commands } from './commands.js';
import { Conversation } from './conversation.js';
import { execute } from './execute.js';
import { getUserInput } from './input.js';
import { getSystemPrompt } from './prompt.js';
import summarize from './summarize.js';

const TASK_INTERVAL = 60000; // 60 seconds
const TASK_DURATION = 1800000; // 30 minutes

const runTask = async (conversation) => {
  const task = await getUserInput('> ');
  const reminder = `No commands executed. Reminder, your task:\n\n ${task}\n\n` + 
    'Remember, available commands and their syntax:\n\n' +
    commands.map(({ name, example }) => {
      smarkup.render([{
        action: name,
        attributes: example.options || {},
        body: example.body
      }]);
      systemPrompt += '\n';
    }).join('n');

  let messages = [];
  let summary = "(no summary)";
  let preamble = '';

  const saveSummary = newSummary => {
    // Save the summary to the conversation's summary file
    fs.writeFileSync(conversation.summaryPath, newSummary);
    summary = newSummary;
  };

  // Load the conversation summary if it exists
  if (fs.existsSync(conversation.summaryPath)) {
    summary = fs.readFileSync(conversation.summaryPath, 'utf-8') || "(no summary)";
  }

  // Load the conversation messages if they exist
  if (fs.existsSync(conversation.conversationPath)) {
    messages = JSON.parse(fs.readFileSync(conversation.conversationPath, 'utf-8'));
  }

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
      summarize(messages.slice(-10), summary).then(saveSummary);
    }
    const nextContent = preamble.length > 0 ? preamble : reminder;
    console.log(chalk.magenta(nextContent));
    messages.push({ role: 'user', content: nextContent });
    fs.writeFileSync(conversation.conversationPath, JSON.stringify(messages, null, 2));
    await new Promise(resolve => setTimeout(resolve, TASK_INTERVAL));
  }
};

const main = async (conversation) => {
  await runTask(conversation);
};

export { main };