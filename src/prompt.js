import fs from 'fs';
import path from 'path';
import smarkup from './smarkup.js';
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

  // Append examples and descriptions of the commands
  systemPrompt += '## Available Commands\n\n';
  commands.forEach(({ name, example, description }) => {
    systemPrompt += `🪄✨ ${name}(`;
    if (example.options) {
      systemPrompt += `${Object.keys(example.options).map(key => `${key}=${example.options[key]}`).join(',')}`;
    }
    systemPrompt += `) - ${description}\n`;
    systemPrompt += smarkup.render([{
      action: name,
      attributes: example.options || {},
      body: example.body
    }]);
    systemPrompt += '\n';
  });

  return systemPrompt;
};

export { getSystemPrompt };
