import {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
  moveProjectFile,
  removeProjectFile,
  testProject,
} from './projects.js';
import smarkup from './smarkup.js';

const commandMap = {
  'list-projects': listProjects,
  'create-project': ({ project }) => createProject(project),
  'list-project-files': ({ project }) => listProjectFiles(project),
  'read-project-file': ({ project, file }) => readProjectFile(project, file),
  'write-project-file': ({ project, file }, content) => writeProjectFile(project, file, content),
  'move-project-file': ({ project, file, to }) => moveProjectFile(project, file, to),
  'remove-project-file': ({ project, file }) => removeProjectFile(project, file),
  'test-project': ({ project }) => testProject(project),
};

const execute = (input) => {
  const separator = '\n\n---\n\n';

  try {
    const directives = smarkup.parse(input);
    const results = directives.map(({ action, attributes, body }) => {
      const command = commandMap[action];
      if (command) {
        const result = command(attributes, body);
        if (result) {
          return render([{ action, attributes, body }]);
        }
      }
    }).filter(result => result);

    return results.length < 1 ? '' : results.join('\n') + separator;
  } catch (e) {
    return `ERROR: ${e.message}${separator}`;
  }
};

export { execute };
