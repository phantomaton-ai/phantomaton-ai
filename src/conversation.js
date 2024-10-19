import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { getResponse } from './api.js';
import { execute } from './execute.js';
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
    this.messages = [];
    this.summary = "(no summary)";
    this.preamble = '';
  }

  async loadMessages() {
    if (fs.existsSync(this.conversationPath)) {
      this.messages = JSON.parse(fs.readFileSync(this.conversationPath, 'utf-8'));
    }
    return this.messages;
  }

  async saveMessages() {
    await fs.writeFileSync(this.conversationPath, JSON.stringify(this.messages, null, 2));
  }

  async loadSummary() {
    if (fs.existsSync(this.summaryPath)) {
      this.summary = fs.readFileSync(this.summaryPath, 'utf-8') || "(no summary)";
    }
    return this.summary;
  }

  async saveSummary(newSummary) {
    this.summary = newSummary;
    await fs.writeFileSync(this.summaryPath, newSummary);
  }

  async appendMessage(message) {
    this.messages.push(message);
    await this.saveMessages();
  }

  async getSystemPrompt() {
    return `# Conversation: ${this.conversationId}\n\n${this.summary}`;
  }

  async advanceConversation(userInput) {
    const systemPrompt = await this.getSystemPrompt();
    const { role, content } = await getResponse(this.messages, systemPrompt);
    const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
    const response = texts.join('\n\n---\n\n');
    this.preamble = execute(response);
    await this.appendMessage({ role, content: response });
    if (this.messages.length >= SUMMARIZATION_THRESHOLD && this.messages.length % SUMMARIZATION_THRESHOLD === 0) {
      const newSummary = await summarize(this.messages.slice(-MAX_CONVERSATION_LENGTH), systemPrompt);
      await this.saveSummary(newSummary);
    }
    return { response, preamble: this.preamble };
  }

  fork(newConversationId) {
    const newConversation = new Conversation(newConversationId);
    if (fs.existsSync(this.conversationPath)) {
      fs.copyFileSync(this.conversationPath, newConversation.conversationPath);
    }
    if (fs.existsSync(this.summaryPath)) {
      fs.copyFileSync(this.summaryPath, newConversation.summaryPath);
    }
    return newConversation;
  }
}

export { Conversation };