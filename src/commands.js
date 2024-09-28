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

const commands = [
  {
    name: 'listProjects',
    command: listProjects,
    example: {}
  },
  {
    name: 'createProject',
    command: ({ project }) => createProject(project),
    example: {
      options: {
        project: 'my-project'
      }
    }
  },
  {
    name: 'listProjectFiles',
    command: ({ project }) => listProjectFiles(project),
    example: {
      options: {
        project: 'my-project'
      }
    }
  },
  {
    name: 'readProjectFile',
    command: ({ project, file }) => readProjectFile(project, file),
    example: {
      options: {
        project: 'my-project',
        file: 'example.txt'
      }
    }
  },
  {
    name: 'writeProjectFile',
    command: ({ project, file }, content) => writeProjectFile(project, file, content),
    example: {
      options: {
        project: 'my-project',
        file: 'example.txt'
      },
      body: 'This is the content of the example.txt file.'
    }
  },
  {
    name: 'moveProjectFile',
    command: ({ project, file, to }) => moveProjectFile(project, file, to),
    example: {
      options: {
        project: 'my-project',
        file: 'example.txt',
        to: 'new-example.txt'
      }
    }
  },
  {
    name: 'removeProjectFile',
    command: ({ project, file }) => removeProjectFile(project, file),
    example: {
      options: {
        project: 'my-project',
        file: 'example.txt'
      }
    }
  },
  {
    name: 'testProject',
    command: ({ project }) => testProject(project),
    example: {
      options: {
        project: 'my-project'
      }
    }
  }
];

const commandMap = commands.reduce((map, { name, command }) => {
  map[name] = command;
  return map;
}, {});

export { commands, commandMap };
