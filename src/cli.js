import { getResponse } from './api.js';

const main = async () => {
  const messages = [
    { role: 'user', content: 'Hello, Phantomaton. What is your purpose?' },
  ];
  const { role, content } = await getResponse(messages);
  console.log(`${role.toUpperCase()}:\n`);
  const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
  console.log(texts.join('\n\n---\n\n'));
};

export { main };
