# Project Report - Milestone-2

In this milestone additional app - iTrust is been integrated in the pipeline build command. Necessary dependencies such as MySql, Chrome and maven

Tasks related to the iTrust have been added under iTrust role in pipeline folder

```bash
git clone https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-04.git
pipeline setup --gh-user <username> --gh-pass <password>
pipeline build iTrust
```

The tree directory for the reference of source-code, can be obtained from

```bash
│   ├── iTrust
│   │   └── tasks
│   │       ├── google-chrome.yml
│   │       ├── iTrust.yml
│   │       ├── main.yml
│   │       └── mysql.yml
```

checkpoint documentation](/heckpoint.md)

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