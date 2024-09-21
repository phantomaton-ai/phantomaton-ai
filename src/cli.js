const { getResponse } = require('./api');

const main = async () => {
  const messages = [
    { role: 'user', content: 'Hello, Phantomaton. What is your purpose?' },
  ];
  const { role, content } = await getResponse(messages);
  console.log(`${role.toUpperCase()}: ${content}`);
};

main();

