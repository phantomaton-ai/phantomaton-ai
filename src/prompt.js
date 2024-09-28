import fs from 'fs';
import path from 'path';
import { commands } from './commands.js';

const getSystemPrompt = (summary) => {
  let systemPrompt = '';

  // Append the contents of SYSTEM.md
  systemPrompt += fs.readFileSync(path.join('SYSTEM.md'), 'utf-8');
  systemPrompt += '\n\n';

  // Append the conversation summary
  systemPrompt += '# Summary of the conversation so far \n\n';
  systemPrompt += summary;
  systemPrompt += '\n\n';

  // Append examples of the commands
  systemPrompt += '## Available Commands\n\n';
  for (const { name, example } of commands) {
    systemPrompt += `### /[name](`;
    if (example.options) {
      systemPrompt += Object.entries(example.options)
        .map(([key, value]) => `${key}:${value}`)
        .join(', ');
    }
    systemPrompt += `) {\n`;
    if (example.body) {
      systemPrompt += `${example.body}\n`;
    }
    systemPrompt += `} [name]!\n\n`;
  }

  return systemPrompt;
};

export { getSystemPrompt };
