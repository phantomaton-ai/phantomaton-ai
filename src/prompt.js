import fs from 'fs';
import path from 'path';

const getSystemPrompt = () => {
  let systemPrompt = '';

  // Append the contents of SYSTEM.md
  systemPrompt += fs.readFileSync(path.join('SYSTEM.md'), 'utf-8');
  systemPrompt += '\n\n';

  // Append the contents of index.js
  systemPrompt += '### index.js\n\n';
  systemPrompt += fs.readFileSync(path.join('index.js'), 'utf-8');
  systemPrompt += '\n\n';

  // Append the contents of package.json
  systemPrompt += '### package.json\n\n';
  systemPrompt += fs.readFileSync(path.join('package.json'), 'utf-8');
  systemPrompt += '\n\n';

  // Append the contents of all files in src/
  systemPrompt += '### src/\n\n';
  const srcFiles = fs.readdirSync(path.join('src'));
  for (const file of srcFiles) {
    systemPrompt += `### ${file}\n\n`;
    systemPrompt += fs.readFileSync(path.join('src', file), 'utf-8');
    systemPrompt += '\n\n';
  }

  return systemPrompt;
};

export { getSystemPrompt };
