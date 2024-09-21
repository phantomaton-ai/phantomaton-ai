const fetch = require('node-fetch');
const path = require('path');
const { readFileSync } = require('fs');

const getResponse = async (messages) => {
  const system = readFileSync(path.join(__dirname, '../SYSTEM.md'), 'utf-8');
  const payload = { model: 'claude-3-haiku-20240307', max_tokens: 4096, messages, system };
  const headers = {
    Accept: 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  };
  const fetched = await fetch('https://api.anthropic.com/v1/messages', {
    body: JSON.stringify(payload),
    headers,
    method: 'POST',
  });
  const { role, content } = await fetched.json();
  return { role, content };
};

module.exports = { getResponse };

