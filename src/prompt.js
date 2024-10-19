import fs from 'fs';
import path from 'path';
import spellbook from './spellbook.js';

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
  systemPrompt += '# Available Commands\n\n';
  systemPrompt += spellbook.document();

  return systemPrompt;
};

export { getSystemPrompt };
