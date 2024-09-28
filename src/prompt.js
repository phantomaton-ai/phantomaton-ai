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

  // Append examples of the commands
  systemPrompt += '## Available Commands\n\n';
  for (const { name, example } of commands) {
    const directive = {
      action: name,
      attributes: example.options || {},
      body: example.body || ''
    };
    systemPrompt += smarkup({
      symbols: {
        directive: {
          start: '🧙‍♂️ ',
          end: ' 🔮'
        },
        arguments: {
          start: '✨',
          separator: ' 💫 ',
          end: '✨'
        },
        pair: {
          separator: ' ✨ '
        },
        body: {
          start: '\n🔮 ',
          end: ' 🔮\n'
        }
      }
    }).render([directive]);
    systemPrompt += '\n';
  }

  return systemPrompt;
};

export { getSystemPrompt };
