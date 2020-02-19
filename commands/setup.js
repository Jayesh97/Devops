const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const fs = require('fs');

const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');

exports.command = 'setup';
exports.desc = 'Configures Jenkins and build Environment';
exports.builder = yargs => {
    yargs.options({
        privateKey: {
            describe: 'Install the provided private key on the configuration server',
            type: 'string'
        },
        username: {
            alias: 'u',
            describe: 'Username',
            type: 'string',
            default: 'admin',
            nargs: 1
        },
        password: {
            alias: 'p',
            describe: 'Password',
            type: 'string',
            default: 'admin',
            nargs: 1
        },
        vaultfilePath: {
            alias: 'vp',
            describe: 'Password file  for ansible-vault',
            type: 'string',
            default: 'pipeline/password/jenkins',
            nargs: 1
        }
    });
};


exports.handler = async argv => {
    const { privateKey, username, password, vaultfilePath } = argv;

    (async () => {

        await run( privateKey );
        await jenkins_setup('pipeline/playbook.yml', 'pipeline/inventory.ini', username, password, vaultfilePath);

    })();

};

async function run(privateKey) {

    console.log(chalk.greenBright('Installing configuration server!'));

    console.log(chalk.blueBright('Provisioning configuration server...'));
    let result = child.spawnSync(`bakerx`, `run ansible-srv bionic --ip 192.168.33.10 --sync`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Provisioning jenkins server...'));
    result = child.spawnSync(`bakerx`, `run jenkins-srv bionic --ip 192.168.33.20`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Installing privateKey on configuration server'));
    let identifyFile = privateKey || path.join(os.homedir(), '.bakerx', 'insecure_private_key');
    result = scpSync (identifyFile, 'vagrant@192.168.33.10:/home/vagrant/.ssh/jk_rsa');
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Running init script...'));
    result = sshSync('/bakerx/pipeline/server-init.sh', 'vagrant@192.168.33.10');
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

}

async function jenkins_setup(file, inventory, username, password, vaultfilePath) {
    // the paths should be from root of cm directory
    // Transforming path of the files in host to the path in VM's shared folder
    let filePath = '/bakerx/'+ file;
    let inventoryPath = '/bakerx/' +inventory;	
    vaultfilePath = '/bakerx/'+ vaultfilePath;
    console.log(chalk.blueBright('Running ansible script...'));
    let result = sshSync(`/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath} ${username} ${password} ${vaultfilePath}`, 'vagrant@192.168.33.10');
    if( result.error ) { process.exit( result.status ); }

}
