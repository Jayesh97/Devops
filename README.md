# Project Report - Milestone-2

In this milestone additional app - iTrust is been integrated in the pipeline build command. Necessary dependencies such as MySql, Chrome and maven are installed in the Jenkins server


## Setup Procedure

The application is in the private-repo(https://github.ncsu.edu/engr-csc326-staff/iTrust2-v6) which requires NCSU credentials. These credential are passed on to the jenkins server in the pipeline setup command

To setup and run the project follow the steps given below

```bash
git clone https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-04.git
pipeline setup --gh-user <username> --gh-pass <password>
```


# Build Procedure


//--------write something about the gh user requirement----//


To build the checkbox Application use the command

```bash
pipeline build checkbox.io
```

To build the iThrust Application use the command

```bash
pipeline build iThrust
```


The following structure has been used for setting up the jobs in Jenkins server. This rols has been called in **playbook_setup.yml**. Templates checkbox.yml.j2 and itrust.yml.j2 contain the Jenkinsfile used to create the Job configuration, these files are pushed to the /var/lib/jenkins/jobs/ directory

```
├── job_builder
│   ├── tasks
│   │   ├── main.yml
│   │   └── token.yml
│   ├── templates
│   │   ├── checkbox.yml.j2
│   │   ├── itrust.yml.j2
│   │   └── jenkins_jobs.ini.j2
│   └── vars
│       └── main.yml


Tasks related to the iTrust have been added under iTrust role in pipeline folder

The tree directory for the reference of source-code, can be obtained from

```bash
│   ├── iTrust
│   │   └── tasks
│   │       ├── google-chrome.yml
│   │       ├── iTrust.yml
│   │       ├── main.yml
│   │       └── mysql.yml
```

[checkpoint documentation](/checkpoint.md)



# Test Suite Analysis



# Static Analysis




## Scrum Meeting 2 - Date: 03/7/2020 //To be updated

### Luv Khurana

#### Tasks:

* Update setup.js to accept Git username and password
* Passing arguments to the ansible-playbook to run the desired app 
* Creating enviroment for iTrust

### Venkata Sai

#### Tasks

* Enable tasks and debug mode in pipeline build
* Setting up pipeline build command
* Creating Jenkins piepline for iTrust App

### Jayesh

#### Tasks  

* Install necessary packages required for the iTrust Application
* Bug fixes from Milestone-1 
* Update Documentation
* Enable pipeline build in build.js



## Scrum Meeting 1 - Date: 03/7/2020

### Luv Khurana

#### Tasks:

* Update setup.js to accept Git username and password
* Passing arguments to the ansible-playbook to run the desired app 
* Creating enviroment for iTrust

### Venkata Sai

#### Tasks

* Enable tasks and debug mode in pipeline build
* Setting up pipeline build command
* Creating Jenkins piepline for iTrust App

### Jayesh

#### Tasks  

* Install necessary packages required for the iTrust Application
* Bug fixes from Milestone-1 
* Update Documentation
* Enable pipeline build in build.js