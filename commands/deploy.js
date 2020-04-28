const chalk = require('chalk')
const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');


exports.command = 'deploy <deploy_name>';
exports.desc = 'Deploy the Applications in the Production Server';
exports.builder = yargs => {
    yargs.options({
        deploy_name:{
            describe: 'Name of the job to be deployed',
            type: 'string'
        },
        inventory: {
            alias: 'i',
            describe: 'location of inventory file',
            type: 'string',
            default: 'inventory.ini',
            nargs: 1
        },
        vaultfile: {
            alias: 'vp',
            describe: 'Password file  for ansible-vault',
            type: 'string',
            default: 'pipeline/password/jenkins',
            nargs: 1
        },
	});
};

exports.handler = async argv => {
    const { deploy_name, inventory, vaultfile } = argv ;

    (async () => {

        if (deploy_name==="checkbox.io" || deploy_name==="iTrust") {
            await main(deploy_name,inventory,vaultfile);
        }
        else {
            console.error(`checkbox.io or iTrust`);
        }

    })();

};


async function main(deploy_name,inventory,vaultfile)
{   
    //assuming keys already installed

    console.log(chalk.blueBright(`Deploying Application ${deploy_name}...`));

    if(deploy_name==="checkbox.io"){

        let filePath = '/bakerx/pipeline/deploy_checkbox.yml';
        let inventoryPath = '/bakerx/'+inventory;	
        let vaultfilePath = '/bakerx/'+vaultfile;
        let result = sshSync(`ansible-playbook --vault-password-file ${vaultfilePath} ${filePath} -i ${inventoryPath}`, 'vagrant@192.168.33.10');
        if( result.error ) { process.exit( result.status ); }

    }
    else if (deploy_name==="iTrust"){
        console.log(chalk.blueBright('Deploying iTrust...'));
        result = sshSync('ansible-playbook /bakerx/pipeline/deploy_checkbox.yml -i /bakerx/inventory.ini', 'vagrant@192.168.33.10');
        if( result.error ) { console.log(result.error); process.exit( result.status ); }
 
    }

}