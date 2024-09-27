import { XMLParser } from 'fast-xml-parser';
import {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
  moveProjectFile,
  removeProjectFile,
  runNpmTest,
} from './projects.js';

const commandMap = {
  'list-projects': listProjects,
  'create-project': ({ project }) => createProject(project),
  'list-project-files': ({ project }) => listProjectFiles(project),
  'read-project-file': ({ project, file }) => readProjectFile(project, file),
  'write-project-file': ({ project, file }, content) => writeProjectFile(project, file, content),
  'move-project-file': ({ project, file, to }) => moveProjectFile(project, file, to),
  'remove-project-file': ({ project, file }) => removeProjectFile(project, file),
  'test-project': ({ project }) => runNpmTest(project),
};

// ... (other execute code)
