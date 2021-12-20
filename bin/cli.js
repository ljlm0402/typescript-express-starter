#!/usr/bin/env node

/*****************************************************************
 * Typescript Express Starter
 * 2019.12.18 ~ 🎮
 * Made By AGUMON 🦖
 * https://github.com/ljlm0402/typescript-express-starter
 *****************************************************************/

const path = require("path");
const starter = require("../lib/starter");
const destination = getDest(process.argv[2]);

function getDest(destFolder = "typescript-express-starter") {
  return path.join(process.cwd(), destFolder);
}

starter(destination);
