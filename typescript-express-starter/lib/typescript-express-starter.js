/*****************************************************************
 * Create new typescript-express-starter project.
 * created by Lim Kyungmin, 12/18/2019
 *****************************************************************/

const path = require('path');
const { readdir } = require('fs').promises;
const editJsonFile = require('edit-json-file');
const { exec } = require('child_process');
const ncp = require('ncp').ncp;
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const { promisify } = require('util');
const asyncExec = promisify(exec);

async function tsExpressStarter(projectName) {
  let spinner = null;
  try {
    const template = await selectedTemplates();

    spinner = ora('Setting up new Typescript Express Starter Project\n');
    spinner.start();

    await copyProjectFiles(projectName, template);
    await updatePackageJson(projectName);

    const dependencies = await getDependencies(template);
    await installDependencies(projectName, dependencies);

    spinner.succeed(chalk`{green Complete setup project}`);
  } catch (error) {
    spinner.fail(chalk`{red Please leave this error as an issue.}`);
    console.error(error);
  }
}

async function selectedTemplates() {
  const directories = await getDirectories();
  const directoryChoices = [...directories, new inquirer.Separator()];
  const { selectedTemplates } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTemplates',
      message: 'Select a templates',
      choices: directoryChoices,
    },
  ]);

  return selectedTemplates;
}

async function getDirectories() {
  const contents = await readdir(__dirname, { withFileTypes: true });
  const directories = contents.filter(p => p.isDirectory()).map(p => p.name);

  return directories;
}

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
}

async function updatePackageJson(destination) {
  let file = editJsonFile(destination + '/package.json', { autosave: true });
  file.set('name', path.basename(destination));
}

async function getDependencies(directory) {
  let dependencies =
    'class-transformer class-validator cors envalid express helmet hpp jest morgan ts-jest ts-node typescript';
  let devDependencies =
    '@types/cors @types/express @types/helmet @types/hpp @types/jest @types/morgan @types/node @types/supertest supertest tslint tslint-config-airbnb';

  switch (directory) {
    case 'mongoose':
      {
        dependencies += ' mongoose dotenv';
        devDependencies += ' @types/mongoose';
      }
      break;
  }

  return { dependencies, devDependencies };
}

async function installDependencies(
  destination,
  { dependencies, devDependencies },
) {
  const options = { cwd: destination };
  await asyncExec('npm i -s ' + dependencies, options);
  await asyncExec('npm i -D ' + devDependencies, options);
}

module.exports = tsExpressStarter;
