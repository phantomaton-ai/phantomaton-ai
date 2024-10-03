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
    example: {},
    description: 'Lists all available projects.'
  },
  {
    name: 'createProject',
    command: ({ project }) => createProject(project),
    example: {
      options: {
        project: 'my-project'
      }
    },
    description: 'Creates a new project with the specified name.'
  },
  {
    name: 'listProjectFiles',
    command: ({ project }) => listProjectFiles(project),
    example: {
      options: {
        project: 'my-project'
      }
    },
    description: 'Lists all files in the specified project.'
  },
  {
    name: 'readProjectFile',
    command: ({ project, file }) => readProjectFile(project, file),
    example: {
      options: {
        project: 'my-project',
        file: 'example.txt'
      }
    },
    description: 'Reads the contents of the specified file in the specified project.'
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
    },
    description: 'Writes the provided content to the specified file in the specified project.'
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
    },
    description: 'Moves the specified file in the specified project to a new name.'
  },
  {
    name: 'removeProjectFile',
    command: ({ project, file }) => removeProjectFile(project, file),
    example: {
      options: {
        project: 'my-project',
        file: 'example.txt'
      }
    },
    description: 'Removes the specified file from the specified project.'
  },
  {
    name: 'testProject',
    command: ({ project }) => testProject(project),
    example: {
      options: {
        project: 'my-project'
      }
    },
    description: 'Tests the specified project by running any available tests.'
  }
];

const commandMap = commands.reduce((map, { name, command }) => {
  map[name] = command;
  return map;
}, {});

export { commands, commandMap };
