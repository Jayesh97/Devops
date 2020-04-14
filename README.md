# Project Report - Milestone-3

In this milestone we would be spanning production servers to deploy our checkbox.io and iTrust applications. We have provided commads to spin up the servers in Digital Ocean platform

The architecture consists of 3 servers 
1. Monitor - To monitor for the application metrics corresponding to iTrust and checkbox.io
2. Checkbox - Server for deploying Checkbox.io application
3. iTrust - The server in which iTrust application would be deployed

## Setup and Procedure

For spanning the production servers and make them ready for deploying the applications use the following steps

```
export NCSU_DOTOKEN=<token>
```

The comamnd for setting up the infra and env for the production servers is present in `commads/prod.js`. Made idempotent

```
pipeline prod up
```

This would span the droplets in the Digital Ocean. The inventories are populated with the newly spanned droplet IPs and the SSH key which is generated during the script 




[checkpoint documentation](/checkpoint.md)


## Scrum Meeting 1 - Date: 04/15/2020

### Luv Khurana

#### Tasks:

* Configure Digital Ocean account and perform API calls to span Droplets
* Include functionalities of Digital Ocean client in `prod.js`
* Automating process of key creation

### Venkata Sai

#### Tasks

* Configure monitor VM to observe dashboard
* Setup the Infrastructure for applications
* Install the firewall rules to enable redis connection

### Jayesh

#### Tasks  

* Cleaning up the Milestone-2 code
* Population inventory for ansible-playbook
* Idempotancy of `pipeline prod up`