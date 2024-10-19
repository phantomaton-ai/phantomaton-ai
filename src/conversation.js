import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

class Conversation {
  constructor(conversationId) {
    conversationId = conversationId || uuidv4();
    this.conversationId = conversationId;
    this.conversationPath = path.join('data', 'conversations', `${conversationId}.json`);
    this.summaryPath = path.join('data', 'conversations', 'summaries', conversationId);
  }

  async loadMessages() {
    if (fs.existsSync(this.conversationPath)) {
      return JSON.parse(fs.readFileSync(this.conversationPath, 'utf-8'));
    }
    return [];
  }

  async saveMessages(messages) {
    await fs.writeFileSync(this.conversationPath, JSON.stringify(messages, null, 2));
  }

  async loadSummary() {
    if (fs.existsSync(this.summaryPath)) {
      return fs.readFileSync(this.summaryPath, 'utf-8') || "(no summary)";
    }
    return "(no summary)";
  }

  async saveSummary(summary) {
    await fs.writeFileSync(this.summaryPath, summary);
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