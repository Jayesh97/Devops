
const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const fs = require('fs');

const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');

//https://www.npmjs.com/package/yargs-parser

exports.command = 'setup';
exports.desc = 'Configures Jenkins and build Environment';
exports.builder = yargs => {
    yargs.options({
        privateKey: {
            describe: 'Install the provided private key on the configuration server',
            type: 'string'
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
    const { privateKey, vaultfilePath} = argv;

    (async () => {

        //await run( privateKey );
        if (fs.existsSync(path.resolve('pipeline/playbook_setup.yml')) && fs.existsSync(path.resolve('pipeline/inventory.ini'))) {
            await jenkins_setup('pipeline/playbook_setup.yml', 'pipeline/inventory.ini', vaultfilePath);
        }

        else {
            console.error(`File or inventory don't exist. Make sure to provide path from root of pipeline directory`);
        }

    })();

};

async function run(privateKey) {

    console.log(chalk.greenBright('Installing configuration server!'));

    console.log(chalk.blueBright('Provisioning configuration server...'));
    let result = child.spawnSync(`bakerx`, `run ansible-srv bionic --ip 192.168.33.10 --sync`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Provisioning jenkins server...'));
    result = child.spawnSync(`bakerx`, `run jenkins-srv bionic --ip 192.168.33.20 --memory 2048`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Installing privateKey on configuration server'));
    let identifyFile = privateKey || path.join(os.homedir(), '.bakerx', 'insecure_private_key');
    result = scpSync (identifyFile, 'vagrant@192.168.33.10:/home/vagrant/.ssh/jk_rsa');
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Running init script...'));
    result = sshSync('/bakerx/pipeline/server-init.sh', 'vagrant@192.168.33.10');
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

}

async function jenkins_setup(file, inventory, vaultfilePath) {
    // the paths should be from root of pipeline directory
    // Transforming path of the files in host to the path in VM's shared folder
    let filePath = '/bakerx/'+ file;
    let inventoryPath = '/bakerx/' +inventory;	
    vaultfilePath = '/bakerx/'+ vaultfilePath;
    console.log(chalk.blueBright('Running ansible script...'));
    let result = sshSync(`/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath} ${vaultfilePath}`, 'vagrant@192.168.33.10');
    if( result.error ) { process.exit( result.status ); }
}
