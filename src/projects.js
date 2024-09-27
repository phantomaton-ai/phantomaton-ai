import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_DIR = 'data/projects';

// ... (other project management functions)

const runNpmTest = (projectName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  try {
    execSync(`npm test`, { cwd: projectPath, stdio: 'inherit' });
    return 'NPM test completed.';
  } catch (error) {
    return `Error running NPM test: ${error}`;
  }
};

export {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
  moveProjectFile,
  removeProjectFile,
  runNpmTest,
};
