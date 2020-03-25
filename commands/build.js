require('dotenv').config();
var JK_USER = process.env.JK_USER;
var JK_PASS = process.env.JK_PASS;
const jenkins = require('jenkins')({ baseUrl: 'http://'+JK_USER+':'+JK_PASS+'@192.168.33.20:9000', crumbIssuer: true, promisify: true });

exports.command = 'build <build_name>';
exports.desc = 'Trigger a Jenkins job and print the build log';
exports.builder = yargs => {
    yargs.options({
        build_name:{
            describe: 'Name of the job to be triggered',
            type: 'string'
        }
	});
};

exports.handler = async argv => {
    const { build_name } = argv;

    (async () => {

        if (build_name==="checkbox.io" || build_name==="iTrust") {
            await main(build_name);
        }
        else {
            console.error(`checkbox.io or iTrust`);
        }

    })();

};

async function getBuildStatus(job, id) {
    return new Promise(async function(resolve, reject)
    {
        console.log(`Fetching ${job}: ${id}`);
        let result = await jenkins.build.get(job, id);
        resolve(result);
    });
}

async function waitOnQueue(id) {
    return new Promise(function(resolve, reject)
    {
        jenkins.queue.item(id, function(err, item) {
            if (err) throw err;
            // console.log('queue', item);
            if (item.executable) {
                console.log('number:', item.executable.number);
                resolve(item.executable.number);
            } else if (item.cancelled) {
                console.log('cancelled');
                reject('canceled');
            } else {
                setTimeout(async function() {
                    resolve(await waitOnQueue(id));
                }, 5000);
            }
        });
    });
    }
    

async function triggerBuild(job) 
{
    let queueId = await jenkins.job.build(job);
    let buildId = await waitOnQueue(queueId);
    return buildId;
}

async function main(build_name)
{

    console.log('Triggering build.')
    let buildId = await triggerBuild(build_name).catch( e => console.log(e));

    console.log(`Received ${buildId}`);
    let build = await getBuildStatus(build_name, buildId);
    console.log( `Build result: ${build.result}` );

    console.log(`Build output`);
    let output = await jenkins.build.log({name: build_name, number: buildId});
    console.log( output );

    var log = jenkins.build.logStream(build_name, buildId);
 
    log.on('data', function(text) {
        process.stdout.write(text);
    });
    
    log.on('error', function(err) {
        console.log('error', err);
    });
    
    log.on('end', function() {
        console.log('end');
    });

}