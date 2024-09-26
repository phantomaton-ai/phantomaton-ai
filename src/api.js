import fetch from 'node-fetch';
import path from 'path';
import { readFileSync } from 'fs';

const getResponse = async (messages) => {
  const system = readFileSync(path.join(path.resolve(), 'SYSTEM.md'), 'utf-8');
  const payload = { model: 'claude-3-haiku-20240307', max_tokens: 4096, messages, system };
  const headers = {
    Accept: 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  };

  try {
    const fetched = await fetch('https://api.anthropic.com/v1/messages', {
      body: JSON.stringify(payload),
      headers,
      method: 'POST',
    });

    if (!fetched.ok) {
      const errorResponse = await fetched.json();
      console.error('Error from Anthropic API:');
      console.error(errorResponse);
      process.exit(1);
    }

    const { role, content } = await fetched.json();
    return { role, content };
  } catch (error) {
    console.error('Error fetching from Anthropic API:');
    console.error(error);
    process.exit(1);
  }
};

export { getResponse };
