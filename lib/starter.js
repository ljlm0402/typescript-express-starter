/*****************************************************************
 * Create new typescript-express-starter project.
 * By AGUMON <ljlm0402@gmail.com>
 * December 18, 2019.
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
const npm = require('./dependencies');

async function createProject(projectName) {
  let spinner;

  try {
    const template = await selectedTemplates();

    console.log('[ 1 / 3 ] 🔍  copying project...');
    console.log('[ 2 / 3 ] 🚚  fetching dependencies...');

    await copyProjectFiles(projectName, template);
    await updatePackageJson(projectName);
    const dependencies = await getDependencies(template);

    console.log('[ 3 / 3 ] 🔗  linking dependencies...');
    console.log('\u001b[2m──────────────\u001b[22m');

    spinner = ora('Install modules...\n');
    spinner.start();

    await installDependencies(projectName, dependencies, spinner);

    spinner.succeed(chalk`{green Complete setup project}`);
  } catch (error) {
    spinner.fail(chalk`{red Please leave this error as an issue}`);
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
    ncp(source, destination, function (err) {
      if (err) reject(err);
      resolve();
    });
  });
}

async function updatePackageJson(destination) {
  const file = editJsonFile(destination + '/package.json', { autosave: true });

  file.set('name', path.basename(destination));
}

async function getDependencies(directory) {
  switch (directory) {
    case 'mongoose': { // MongoDB
      npm.save += ' mongoose@5.10.1';
      npm.dev += ' @types/mongoose@5.10.1';
    } break;
    case 'sequelize': { // MySQL
      npm.save += ' mysql2 sequelize';
      npm.dev += ' @types/sequelize sequelize-cli';
    } break;
    case 'typeorm': { // PostgreSQL
      npm.save += ' pg typeorm reflect-metadata';
    } break;
  }

  return npm;
}

async function installDependencies(destination, { save, dev }, spinner) {
  const options = { cwd: destination };

  spinner.text = 'Install dependencies...';
  await asyncExec('npm i -s ' + save, options);

  spinner.text = 'Install devDependencies...';
  await asyncExec('npm i -D ' + dev, options);
}

module.exports = createProject;
