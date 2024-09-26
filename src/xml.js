import { XMLParser } from 'fast-xml-parser';
import {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
} from './projects.js';

const commandMap = {
  'list-projects': listProjects,
  'create-project': (project) => createProject(project),
  'list-project-files': (project) => listProjectFiles(project),
  'read-project-file': (project, file) => readProjectFile(project, file),
  'write-project-file': (project, file, content) => writeProjectFile(project, file, content),
};

const runXml = (xml) => {
  const parser = new XMLParser({
    attributeNamePrefix : '',
    ignoreAttributes: false,
    preserveOrder: true,
    textNodeName: 'text',
    stopNodes: Object.keys(commandMap)
  });

  const commands = parser.parse(xml).map(node => {
    const block = {};
    const ugh = ':@'
    const options = node[ugh];
    const tag = Object.keys(node).filter(k => k !== ugh)[0];
    const content = node[tag].map(({text}) => text.slice(1)).join('\n');
    const command = commandMap[tag];
    return { command, options, content, tag };
  }).filter(({ command }) => command);

  const results = commands.map(({ command, options, content, tag }) => {
    const { project, file } = options || {};
    const result = command(project, file, content);
    if (result) {
      const attributes = { project, file };
      const present = Object.keys(attributes).filter(a => attributes[a]);
      const attrs = present.map(a => `${a}="${attributes[a]}"`).join('\n');
      const tagOpen = attrs.length > 0 ? `${tag} ${attrs}` : tag;
      const tagClose = `/${tag}`;
      return `<${tagOpen}>\n${result}<${tagClose}>\n`
    }
  }).filter(result => result);

  return results.length < 1 ? '' : results.join('\n') + '\n\n---\n\n';
};

export { runXml };
