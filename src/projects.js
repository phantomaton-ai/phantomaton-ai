import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_DIR = 'data/projects';
const GIT_IGNORE = ['node_modules']

const listProjects = () => {
  const projects = fs.readdirSync(PROJECT_DIR);
  return projects.join('\n');
};

const createProject = (projectName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  console.log("Creating " + projectPath);
  fs.mkdirSync(projectPath, { recursive: true });
  try {
    execSync(`git init ${projectPath}`);
    execSync(`git -C ${projectPath} config --local user.name phantomaton`);
    execSync(`git -C ${projectPath} config --local user.email 182378863+phantomaton-ai@users.noreply.github.com`);
    execSync(`pushd ${projectPath}; npm init; npm i chai mocha; popd ${projectPath}`)
    fs.writeFileSync(path.join(projectPath, '.gitignore'), GIT_IGNORE.join('\n'));
    execSync(`git -C ${projectPath} commit -m "Updated by Phantomaton"`);
    return 'Project created.';
  } catch (error) {
    return `Error creating project: ${error}`;
  }
};

const listProjectFiles = (projectName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  const files = fs.readdirSync(projectPath);
  return files.join('\n');
};

const readProjectFile = (projectName, fileName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  const filePath = path.join(projectPath, fileName);
  return fs.readFileSync(filePath, 'utf-8');
};

const writeProjectFile = (projectName, fileName, content) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  const filePath = path.join(projectPath, fileName);
  fs.writeFileSync(filePath, content);
  try {
    execSync(`git -C ${projectPath} add ${fileName}`);
    execSync(`git -C ${projectPath} commit -m "Updated by Phantomaton"`);
  } catch (error) {
    return `Error committing file: ${error}`;
  }
  return 'File written.';
};

const moveProjectFile = (projectName, sourceFileName, destinationFileName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  const sourceFilePath = path.join(projectPath, sourceFileName);
  const destinationFilePath = path.join(projectPath, destinationFileName);
  try {
    execSync(`git -C ${projectPath} mv ${sourceFileName} ${destinationFileName}`);
    execSync(`git -C ${projectPath} commit -m "Moved file by Phantomaton"`);
  } catch (error) {
    return `Error moving file: ${error}`;
  }
  return 'File moved.';
};

const removeProjectFile = (projectName, fileName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  const filePath = path.join(projectPath, fileName);
  try {
    execSync(`git -C ${projectPath} rm ${fileName}`);
    execSync(`git -C ${projectPath} commit -m "Removed file by Phantomaton"`);
  } catch (error) {
    return `Error removing file: ${error}`;
  }
  return 'File removed.';
};

const testProject = (projectName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  try {
    const output = execSync(`npm test`, { cwd: projectPath, stdio: 'pipe' });
    return `NPM test completed:\n${output.toString()}`;
  } catch (error) {
    return `Error running NPM test:\n${error.stdout.toString()}\n${error.stderr.toString()}`;
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
  testProject,
};
