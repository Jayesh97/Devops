# Milestone 3

## Checkpoint-1

<p></p>

## User Stories Checkpoint-1

|            |              |                              |                                                                             |          |                  |           | 
|------------|--------------|------------------------------|-----------------------------------------------------------------------------|----------|------------------|-----------| 
| Checkpoint | Issue Number | Issue Name                   | Task                                                                        | Estimate | Assignees        | Completed | 
| 1          | 32           | Pipeline Prod                | Generate Keys                                                               | 7        | vpmaddur         |           | 
|            |              |                              | Copy keys to Ansible server and Droplets(digital ocean)                     |          |                  |           | 
|            |              |                              | Provision droplets                                                          |          |                  |           | 
|            |              |                              | Create firewall rules to open port to the Redis server                      |          |                  |           | 
|            |              |                              | Copy node js files to the Monitoring server                                 |          |                  |           | 
|            |              |                              | Copy index.js and server.js files to Application servers                    |          |                  |           | 
|            |              |                              | Write playbooks to install Redis                                            |          |                  |           | 
|            |              |                              |                                                                             |          |                  |           | 
| 1          | 33           | Populating Inventory.ini     | Function to populate inventory.ini from the obtained droplet IPs            | 2        | sjbondu          |           | 
|            |              |                              | Updating inventory with appropriate keys, host vars and target groups       |          |                  |           | 
|            |              |                              |                                                                             |          |                  |           | 
| 1          | 34           | Pipeline prod-up Idempotency | Logic of using Env variable to keep count of prod.js initial execution      | 2        | lkhuran          |           | 
|            |              |                              | Functions updates on runnig the pipeline prod up multiple times             |          |                  |           | 
|            |              |                              |                                                                             |          |                  |           | 
| 1          | 35           | Checkpoint-1 Documentation   | Checkpoint-1 Documentation                                                  | 1        | sjbondu          |           | 
|            |              |                              |                                                                             |          |                  |           | 
| 1          | 36           | Fixing M2 corner cases       | Enhancing run-ansible.sh to support multiple scripts                        | 4        | sjbondu, lkhuran |           | 
|            |              |                              | Handling default values for ansible playbooks                               |          |                  |           | 
|            |              |                              | Shortening list of Jenkins plugins                                          |          |                  |           | 
|            |              |                              | Enabling --gh-pass to support special                                       |          |                  |           | 
|            |              |                              |                                                                             |          |                  |           | 
|            |              |                              |                                                                             |          |                  |           | 
| 2          | 37           | Provide deploy command       | Include deploy.js to deploy applications in the production servers          | 2        | lkhuran          |           | 
|            |              |                              | Setup production environment on application servers based on inventory file |          |                  |           | 
|            |              |                              |                                                                             |          |                  |           | 
| 2          | 38           | Deploy checkbox.io           | Update HTML pages of nginx to support checkbox.io                           | 2        | sjbondu          |           | 
|            |              |                              | Replacing configurations of nginx - default.conf                            |          |                  |           | 
|            |              |                              |                                                                             |          |                  |           | 
| 2          | 39           | Deploy iTrust                | Create environment for iTrust                                               | 2        | vpmaddur         |           | 
|            |              |                              | Deploy the .war file and TomCat webserver                                   |          |                  |           | 


<p></p>

<br/><br/>


#### Sprint Summary Planning Checkpoint-2

* Setting up environment and necessary dependencies for production environment
* Enabling redis acccess and creating monitoring scripts to pass application information
* Provide `pipeline prod up` and `pipeline deploy <name>` commands


<br/><br/>

![Task progress](/Images/m3-1.png)

<br/><br/>

![Final](/Images/m3-2.png)

<br/><br/>

<br/><br/>