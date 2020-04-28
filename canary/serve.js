const chalk = require('chalk');
const path = require('path');
const os = require('os');
const express = require('express');
const app = express()
const got = require('got');
const port = 3080;


app.configure(function () {
    app.use(express.bodyParser());
});


headers = {
	'content-type':'application/json',
};


app.post('/preview',async(req,res)=>{
    console.log(req.body)
    // console.log(req.headers)
    let response = await got.post('http://192.168.44.25:3000/preview', 
    {
        headers:headers,
        body: JSON.stringify(req.body)
    }).catch( err => 
        console.error(chalk.red(`Preview error: ${err}`)) 
    );
    console.log(response)//start your analysis here
    text = JSON.parse(response.body).preview
    res.send({preview:text})
    
})

const BLUE  = 'http://192.168.44.25:3000';
const GREEN = 'http://192.168.44.30:3000';

TARGET = BLUE

setInterval(async function(){
    TARGET = (TARGET==BLUE) ? GREEN:BLUE;
},5000)

app.listen(port, () => console.log(`Proxy listening on http://localhost:${port}`))


// curl -X POST -H "Content-Type: application/json" --data @test/resources/survey.json http://localhost:3080/preview