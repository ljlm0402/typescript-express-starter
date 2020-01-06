/*****************************************************************
 * Create new typescript-express-starter project.
 * created by Lim Kyungmin, 12/18/2019
 *****************************************************************/

const path = require('path');
const fs = require('fs');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const inquirer = require('inquirer');
const ncp = require('ncp').ncp;

async function tsExpressStarter(destination) {
  try {
    const directory = await fetchDirectory();
    await copyProjectFiles(destination, directory);
    updatePackageJson(destination);
    const dep = getDepStrings(directory);
    downloadNodeModules(destination, dep);
  } catch (err) {
    console.error(err);
  }
};

function getDirectorys() {
  let directorys = [];

  fs.readdirSync(__dirname, { withFileTypes: true })
  .forEach(p => {
    const dir = p.name;
    if (p.isDirectory()) {
      directorys.push(dir);
    }
  });

  return directorys;
};

async function fetchDirectory() {
  const directorys = getDirectorys();
  const directoryChoices = [...directorys, new inquirer.Separator()];
  const { selectedTemplates } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTemplates',
      message: 'Select a templates',
      choices: directoryChoices
    }
  ]);

  return selectedTemplates;
};

function copyProjectFiles(destination, directory) {
  const prjFolder = `./${directory}`;
  const source = path.join(__dirname, prjFolder);

  return new Promise((resolve, reject) => {
    ncp.limit = 16;
    ncp(source, destination, function(err) {
      if (err) reject(err);
      resolve();
    });
  });
};

function updatePackageJson(destination) {
  let file = editJsonFile(destination + "/package.json", { autosave: true });
  file.set("name", path.basename(destination));
};

function getDepStrings(directory) {
  let dependencies =
    'class-transformer class-validator cors envalid express helmet hpp jest morgan ts-jest ts-node typescript';
  let devDependencies =
    '@types/cors @types/express @types/helmet @types/hpp @types/jest @types/morgan @types/node @types/supertest supertest tslint tslint-config-airbnb';

  switch (directory) {
    case 'mongoose': {
        dependencies += ' mongoose dotenv';
        devDependencies += ' @types/mongoose';
      } break;
  }

  return { dependencies, devDependencies };
};

function downloadNodeModules(destination, dep) {
  const options = { cwd: destination };
  childProcess.execSync('npm i -s ' + dep.dependencies, options);
  childProcess.execSync('npm i -D ' + dep.devDependencies, options);
};

module.exports = tsExpressStarter;
