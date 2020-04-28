const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');

const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');

exports.command = 'canary <blue_branch> <green_branch>';
exports.desc = 'Provision and configure the blue-green servers';
exports.builder = yargs => {
    yargs.options({
        privateKey: {
            describe: 'Install the provided private key on the configuration server',
            type: 'string'
        },
        blue_branch: {
            describe: 'Spawn a setup/perform master-master/master-broken',
            type: 'string',
            default: 'master'
        },
        green_branch: {
            describe: 'Branch to be cloned in green',
            type: 'string',
            default: 'broken'
        }
    });
};


exports.handler = async argv => {
    const { privateKey,blue_branch,green_branch } = argv;

    (async () => {

        await run( privateKey,blue_branch,green_branch );

    })();

};

async function setup_infra(privateKey,blue_branch,green_branch){

    console.log(chalk.greenBright('Setting up production environment!'));

    //In assignment proxy was local, so make it look like local so you can sync the folders and perform the functions from local
    // console.log(chalk.blueBright('Provisioning proxy server...'));
    // let result = child.spawnSync(`bakerx`, `run proxy queues --ip 192.168.44.100 --sync`.split(' '), {shell:true, stdio: 'inherit'} );
    // if( result.error ) { console.log(result.error); process.exit( result.status ); }

    // console.log(chalk.blueBright('Provisioning blue server...'));
    // result = child.spawnSync(`bakerx`, `run blue queues --ip 192.168.44.25`.split(' '), {shell:true, stdio: 'inherit'} );
    // if( result.error ) { console.log(result.error); process.exit( result.status ); }

    // console.log(chalk.blueBright('Provisioning red server...'));
    // result = child.spawnSync(`bakerx`, `run red queues --ip 192.168.44.30`.split(' '), {shell:true, stdio: 'inherit'} );
    // if( result.error ) { console.log(result.error); process.exit( result.status ); }

    // console.log(chalk.blueBright('Installing privateKey on proxy server'));
    // let identifyFile = privateKey || path.join(os.homedir(), '.bakerx', 'insecure_private_key');
    // result = scpSync (identifyFile, 'vagrant@192.168.44.100:/home/vagrant/.ssh/jk_rsa');
    // if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Running init script in proxy server...'));
    result = sshSync('/bakerx/pipeline/server-init.sh', 'vagrant@192.168.44.100');
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    let filePath = '/bakerx/canary/playbook_canary.yml';
    let inventoryPath = '/bakerx/canary/inventory.ini';	
    let vaultfilePath = '/bakerx/pipeline/password/jenkins';
    console.log(chalk.blueBright('Running ansible script...'));
    result = sshSync(`ansible-playbook --vault-password-file ${vaultfilePath} ${filePath} -i ${inventoryPath}`, 'vagrant@192.168.44.100')
    if( result.error ) { process.exit( result.status ); }

}

async function clone_repos(blue_branch,green_branch){

    console.log(chalk.blueBright(`Cloning master branch in blue VM`));
    let result = sshSync(`rm -rf checkbox.io-micro-preview`,'vagrant@192.168.44.25')
    result = sshSync(`git clone --single-branch --branch ${blue_branch} https://github.com/chrisparnin/checkbox.io-micro-preview.git`, 'vagrant@192.168.44.25');
    if( result.error ) { process.exit( result.status ); }

    console.log(chalk.blueBright(`Cloning broken branch in red VM`));
    result = sshSync(`rm -rf checkbox.io-micro-preview`,'vagrant@192.168.44.30')
    result = sshSync(`git clone --single-branch --branch ${green_branch} https://github.com/chrisparnin/checkbox.io-micro-preview.git`, 'vagrant@192.168.44.30');
    if( result.error ) { process.exit( result.status ); }


}

async function run(privateKey,blue_branch,green_branch) {

    await setup_infra(privateKey);
    // await clone_repos(blue_branch,green_branch);

}