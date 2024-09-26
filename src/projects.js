import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const PROJECT_DIR = 'data/projects';

const listProjects = () => {
  const projects = fs.readdirSync(PROJECT_DIR);
  return projects;
};

const createProject = (projectName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  fs.mkdirSync(projectPath, { recursive: true });
  exec(`git init ${projectPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating project: ${error}`);
      return;
    }
  });
};

const listProjectFiles = (projectName) => {
  const projectPath = path.join(PROJECT_DIR, projectName);
  const files = fs.readdirSync(projectPath);
  return files;
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
};

export {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
};
