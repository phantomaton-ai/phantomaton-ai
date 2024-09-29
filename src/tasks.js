import fs from 'fs';

import { Conversation } from './conversation.js';
import { execute } from './execute.js';
import { getResponse } from './api.js';
import { getSystemPrompt } from './prompt.js';
import summarize from './summarize.js';

const TASK_INTERVAL = 60000; // 60 seconds
const TASK_DURATION = 1800000; // 30 minutes

const runTask = async (conversation) => {
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

  const startTime = Date.now();
  while (Date.now() - startTime < TASK_DURATION) {
    const systemPrompt = getSystemPrompt(summary);
    const { role, content } = await getResponse(messages, systemPrompt);
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    const response = texts.join('\n\n---\n\n');
    preamble = execute(response);
    messages.push({ role, content: response });
    if (messages.length >= 10 && messages.length % 10 === 0) {
      summarize(messages.slice(-10), summary).then(saveSummary);
    }
    await new Promise(resolve => setTimeout(resolve, TASK_INTERVAL));
  }
};

const main = async (conversation) => {
  await runTask(conversation);
};

export { main };