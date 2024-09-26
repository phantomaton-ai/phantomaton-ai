import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

class Conversation {
  constructor(conversationId) {
    this.conversationId = conversationId;
    this.conversationPath = path.join('data', 'conversations', `${conversationId}.json`);
    this.summaryPath = path.join('data', 'conversations', 'summaries', `${conversationId}.json`);
  }

  fork(newConversationId = uuidv4()) {
    console.log(`Forking conversation ${this.conversationId} to ${newConversationId}`);
    const messages = JSON.parse(fs.readFileSync(this.conversationPath, 'utf-8'));
    const newConversationPath = path.join('data', 'conversations', `${newConversationId}.json`);
    fs.writeFileSync(newConversationPath, JSON.stringify(messages, null, 2));
    fs.writeFileSync(this.summaryPath, fs.readFileSync(this.summaryPath, 'utf-8'));
    return new Conversation(newConversationId);
  }
}

export { Conversation };
