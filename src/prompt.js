import fs from 'fs';
import path from 'path';

const getSystemPrompt = (summary) => {
  let systemPrompt = '';

  // Append the contents of SYSTEM.md
  systemPrompt += fs.readFileSync(path.join('SYSTEM.md'), 'utf-8');
  systemPrompt += '\n\n';

  // Append the conversation summary
  systemPrompt += '# Summary of the conversation so far \n\n';
  systemPrompt += summary;
  systemPrompt += '\n\n';

  return systemPrompt;
};

export { getSystemPrompt };
