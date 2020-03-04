#!/usr/bin/env node

/*****************************************************************
 * Create new typescript-express-starter project.
 * By AGUMON <ljlm0402@gmail.com>
 * December 18, 2019.
 *****************************************************************/

const path = require('path');
const starter = require('../lib/starter');
const destination = getDest(process.argv[2]);

function getDest(destFolder) {
  destFolder = destFolder || 'typescript-express-starter';
  return path.join(process.cwd(), destFolder);
};

starter(destination);
