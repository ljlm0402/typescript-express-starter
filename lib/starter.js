/*****************************************************************
 * Create Typescript Express Starter
 * 2019.12.18 ~ 🎮
 * Made By AGUMON 🦖
 * https://github.com/ljlm0402/typescript-express-starter
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
 * @description Create a project
 */
const createProject = async (projectName) => {
  let spinner;

  try {
    const template = await chooseTemplates();
    const isUpdated = await dependenciesUpdates();
    const isDeduped = await dependenciesDeduped();

    console.log("[ 1 / 3 ] 🔍  copying project...");
    console.log("[ 2 / 3 ] 🚚  fetching node_modules...");

    await copyProjectFiles(projectName, template);
    await updatePackageJson(projectName);

    console.log("[ 3 / 3 ] 🔗  linking node_modules...");
    console.log(
      "\u001b[2m──────────────────────────────────────────\u001b[22m"
    );

    spinner = ora();
    spinner.start();

    await installNodeModules(projectName, spinner);
    isUpdated && (await updateNodeModules(projectName, spinner));
    isDeduped && (await dedupeNodeModules(projectName, spinner));
    await postInstallScripts(projectName, template, spinner);

    await createGitignore(projectName, spinner);
    await initGit(projectName);

    await succeedConsole(template, spinner);
  } catch (error) {
    await failConsole(error, spinner);
  }
};

/**
 * @method getDirectories
 * @description Get the templates directory.
 */
const getTemplateDir = async () => {
  const contents = await readDir(__dirname, { withFileTypes: true });
  const directories = contents
    .filter((p) => p.isDirectory())
    .map((p) => p.name);

  return directories;
};

/**
 * @method chooseTemplates
 * @description Choose a template.
 */
const chooseTemplates = async () => {
  const directories = await getTemplateDir();
  const { chooseTemplates } = await inquirer.prompt([
    {
      type: "list",
      name: "chooseTemplates",
      message: "Please select the template you want",
      choices: [...directories, new inquirer.Separator()],
    },
  ]);

  return chooseTemplates;
};

/**
 * @method dependenciesUpdates
 * @description npm dependencies updated.
 */
const dependenciesUpdates = async () => {
  const { isUpdated } = await inquirer.prompt([
    {
      type: "confirm",
      name: "isUpdated",
      message:
        "Do you want to update all packages in the node_modules directory and dependency ?",
    },
  ]);

  if (isUpdated) {
    const { isUpdatedReconfirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "isUpdatedReconfirm",
        message:
          "However, updating to the latest version may cause package dependency issues. Do you still want to update ?",
      },
    ]);

    return isUpdatedReconfirm;
  }

  return false;
};

/**
 * @method dependenciesDeduped
 * @description npm duplicate dependencies removed.
 */
const dependenciesDeduped = async () => {
  const { isDeduped } = await inquirer.prompt([
    {
      type: "confirm",
      name: "isDeduped",
      message: "Do you want to Used to removed duplicate packages at npm ?",
    },
  ]);

  return isDeduped;
};

/**
 * @method copyProjectFiles
 * @description Duplicate the template.
 */
const copyProjectFiles = async (destination, directory) => {
  return new Promise((resolve, reject) => {
    const source = path.join(__dirname, `./${directory}`);
    const options = {
      clobber: true,
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
 * @method updatePackageJson
 * @description Edit package.json.
 */
const updatePackageJson = async (destination) => {
  const file = editJsonFile(`${destination}/package.json`, { autosave: true });

  file.set("name", path.basename(destination));
};

/**
 * @method installNodeModules
 * @description Install node modules.
 */
const installNodeModules = async (destination, spinner) => {
  spinner.text = "Install node_modules...\n";
  await asyncExec("npm install --legacy-peer-deps", { cwd: destination });
};

/**
 * @method updateNodeModules
 * @description Update node modules.
 */
const updateNodeModules = async (destination, spinner) => {
  spinner.text = "Update node_modules...\n";
  await asyncExec("npm update --legacy-peer-deps", { cwd: destination });
};

/**
 * @method dedupeNodeModules
 * @description Dedupe node modules.
 */
const dedupeNodeModules = async (destination, spinner) => {
  spinner.text = "Dedupe node_modules...\n";
  await asyncExec("npm dedupe --legacy-peer-deps", { cwd: destination });
};

/**
 * @method postInstallScripts
 * @description After installation, configure the settings according to the template.
 */
const postInstallScripts = async (destination, template, spinner) => {
  switch (template) {
    case "prisma":
      {
        spinner.text = "Run prisma generate...";
        await asyncExec("npm run prisma:generate", { cwd: destination });
      }
      break;
  }
};

/**
 * @method createGitignore
 * @description Create a .gitignore.
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
 * @method initGit
 * @description Initialize git settings.
 */
const initGit = async (destination) => {
  await asyncExec("git init", { cwd: destination });
};

/**
 * @method succeedConsole
 * @description When the project is successful, the console is displayed.
 */
const succeedConsole = async (template, spinner) => {
  spinner.succeed(chalk`{green Complete setup project}`);

  switch (template) {
    case "prisma":
      {
        console.log(
          "⛰ Prisma installed. Check your .env settings and then run `npm run prisma:migrate`"
        );
      }
      break;
    case "knex":
      {
        console.log(
          "⛰ Knex installed. Check your .env settings and then run `npm run migrate`"
        );
      }
      break;
  }
};

/**
 * @method failConsole
 * @description When the project is fail, the console is displayed.
 */
const failConsole = async (error, spinner) => {
  spinner.fail(chalk`{red Please leave this error as an issue}`);
  console.error(error);
};

module.exports = createProject;
