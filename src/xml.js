import {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
} from './projects.js';

const parseXml = (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  const commandMap = {
    listProjects: listProjects,
    createProject: (name) => createProject(name),
    listProjectFiles: (name) => listProjectFiles(name),
    readProjectFile: (name, file) => readProjectFile(name, file),
    writeProjectFile: (name, file, content) => writeProjectFile(name, file, content),
  };

  const processNode = (node) => {
    const tagName = node.tagName.toLowerCase();
    const command = commandMap[tagName];
    if (typeof command === 'function') {
      const args = Array.from(node.children).map((child) => child.textContent);
      return command(...args);
    } else {
      console.error(`Unknown XML tag: ${tagName}`);
      return null;
    }
  };

  const result = Array.from(doc.documentElement.children).map(processNode);
  return result.filter((r) => r !== null);
};

export { parseXml };
