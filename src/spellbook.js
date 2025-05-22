import necronomicon from 'necronomicon';
import projects from 'phantomaton-projects';

const { commands } = projects({ home: '~/.phantomaton/projects' });
const symbols = { directive: { start: '🪄✨ ', end: '⚡️' } };
const includes = { text: false };

export default necronomicon({ commands, symbols, includes });
