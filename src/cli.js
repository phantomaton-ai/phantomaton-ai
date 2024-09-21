import { getResponse } from './api.js';

const main = async () => {
  const messages = [
    { role: 'user', content: 'Hello, Phantomaton. What is your purpose?' },
  ];
  const { role, content } = await getResponse(messages);
  console.log(`${role.toUpperCase()}: ${content}`);
};

export { main };
