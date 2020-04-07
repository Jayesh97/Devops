# Project Report - Milestone-2

In this milestone additional app - iTrust is been integrated in the pipeline build command. Necessary dependencies such as MySql, Chrome and maven are installed in the Jenkins server. 

Testing includes mutation testing on iTrust Application and then performing static analysis on the checkbox.io application. For more details on the timeline and tasks, refer to the checkpoint documentation

[checkpoint documentation](/checkpoint.md)

[Screencast link](https://drive.google.com/file/d/1B10rkI0n8Q0MVUGrwBHa6d_Uj3VwjqYB/view?usp=sharing)

# Setup Procedure


To setup and run the project follow the steps given below

```bash
git clone https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-04.git
pipeline setup --gh-user <username> --gh-pass <password>
```

The application is in the [private-repo](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v6) which requires NCSU credentials. These credential are passed on to the jenkins server in the pipeline setup command, which are been used to the clone and run the application



# Build Procedure




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
```


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



# Test Suite Analysis

For running the useful tests execute the command. We would be mutating the contents of the .java files present in the `iTrust2-v6/iTrust2/src/main`

```
mvn -f pom-data.xml process-test-classes 
```

This is included in the job_builder role defined in the templates. email.properties and db.properties are updated to take credential from var file of credentials 

Test cases are defined in the directory `iTrust2-v6/iTrust2/src/test` This would be executed by running the command

```
mvn clean test verify
```

This would create the report in the `iTrust2-v6/iTrust2/target/surefire-reports`. Upon generation of report, generated reports are cummulated to display the tests that have been passed out of 100 tests.

The fuzzing logic include mutation operations such as 



* swap == with !=  `op = op.replace(/==/g,"!=")`
            
* swap 0 with 1     `op = op.replace(/0/g,"1")`

* swap < with >     `// op = op.replace(/</g,">")`

* swap && with ||   `op = op.replace(/&&/g,"||")`

* swap + with -     `op = op.replace("++","--")`

* match strings and replace with random string  `op = op.replace(/"\w+"/i,"replaced")`

The sample report from the output obtained is attached. This represents the total itreations - 100 of which where each individual test cases pass count is cummulated. More the sampling and more the percent of mutation, greater is the probability of failing tests.

The mutation criteria used in the testing is **10% of files and 10% of lines in them**
	
```
95/100 edu.ncsu.csc.itrust2.unit.PersonnelFormTest.testPersonnelForm
93/100 edu.ncsu.csc.itrust2.unit.DrugTest.testDrugForm
93/100 edu.ncsu.csc.itrust2.unit.PatientTest.testFieldValidation
91/100 edu.ncsu.csc.itrust2.unit.LOINCTest.testInvalidCodes
91/100 edu.ncsu.csc.itrust2.unit.DrugTest.testDrugLookup
91/100 edu.ncsu.csc.itrust2.unit.PasswordChangeTest.testPasswordChangeForm
91/100 edu.ncsu.csc.itrust2.unit.UserTest.testEqualsAndProperties
89/100 edu.ncsu.csc.itrust2.unit.ICDCodeTest.testCodes
89/100 edu.ncsu.csc.itrust2.unit.LOINCTest.testCodes
89/100 edu.ncsu.csc.itrust2.unit.ICDCodeTest.testInvalidCodes
86/100 edu.ncsu.csc.itrust2.unit.HospitalFormTest.testHospitalForm
85/100 edu.ncsu.csc.itrust2.unit.LogEntryTest.testLogEntryTableRow
85/100 edu.ncsu.csc.itrust2.unit.DomainObjectTest.testRetrieveDomainObject
```


```
pipeline useful-tests -c 100
```

# Static Analysis

Static analysis include testing the code smells using the esprima parser from the complexity workshop. The functions implemented in the static analysis test on the aspects of 

### LOC > 100

Represented by start and end of the function, obtained by the function builder

```
LOC = node.loc.end.line-node.loc.start.line
```


### MaxMsgChains > 10

Max Message Chains are defined as the longest chain of methods been accessed on a object such as `a.b.c.d` has a message chain of 3. The various cases for occurance of MaxMsgChains could be the array access, method access or a memeberaccess

1. a.b.c - simple member access

2. a.b[2] - array access


```
if (node.type==='MemberExpression'){ 
    local = local + 1;
    if (local>builder.MaxMsgChains){
        builder.MaxMsgChains = local;
    }
}
```

### MaxNestingDepth > 5

This is specific to the looping statement or the IfStatement block present in the code. The parser output provides an alternate path in case of the `if` `else if` and `else` block

The looping happens recursively to find the max nested depth. The functionality has been implemened by modifying the traversewithparents function to update depth every iteration it hits an new IfStatement


```
if (typeof child === 'object' && child !== null && key != 'parent') 
{
    child.parent = object;
    if(object.type === 'IfStatement' && object.alternate === null){
        // console.log(object.test.name)
        depth_fn(child,depth+1)
    }
    else if(object.type === 'IfStatement'){
        depth_fn(object.consequent,depth+1)
        depth_fn(object.alternate,depth)
    }
    else{
        depth_fn(child,depth)
    }
}
```

The report obtained after fixing the threshold values to the `{'LOC_th':100,'chains_th':10,'nesting_th':5}` show that 4 functions exceeded in the complexity test

```


LOC found "232" exceeds the threshold "100" in function "ProcessTokens" in file "app/server-side/site/marqdown.js" 


LOC found "171" exceeds the threshold "100" in function "longMethod" in file "app/server-side/site/test/complexity/longmethod.js" 


Max Msg chains found "11" exceeds the threshold "10" in function "chains" in file "app/server-side/site/test/complexity/nestedchains.js" 


Nesting depth found "6" exceeds the threshold "5" in function "nested" in file "app/server-side/site/test/complexity/nestedifs.js" 


```


## Scrum Meeting 2 - Date: 03/7/2020 //To be updated

### Jayesh

#### Tasks:

* Setup Thresholds for LOC, MaxNestingDepth, MaxMsgChains
* Implementing error login to exit the code, failing build
* Implementing Try-Catch block in Jenkins

### Venkata Sai

#### Tasks

* Writing useful-tests.js for test prioritization
* Output the functions exceeding thresholds of metrics
* Output the functions exceeding thresholds of metrics

### Luv Khurana

#### Tasks  

* Writing a DFS custom function to traverse the ast
* Modify traversewithparents() function to support dfs function

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