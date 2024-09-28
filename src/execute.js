import { commandMap } from './commands.js';
import smarkup from './smarkup.js';

const execute = (input) => {
  const separator = '\n\n---\n\n';

  try {
    const directives = smarkup.parse(input);

    const results = directives.map(({ action, attributes, body }) => {
      const command = commandMap[action];
      return command && command(attributes, body);
    }).filter(result => result);

    return results.length < 1 ? '' : results.join('\n') + separator;
  } catch (e) {
    return `ERROR: ${e.message}${separator}`;
  }
};

export { execute };
