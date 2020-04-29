# Project Report - Milestone-3

In this milestone we would be spanning production servers to deploy our checkbox.io and iTrust applications. We have provided commads to spin up the servers in Digital Ocean platform

The architecture consists of 3 servers 
1. Monitor - To monitor for the application metrics corresponding to iTrust and checkbox.io
2. Checkbox - Server for deploying Checkbox.io application
3. iTrust - The server in which iTrust application would be deployed

[checkpoint documentation](/checkpoint.md)

## Setup and Procedure

For spanning the production servers and make them ready for deploying the applications use the following steps

```
export DOTOKEN=<token>
```

The comamnd for setting up the infra and env for the production servers is present in `commads/prod.js`. Made idempotent

```
pipeline prod up
```

This would span the droplets in the Digital Ocean. The inventories are populated with the newly spanned droplet IPs and the SSH key which is generated during the script 

Another command has also been added to support destroying the infrastructure 

```
pipeline prod destroy
```

## Canary Analysis

In this task we would implement the Netflix style red-black deployment with canary analysis of a microservice. The microservice under consideration is the /preview POST end-point of the checkbox.io Application

The repo consists of 2 branches 
- Master - Working production level code
    - Returns Status code 200
    - Body contains the HTML preview
- Broken - Broken code implementing new features 
    - Returns status code of 500
    - Body contains

Parameters Analysed include
1. CPU Usage
2. Memory Usage
3. Latency
4. StatusCode
5. Response Body

### Senerio-1 

Master branch on both the VMs

```
pipeline canary master master
```

The cananry score obtained would be high in this senerio with StatusCode, ResponseBody exaactly same. Some other notable features would be Latency, where we would obtain almost same latency for each of the API call


### Senerio-2

Master branch on BLUE and broken branch on GREEN

```
pipeline canary master broken
```

A low canary score can be seen in this case as the broken branch metrics are different. The statusCode for broken is 500 with response body as the error obtained during execution

## Scrum Meeting 2 - Date: 04/21/2020

### Luv Khurana

#### Tasks:

* Create a canary.js script in the commands
* Configure the infrastructure for canary analysis
* Determine the metrics for canary analysis


### Venkata Sai

#### Tasks

* Configure Databases and Tomcat for iTrust deployment
* Monitor application specific metrics for iTrust
* Install the firewall rules to enable redis connection

### Jayesh

#### Tasks  

* Configure Nginx Proxy for checkbox.io deployment
* Monitor application specific metrics - api endpoints in checkbox.io
* Compute Canary Score and Proxying API calls to BLUE, GREEN

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

