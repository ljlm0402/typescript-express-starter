#!/usr/bin/env node

/*****************************************************************
 * Create new typescript-express-starter project.
 * created by Lim Kyungmin, 12/18/2019
 *****************************************************************/

const path = require('path');
const tsExpressStarter = require('../lib/typescript-express-starter');
const destination = getDest(process.argv[2]);

function getDest(destFolder) {
  destFolder = destFolder || 'typescript-express-starter';
  return path.join(process.cwd(), destFolder);
};

tsExpressStarter(destination);
