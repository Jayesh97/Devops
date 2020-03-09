# Project Report - Milestone-1

In this milestone we have provisioned ansible server and jekins server with necessary plugins and modules. Later moving to the checkpoint-2 we have automated the configuration of build environment where the `checkbox.io` app would be running. The task included setting up APP_PORT, MONGO_PORT, MONGO_USER, MONGO_IP. In checkpoint-3 we have used jenkins job-builder to create jobs from Jenkinsfile, later phase REST APIs are been used to get the jenkins build log

[checkpoint documentation](/checkpoint.md)

[screencast link](https://drive.google.com/file/d/1oTsAS8ORqxpXihMtH61SJrlXxElgOpNT/view?usp=sharing)

## Instructionsss

### Building the Ansible and Jenkins server


```bash
git clone https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-04.git
pipeline setup
```

### Jenkins Pipeline and checkbox.io app

```bash
pipeline build checkbox.io
```

## Issues

Some of the major hurdles faced during the Milestone pipeline are categorized into environment, setup and build issues. 

### Environment issues

* Linux system and GCP issues - Permission error while mounting the valut password file
* Load environemnt variables - A seperate role as been made to load the environment variables and this has been called as pre-task

### Setup issues

* Skipping of Jenkins setup wizard - Using Java Args in the Jenkins config file and groovy script we have handled the setup wizard
* Handling Jenkins authentication - Jenkins username and password is being created to handle the authentication via groovy script
* Skipping anonymous page and installing plugins - Creating a pipeline in Jenkins required us to install various plugins, which is handled during the setup phase via script

### Build issues

* Getting Crumb for the API call and generating token - The API calls to jenkins required us to obtain the crumb and generate the access token
* Jenkinsfile - Creating a pipeline from the Jenkinsfile with stages such as build, setup and test
* MongoService - Had to make sure that the mongo service is being running
* Acquiring Jenkins console output - Using REST API to obtain the console output for the latest Build Job

# Checkpoint 1

## Process flow and Software practices

For this milestone we implemented the basic flow described by the project. For implementing the basic flow our team used well known Software Practices. As our general Software Process, we have used "scrumban" methodology. As a part of Core Practice, we are using Code Review While following these practices we kept the meeting notes and the documentation of these practices.


## Pipeline setup

We have provided a CLI command `pipeline setup` which performs the following tasks and also implemented the below steps for the fullfillment of the Milestone-1
* Ansible role has been created for configuring Jenkins server at IP - 192.168.33.20
* Jenkins inventory file located at `inventory.ini` used by ansible server
* Default password will be used to decrypt the .yml files which are encrypted by ansible vault using password file
* Templates are been used to skip the setup wizard and handle authentication

```bash
.
├── inventory.ini
├── password
│   └── jenkins
├── playbook_setup.yml
├── roles
│   ├── jenkins
│   │   ├── tasks
│   │   │   └── main.yml
│   │   └── templates
│   │       ├── basic-security.groovy.j2
│   │       └── jenkins.j2
│   ├── ping
│   │   └── tasks
│   │       └── main.yml
│   └── update
│       └── tasks
│           └── main.yml
├── run-ansible.sh
├── server-init.sh
└── vars
    ├── jenkins_var.yml
```

## Scrum Meeting 1 - Date: 02/13/2020

### Luv Khurana

#### Tasks:

* Update source list and repo key
* Cheking up proper permissions for the config files
* Update documentation

### Venkata Sai

#### Tasks

* Vault - Pass username, password, and vault-password in setup.js file
* Handling authentication for jenkins
* Run Jenkins on Port 9000 and installing plugins


### Jayesh

#### Tasks  

* Create infrastructure - ansible and Jenkins server
* Setting up Jenkins Setup wizard
* Modify package.json, inventory file for ansible server


# Checkpoint-2

## Process flow and Software practices

In this milestone we created the build environment for checkbox.io. The production site has dependencies on nginx, node, monogodb, and additional environmental variable dependencies. In this checkpoint we implemented a subset of these dependencies.


The steps that we performed in the Checkpoint-2  are:

* Installed Mongodb  with configuration enhancement. Settings up Mongodb database for configuring build environment.

* Created mongo user with password and readWrite role. We also defined the port for Mongodb

* Installed nodejs and other variable dependencies like nginx.

```bash
.
├── inventory.ini
├── password
│   └── jenkins
├── playbook_setup.yml
├── roles
│   ├── environment
│   │   └── tasks
│   │       └── main.yml
│   ├── mongo_config
│   │   └── tasks
│   │       └── main.yml
│   ├── mongo_install
│   │   └── tasks
│   │       └── main.yml
│   ├── nodejs
│   │   └── tasks
│   │       └── main.yaml
├── run-ansible.sh
├── server-init.sh
└── vars
    └── mongo_var.yml
```


## Scrum Meeting 2 - Date: 02/20/2020

### Luv Khurana

#### Tasks:

* Installed nodejs
* Update documentation and Readme

### Venkata Sai

#### Tasks

* Created mongo user with password and readWrite role
* Changing ports for Mongodb


### Jayesh

#### Tasks  

* Installed Mongodb and other environment variables.
* Updated source list and enabling Mongodb services.



# Milestone-1

## process flow

The final checkpoint of milestone required to create a Jenkins Pipeline which would host the Checkbox.io node application. This stage has been performed using JenkinsJobBuilder module and REST APIs to POST and GET the build responses and necessary information when required. The app has been deployed and test has been performed in the pipeline stage

The pipeline has the following stages

1. Source - Clone repo from GIT

2. Setting - Installing node modules

3. Change - Starting Application 

4. Test - Running npm tests

5. Stop - tearing down the application


```bash
.
├── inventory.ini
├── password
│   └── jenkins
├── playbook_build.yml
├── roles
│   ├── job_builder
│   │   ├── tasks
│   │   │   └── main.yml
│   │   ├── templates
│   │   └── vars
│   │       └── main.yml
│   ├── job_trigger
│   │   ├── tasks
│   │   │   └── main.yml
│   │   ├── templates
│   │   │   ├── jenkins_jobs.ini.j2
│   │   │   └── job_file.yml.j2
│   │   └── vars
│   │       └── main.yml
├── run-ansible.sh
├── server-init.sh
└── vars
    ├── jenkins_var.yml
    └── mongo_var.yml
```


## Scrum Meeting 3 - Date: 02/27/2020

### Luv Khurana

#### Tasks:

* Installing necessary modules and plugins
* Jenkinsfile and necessary pipeline stages
* Handling test cases for commands provided
* Aquiring Jenkins APIs

### Venkata Sai

#### Tasks

* Created mongo user with password and readWrite role
* Creating `pipeline build` command
* Update documentation and Readme
* Post Job tasks and tearing services down

### Jayesh

#### Tasks  

* Installed Mongodb and other environment variables
* Updated source list and enabling Mongodb services
* Obtaining crumb and API token
* logging Jenkins console output
