/*****************************************************************
 * Create new typescript-express-starter project.
 * By AGUMON <ljlm0402@gmail.com>
 * December 18, 2019.
 *****************************************************************/

const path = require("path");
const { readdir } = require("fs").promises;
const editJsonFile = require("edit-json-file");
const { exec } = require("child_process");
const ncp = require("ncp").ncp;
const inquirer = require("inquirer");
const ora = require("ora");
const chalk = require("chalk");
const { promisify } = require("util");
const asyncExec = promisify(exec);
const npm = require("./dependencies");

async function createProject(projectName) {
  let spinner;

  try {
    const template = await selectedTemplates();

    console.log("[ 1 / 3 ] 🔍  copying project...");
    console.log("[ 2 / 3 ] 🚚  fetching dependencies...");

    await copyProjectFiles(projectName, template);
    await updatePackageJson(projectName);
    const dependencies = await getDependencies(template);

    console.log("[ 3 / 3 ] 🔗  linking dependencies...");
    console.log(
      "\u001b[2m──────────────────────────────────────────\u001b[22m"
    );

    spinner = ora("Install node_modules...\n");
    spinner.start();

    await installDependencies(projectName, dependencies, spinner);
    await postInstallScripts(projectName, template, spinner);

    spinner.succeed(chalk`{green Complete setup project}`);

    await succedConsole(template);
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
      type: "list",
      name: "selectedTemplates",
      message: "Select a templates",
      choices: directoryChoices,
    },
  ]);

  return selectedTemplates;
}

async function getDirectories() {
  const contents = await readdir(__dirname, { withFileTypes: true });
  const directories = contents
    .filter((p) => p.isDirectory())
    .map((p) => p.name);

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
  const file = editJsonFile(destination + "/package.json", { autosave: true });

  file.set("name", path.basename(destination));
}

async function getDependencies(directory) {
  switch (directory) {
    case "mongoose":
      {
        npm.save += " mongoose@5.10.1";
        npm.dev += " @types/mongoose@5.10.1";
      }
      break;
    case "sequelize":
      {
        npm.save += " mysql2 sequelize";
        npm.dev += " @types/sequelize sequelize-cli";
      }
      break;
    case "typeorm":
      {
        npm.save += " pg reflect-metadata typeorm";
      }
      break;
    case "prisma":
      {
        npm.save += " @prisma/client";
        npm.dev += " prisma";
      }
      break;
    case "knex":
      {
        npm.save += " knex mysql2";
        npm.dev += " @types/knex";
      }
      break;
  }

  return npm;
}

async function installDependencies(
  destination,
  { global, save, dev },
  spinner
) {
  const options = { cwd: destination };

  if (save) {
    spinner.text = "Install node_modules...";
    await asyncExec("npm i -s " + save, options);
  }

  if (dev) {
    spinner.text = "Install develop node_modules...";
    await asyncExec("npm i -D " + dev, options);
  }

  if (global) {
    spinner.text = "Install global node_modules...";
    await asyncExec("npm i -g " + global, options);
  }
}

async function postInstallScripts(destination, template, spinner) {
  const options = { cwd: destination };

  switch (template) {
    case "prisma":
      {
        spinner.text = "Run prisma generate...";
        await asyncExec("./node_modules/.bin/prisma generate", options);
      }
      break;
  }
}

async function succedConsole(template) {
  switch (template) {
    case "prisma":
      {
        console.log(
          "⛰ Prisma installed. Check your .env settings and then run `npm run prisma:migrate`"
        );
      }
      break;
  }
}

module.exports = createProject;
