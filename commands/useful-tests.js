const child = require('child_process');
const chalk = require('chalk');
const sshSync = require('../lib/ssh');

exports.command = 'useful-tests';
exports.desc = 'Initiate analysis of test suite for iTrust to run `-c` numbers of times';
exports.builder = yargs => {
    yargs.options({
        c: {
            describe: 'Number of times to iterate',
            default: 100
        }

    });
};

exports.handler = async argv => {
    const { c } = argv;
    (async () => {
        testAnalysis(c)
    })();

};

async function testAnalysis(c) {
    console.log(chalk.blueBright(`Running Useful tests for ${c} time(s)...`));
    let result = sshSync(`node main.js ${c}`, 'vagrant@192.168.33.20');
    if( result.error ) { process.exit( result.status ); }

}