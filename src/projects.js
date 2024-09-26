import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_DIR = 'data/projects';

const listProjects = () => {
  const projects = fs.readdirSync(PROJECT_DIR);
  return projects.join('\n');
};

const createProject = (projectName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  fs.mkdirSync(projectPath, { recursive: true });
  try {
    execSync(`git init ${projectPath}`);
    execSync(`git -C ${projectPath} commit --allow-empty -m "Updated by Phantomaton"`);
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

export {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
};
