/*****************************************************************
 * Create new typescript-express-starter project.
 * created by Lim Kyungmin, 12/18/2019
 *****************************************************************/

const path = require('path');
const fs = require('fs');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');

async function tsExpressStarter(projectName) {
  try {
    const template = await selectedTemplates();
    await copyProjectFiles(projectName, template);
    updatePackageJson(projectName);
    const dependencies = getDependencies(template);
    installDependencies(projectName, dependencies);
    ora(`${chalk.green('Complete setup project')}`).succeed();
  } catch (error) {
    ora(chalk.red('Please leave this error as an issue.')).fail();
    console.error(error);
  }
};

async function selectedTemplates() {
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

function copyProjectFiles(destination, directory) {
  ora(' copying project...').stopAndPersist({ symbol: '[ 1 / 3 ] 🔍 '});

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

function getDependencies(directory) {
  ora(' fetching dependencies...').stopAndPersist({ symbol: '[ 2 / 3 ] 🚚 '});

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

function installDependencies(destination, { dependencies, devDependencies }) {
  ora(' linking dependencies...').stopAndPersist({ symbol: '[ 3 / 3 ] 🔗 '});
  
  const options = { cwd: destination };
  childProcess.execSync('npm i -s ' + dependencies, options);
  childProcess.execSync('npm i -D ' + devDependencies, options);
};

module.exports = tsExpressStarter;
