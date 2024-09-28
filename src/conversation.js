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