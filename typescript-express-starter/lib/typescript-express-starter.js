/*****************************************************************
 * Create new typescript-express-starter project.
 * created by Lim Kyungmin, 12/18/2019
 *****************************************************************/

const path = require('path');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;

async function tsExpressStarter(destination) {
    try {
        await copyProjectFiles(destination);
        updatePackageJson(destination);
        const dep = getDepStrings();
        downloadNodeModules(destination, dep);
    } catch (err) {
        console.error(err);
    }
}

function copyProjectFiles(destination) {
    const prjFolder = './default-folder';
    const source = path.join(__dirname, prjFolder);
    
    return new Promise((resolve, reject) => {
        ncp.limit = 16;
        ncp(source, destination, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    })
}

function updatePackageJson(destination) {
    let file = editJsonFile(destination + '/package.json', {
        autosave: true
    });
    file.set('name', path.basename(destination));
}

function getDepStrings() {
    const dependencies = 'class-transformer class-validator cors envalid express helmet hpp jest morgan ts-jest ts-node typescript';
    const devDependencies = '@types/cors @types/express @types/helmet @types/hpp @types/jest @types/morgan @types/node @types/supertest supertest tslint tslint-config-airbnb';
    return { dependencies, devDependencies };
}

function downloadNodeModules(destination, dep) {
    const options = {cwd: destination};
    childProcess.execSync('npm i -s ' + dep.dependencies, options);
    childProcess.execSync('npm i -D ' + dep.devDependencies, options);
}

module.exports = tsExpressStarter;
