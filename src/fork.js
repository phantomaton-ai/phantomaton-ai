import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const forkConversation = (conversationId, summaryPath) => {
  const newConversationId = uuidv4();
  const newConversationPath = path.join('data', 'conversations', `${newConversationId}.json`);
  console.log(`Forking conversation ${conversationId} to ${newConversationId}`);
  const messages = JSON.parse(fs.readFileSync(path.join('data', 'conversations', `${conversationId}.json`), 'utf-8'));
  fs.writeFileSync(newConversationPath, JSON.stringify(messages, null, 2));
  fs.writeFileSync(summaryPath, fs.readFileSync(summaryPath, 'utf-8'));
  return { conversationId: newConversationId, conversationPath: newConversationPath, summaryPath };
};

export { forkConversation };
