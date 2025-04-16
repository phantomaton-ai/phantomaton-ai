import necronomicon from 'necronomicon';
import projects from 'phantomaton-projects';

const { commands } = projects({ home: 'data/projects' });
const symbols =  { directive: { start: '🪄✨ ', end: '⚡️' } };
const includes = { text: false };

export default necronomicon({ commands, symbols, includes });
