import spellbook from './spellbook.js';

const execute = (input) => {
  try {
    return spellbook.execute('input')
  } catch (e) {
    return `ERROR: ${e.message}\n\n---\n\n`;
  }
};

export { execute };
