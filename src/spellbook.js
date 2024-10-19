import necronomicon from 'necronomicon';
import projects from 'phantomaton-projects';

const { commands } = projects({ home: 'data/projects' });
const symbols =  { directive: { start: '🪄✨ ', end: '⚡️' } };

export default necronomicon({ commands, symbols });
