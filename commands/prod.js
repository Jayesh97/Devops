const got    = require("got");
const chalk  = require('chalk');
const os     = require('os');
const sshSync = require('../lib/ssh');
const scpSync = require('../lib/scp');
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

//863337ecf88f8733fc43913b5c7592a6dcb0b27586b1b5d23dccd1b6cd80bd25

exports.command = 'prod <action>';
exports.desc = 'Provision cloud instances and control plane.';
exports.builder = yargs => {
    yargs.options({
        action:{
            describe: "Action on infra \'up\' or \'destroy\'",
            type: 'string',
            default: 'up'
        }
	});
};

var config = {};
config.token = process.env.DOTOKEN;

if( !config.token )
{
	console.log(chalk`{red.bold DOTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

// console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));

const headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

class DigitalOceanProvider
{
    async createKey()
    {
        var publicKey = ""
        if (fs.existsSync(path.resolve(`${process.env.HOME}/.ssh/DEVOPS-04.pub`))) {
            publicKey = fs.readFileSync(`${process.env.HOME}/.ssh/DEVOPS-04.pub`, 'utf8');
        }
        else {
            console.log("Key doesn't exist")
            return;
        }

        var data = 
		{
			"name":"DEVOPS-04",
			"public_key": publicKey
		};

        // console.log("Attempting to create key "+ JSON.stringify(data) );
        
        let keyResponse = await got('https://api.digitalocean.com/v2/account/keys',
        {
            headers: headers,
            json:true
        }).catch(err => console.error(`checkKey: ${err}`));

        if (keyResponse) {
            let sshKeys = keyResponse.body.ssh_keys;
            for(let key of sshKeys)
            {
                if (key.name === 'DEVOPS-04') {
                    console.log("Key exists on Digital Ocean");
                    return key.id;
                }
            }
        }

		let response = await got.post("https://api.digitalocean.com/v2/account/keys", 
		{
		 	headers:headers,
		 	json:true,
		 	body: data
		}).catch( err => 
		 	console.error(chalk.red(`createKey: ${err}`)) 
		);

        if( !response ) return;
         
		if(response.statusCode == 201)
		{
            console.log("Created key on Digital Ocean");
            return response.body.ssh_key.id;
		}
    }

	async createDroplet (dropletName, region, imageName, keyID )
	{
		if( dropletName == "" || region == "" || imageName == "" )
		{
			console.log( chalk.red("You must provide non-empty parameters for createDroplet!") );
			return;
        }
        
        let dropletResponse = await got('https://api.digitalocean.com/v2/droplets',
        {
            headers: headers,
            json:true
        }).catch(err => console.error(`checkDroplet: ${err}`));
        let droplets = dropletResponse.body.droplets;
        if (droplets != []) {
            for(let drop of droplets)
            {
                if (drop.name === dropletName) {
                    console.log(`${dropletName} Droplet exists on Digital Ocean`);
                    return drop.id;
                }
            }
        }
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			"ssh_keys":keyID,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		// console.log("Attempting to create droplet: "+ JSON.stringify(data) );

		let response = await got.post("https://api.digitalocean.com/v2/droplets", 
		{
		 	headers:headers,
		 	json:true,
		 	body: data
		 }).catch( err => 
		 	console.error(chalk.red(`createDroplet: ${err}`)) 
		 );

         if( !response ) return;
         
		if(response.statusCode == 202)
		{
            // console.log(response.body.droplet.id);
            return response.body.droplet.id
		}
	}

	async dropletInfo (id)
	{
		if( typeof id != "number" )
		{
			console.log( chalk.red("You must provide an integer id for your droplet!") );
			return;
        }
        
        var ipAddress = "";

        do {
            let response = await got('https://api.digitalocean.com/v2/droplets/'+id, { headers: headers, json:true }).catch(err => console.error(`dropletInfo ${err}`));

            if( !response ) return;
            if( response.body.droplet )
            {
                let droplet = response.body.droplet;
                for(let ip of droplet.networks.v4)
                {
                    ipAddress = ip.ip_address;
                    console.log(`IP Address of the ${droplet.name}: ${ipAddress}`)
                    return ipAddress;
                }
            }
            await sleep(5000);

        } while (!ipAddress);	
    }
    
    async deleteDroplet(id)
	{
		if( typeof id != "number" )
		{
			console.log( chalk.red("You must provide an integer id for your droplet!") );
			return;
		}

		// HINT, use the DELETE verb.
		let response = await got.delete(`https://api.digitalocean.com/v2/droplets/${id}`, {headers:headers,json:true})
		.catch( err => 
			console.error(chalk.red(`DeleteDroplets: ${err}`)) 
		);

		if( !response ) return;

		// No response body will be sent back, but the response code will indicate success.
		// Specifically, the response code will be a 204, which means that the action was successful with no returned body data.
		if(response.statusCode == 204)
		{
			console.log(`Deleted droplet ${id}`);
		}

	}

};

async function provision(dropletName, keyID)
{
    let client = new DigitalOceanProvider();
	var region = "nyc1";
	var image = "ubuntu-18-04-x64";
    var dropletId = await client.createDroplet(dropletName, region, image, keyID);
    // console.log(chalk.green(`Created droplet id ${dropletId}`));
    return dropletId;
}

async function keyGeneration()
{
    console.log(chalk.blueBright('Generating Key....'));
    exec(`ssh-keygen -t rsa -b 2048 -f ${process.env.HOME}/.ssh/DEVOPS-04 -C "" -P "" >/dev/null 2>&1`, (error, stdout, stderr)=> {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

async function copyKey()
{
    let identifyFile = path.join(os.homedir(), '.ssh', 'DEVOPS-04');
    result = scpSync (identifyFile, 'vagrant@192.168.33.10:/home/vagrant/.ssh/DEVOPS-04');
    if( result.error ) { console.log(result.error); process.exit( result.status ); }
}

async function firewall(monID, ser1ID, ser2ID, monIP, S1IP, S2IP)
{
    let response = await got('https://api.digitalocean.com/v2/firewalls',
    {
        headers: headers,
        json:true
    }).catch(err => console.error(`createFirewallCheck: ${err}`));
    if (response && response.body.firewalls) {
        for(let firewall of response.body.firewalls)
        {
            if (firewall.name === 'DEVOPS-04') {
                return;
            }
        }
    }

    var data = 
    {
        "name":"DEVOPS-04",
        "inbound_rules": [
            {
            "protocol": "tcp",
            "ports": "8080",
            "sources":
                {"addresses":["0.0.0.0/0"]
                }
            },
            {
            "protocol": "tcp",
            "ports": "22-444",
            "sources":
                {"addresses":["0.0.0.0/0"]
                }
            },
            {
            "protocol": "tcp",
            "ports": "3000-6379",
            "sources":
                {"droplet_ids": [monID, ser1ID, ser2ID]
                }
            },
            {
            "protocol": "icmp",
            "sources":
                {"addresses":["0.0.0.0/0"]
                }
            }
        ],
        "outbound_rules": [
            {
            "protocol": "icmp",
            "destinations":
                {"addresses":["0.0.0.0/0"]
                }
            },
            {
            "protocol": "tcp",
            "ports": "all",
            "destinations":
                {"addresses":["0.0.0.0/0"]
                }
            },
            {
            "protocol": "udp",
            "ports": "all",
            "destinations":
                {"addresses":["0.0.0.0/0"]
                }
            }
        ],
        "droplet_ids": [
            monID, ser1ID, ser2ID
        ]
    };
    let firewallresponse = await got.post('https://api.digitalocean.com/v2/firewalls',
    {
         headers:headers,
         json:true,
         body: data
     }).catch( err => 
         console.error(chalk.red(`createFirewall: ${err}`)) 
     );

     if( !firewallresponse ) return;


     
    if(firewallresponse.statusCode == 202)
    {
        console.log("Firewall rules have been created successfully") 
        return;
    }
}

async function monitor(file, inventory, vaultfilePath, gh_user, gh_pass) {
    // the paths should be from root of pipeline directory
    // Transforming path of the files in host to the path in VM's shared folder
    let filePath = '/bakerx/'+ file;
    let inventoryPath = '/bakerx/' +inventory;	
    vaultfilePath = '/bakerx/'+ vaultfilePath;
    console.log(chalk.blueBright('Running monitoring playbook...'));
    let result = sshSync(`/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath} ${vaultfilePath} ${gh_user} ${gh_pass}`, 'vagrant@192.168.33.10');
    if( result.error ) { process.exit( result.status ); }
}

async function populate_inventory(monIP,S1IP,S2IP){

    let cloud_inventory = 
`
[monitor]
${monIP}   ansible_ssh_private_key_file=~/.ssh/DEVOPS-04   ansible_user=root\n
[monitor:vars]
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
ansible_python_interpreter=/usr/bin/python3

[checkbox.io]
${S1IP}  ansible_ssh_private_key_file=~/.ssh/DEVOPS-04   ansible_user=root
[checkbox.io:vars]
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
ansible_python_interpreter=/usr/bin/python3

[iTrust]
${S2IP}  ansible_ssh_private_key_file=~/.ssh/DEVOPS-04   ansible_user=root
[iTrust:vars]
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
ansible_python_interpreter=/usr/bin/python3
`

    fs.writeFileSync(__dirname+'/../inventory.ini',cloud_inventory);


}


async function setup_infra(){

    if (!fs.existsSync(path.resolve(`${process.env.HOME}/.ssh/DEVOPS-04.pub`))) {
        await keyGeneration();
    }
    let client = new DigitalOceanProvider();
    var keyID = await client.createKey();
    copyKey();

    var monID = await provision("monitor", keyID);
    var ser1ID = await provision("checkbox.io", keyID);
    var ser2ID = await provision("iTrust", keyID)

    var monIP = await client.dropletInfo(monID);
    var S1IP = await client.dropletInfo(ser1ID);
    var S2IP = await client.dropletInfo(ser2ID);

    //save to dropconfig.json
    var obj = {
        'monitor_id': monID,
        'checkbox_id': ser1ID,
        'iTrust_id': ser2ID,
        'monitor_ip': monIP,
        'checkbox_ip': S1IP,
        'iTrust_ip': S2IP
    }
    var json_str = JSON.stringify(obj);
    fs.writeFileSync(__dirname+'/../dropconfig.json', json_str);

    await populate_inventory(monIP,S1IP,S2IP)

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

    return [client,monID,ser1ID,ser2ID,monIP,S1IP,S2IP]

}

async function configure_infra(monID,ser1ID,ser2ID,monIP,S1IP,S2IP){


    await firewall(monID, ser1ID, ser2ID, monIP, S1IP, S2IP);

    if (fs.existsSync(path.resolve('pipeline/playbook_monitor.yml')) && fs.existsSync(path.resolve('inventory.ini')) && !process.env.GH_USER && !process.env.GH_PASS) {
        await monitor('pipeline/playbook_monitor.yml', 'inventory.ini', 'pipeline/password/jenkins', `${process.env.GH_USER}`, `${process.env.GH_PASS}`);
    }

    else {
        console.error(`Playbook or inventory don't exist. Environmental Variables not set`);
    }
}

async function delete_infra(){

    var stringify = fs.readFileSync(__dirname+'/../dropconfig.json','utf8')
    obj = JSON.parse(stringify)
    console.log(obj)

    client = new DigitalOceanProvider()

    await client.deleteDroplet(obj.monitor_id)
    await client.deleteDroplet(obj.checkbox_id)
    await client.deleteDroplet(obj.iTrust_id)

    //delete files too
    fs.unlinkSync(__dirname+'/../dropconfig.json')
    fs.unlinkSync(__dirname+'/../inventory.ini')

}

exports.handler = async argv => {
    const { action } = argv;

    (async () => {

        if (action!="up"&&action!="destroy"){
            console.log("Did you mean \'pipeline prod up\'")
        }
        if (action=="up"){

            if(fs.existsSync(__dirname+'/../inventory.ini','utf-8')&&fs.existsSync(__dirname+'/../dropconfig.json')){
                console.log(chalk.blueBright("Setup already exits...skipping droplets creation"));
                //read from a JSON
                var stringify = fs.readFileSync(__dirname+'/../dropconfig.json','utf8')
                obj = JSON.parse(stringify)
                console.log(obj)
                await configure_infra(obj.monitor_id,obj.checkbox_id,obj.iTrust_id,obj.monitor_ip,obj.checkbox_ip,obj.iTrust_ip)
    
            }
            else{
                var [client,monID,ser1ID,ser2ID,monIP,S1IP,S2IP] = await setup_infra();
                await sleep(45000);
                await configure_infra(monID,ser1ID,ser2ID,monIP,S1IP,S2IP);
            }

        }

        if (action=="destroy"){
            await delete_infra()
        }
    })();
};