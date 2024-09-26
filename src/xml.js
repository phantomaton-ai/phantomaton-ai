import { XMLParser } from 'fast-xml-parser';
import {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
} from './projects.js';

const runXml = (xml) => {
  const parser = new XMLParser({
    attributeNamePrefix : '',
    ignoreAttributes : false,
    textNodeName: 'textContent'
  });
  const doc = parser.parse(xml);
  console.log(doc);
  if (true) return '';

  const commandMap = {
    'list-projects': listProjects,
    'create-project': (project) => createProject(project),
    'list-project-files': (project) => listProjectFiles(project),
    'read-project-file': (project, file) => readProjectFile(project, file),
    'write-project-file': (project, file, content) => writeProjectFile(project, file, content),
  };

  const processNode = (node) => {
    const tagName = node.tagName.toLowerCase();
    const command = commandMap[tagName];
    if (typeof command === 'function') {
      const project = node.getAttribute('project');
      const file = node.getAttribute('file');
      const content = node.textContent.trim();
      const result = command(project, file, content);
      if (result) {
        const attributes = { project, file };
        const present = Object.keys(attributes).filter(a => attributes[a]);
        const attrs = present.map(a => `${a}="${attributes[a]}"`).join('\n');
        const tagOpen = attrs.length > 0 ? `${tagName} ${attrs}` : tagName;
        const tagClose = `/${tagClose}`;
        return `<${tagOpen}>\n${result}<${tagClose}>\n`
      }
    } else {
      console.error(`Unknown XML tag: ${tagName}`);
      return null;
    }
  };

  const result = Array.from(doc.documentElement.children).map(processNode);
  const nonempty = result.filter((r) => r !== null);
  return nonempty.length < 1 ? '' : nonempty.join('\n') + '\n\n---\n\n';
};

export { runXml };
