import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import api from './api.js';
import { execute } from './execute.js';
import { getSystemPrompt } from './prompt.js';
import summarize from './summarize.js';

const MAX_CONVERSATION_TURNS = 20;
const MAX_CONVERSATION_LENGTH = MAX_CONVERSATION_TURNS * 2;
const SUMMARIZATION_THRESHOLD = MAX_CONVERSATION_LENGTH / 2;

class Conversation {
  constructor(conversationId) {
    conversationId = conversationId || uuidv4();
    this.conversationId = conversationId;
    this.conversationPath = path.join('data', 'conversations', `${conversationId}.json`);
    this.summaryPath = path.join('data', 'conversations', 'summaries', conversationId);
    this.messages = fs.existsSync(this.conversationPath) ?
      JSON.parse(fs.readFileSync(this.conversationPath, 'utf-8')) : [];
    this.summary = fs.existsSync(this.summaryPath) ?
      fs.readFileSync(this.summaryPath, 'utf-8') : "(no summary)";
    this.prompt = getSystemPrompt(this.summary);
    this.preamble = '';
  }

  save() {
    fs.writeFileSync(this.conversationPath, JSON.stringify(this.messages, null, 2));
    fs.writeFileSync(this.summaryPath, this.summary);
  }

  async resummarize() {
    if (this.messages.length < SUMMARIZATION_THRESHOLD) return;
    if (this.messages.length % SUMMARIZATION_THRESHOLD !== 0) return;
    this.summary = await summarize(this.messages.slice(-MAX_CONVERSATION_LENGTH), this.prompt);;
    this.prompt = getSystemPrompt(this.summary);
    fs.writeFileSync(this.summaryPath, this.summary);
  }

  async advance(message) {
    const parts = [this.preamble, message].filter(part => part.length > 0);
    const full = parts.join('\n\n---\n\n');
    this.messages.push({ role: 'user', content: full });
    const { role, content } = await api.converse(this.messages, this.prompt);
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    const response = texts.join('\n\n---\n\n');
    this.preamble = execute(response);
    this.messages.push({ role, content: response });
    this.resummarize();
    this.save();
    return { response, preamble: this.preamble };
  }

  fork(conversationId) {
    const conversation = new Conversation(conversationId);
    conversation.messages = this.messages;
    conversation.summary = this.summary;
    conversation.save();
    return conversation;
  }
}

export { Conversation };
