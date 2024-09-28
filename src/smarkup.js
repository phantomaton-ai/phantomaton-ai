import smarkup from 'smarkup';

const instance = smarkup({
  symbols: {
    directive: {
      start: '🪄✨ ',
      end: '⚡️'
    },
    attributes: {
      start: '(',
      separator: ',',
      end: ')'
    },
    pair: {
      separator: '='
    },
    body: {
      start: '{',
      end: '}'
    }
  }
});

export default instance;
