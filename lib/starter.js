/*****************************************************************
 * Create new typescript-express-starter project.
 * By AGUMON <ljlm0402@gmail.com>
 * December 18, 2019.
 *****************************************************************/

const chalk = require("chalk");
const { exec } = require("child_process");
const editJsonFile = require("edit-json-file");
const { createWriteStream, readdir } = require("fs");
const { writeFile } = require("gitignore");
const inquirer = require("inquirer");
const { ncp } = require("ncp");
const ora = require("ora");
const path = require("path");
const { promisify } = require("util");

const readDir = promisify(readdir);
const asyncExec = promisify(exec);
const writeGitignore = promisify(writeFile);

/**
 * @method createProject
 * @param {*} projectName
 * @description create Project
 */
const createProject = async (projectName) => {
  let spinner;

  try {
    const template = await selectedTemplates();

    console.log("[ 1 / 3 ] 🔍  copying project...");
    console.log("[ 2 / 3 ] 🚚  fetching dependencies...");

    await copyProjectFiles(projectName, template);
    await updatePackageJson(projectName);

    console.log("[ 3 / 3 ] 🔗  linking dependencies...");
    console.log(
      "\u001b[2m──────────────────────────────────────────\u001b[22m"
    );

    spinner = ora("Install dependencies...\n");
    spinner.start();

    await installDependencies(projectName);
    await postInstallScripts(projectName, template, spinner);

    await createGitignore(projectName, spinner);
    await initGit(projectName);

    await succedConsole(template, spinner);
  } catch (error) {
    spinner.fail(chalk`{red Please leave this error as an issue}`);
    console.error(error);
  }
};

/**
 *
 * @returns
 */
const selectedTemplates = async () => {
  const directories = await getDirectories();
  const { selectedTemplates } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTemplates",
      message: "Select a templates",
      choices: [...directories, new inquirer.Separator()],
    },
  ]);

  return selectedTemplates;
};

/**
 *
 * @returns
 */
const getDirectories = async () => {
  const contents = await readDir(__dirname, { withFileTypes: true });
  const directories = contents
    .filter((p) => p.isDirectory())
    .map((p) => p.name);

  return directories;
};

/**
 *
 * @param {*} destination
 * @param {*} directory
 * @returns
 */
const copyProjectFiles = async (destination, directory) => {
  const source = path.join(__dirname, `./${directory}`);

  return new Promise((resolve, reject) => {
    const options = {
      clobber: true, // overwrite dir
      stopOnErr: true,
    };

    ncp.limit = 16;
    ncp(source, destination, options, function (err) {
      if (err) reject(err);
      resolve();
    });
  });
};

/**
 *
 * @param {*} destination
 */
const updatePackageJson = async (destination) => {
  const file = editJsonFile(`${destination}/package.json`, { autosave: true });

  file.set("name", path.basename(destination));
};

/**
 *
 * @param {*} destination
 * @param {*} param1
 * @param {*} spinner
 */
const installDependencies = async (destination) => {
  const options = { cwd: destination };

  await asyncExec("npm install", options);
};

/**
 *
 * @param {*} destination
 * @param {*} template
 * @param {*} spinner
 */
const postInstallScripts = async (destination, template, spinner) => {
  const options = { cwd: destination };

  switch (template) {
    case "prisma":
      {
        spinner.text = "Run prisma generate...";
        await asyncExec("./node_modules/.bin/prisma generate", options);
      }
      break;
  }
};

/**
 *
 * @param {*} destination
 * @param {*} spinner
 * @returns
 */
const createGitignore = async (destination, spinner) => {
  spinner.text = "Create .gitignore...";

  const file = createWriteStream(path.join(destination, ".gitignore"), {
    flags: "a",
  });

  return writeGitignore({
    type: "Node",
    file: file,
  });
};

/**
 *
 * @param {*} destination
 */
const initGit = async (destination) => {
  const options = { cwd: destination };
  await asyncExec("git init", options);
};

const succedConsole = async (template, spinner) => {
  spinner.succeed(chalk`{green Complete setup project}`);

  switch (template) {
    case "prisma":
      {
        console.log(
          "⛰ Prisma installed. Check your .env settings and then run `npm run prisma:migrate`"
        );
      }
      break;
  }
};

module.exports = createProject;
