var esprima = require("esprima");
var options = {tokens: true, tolerant: true, loc: true, range: true };
var fs = require("fs");
const path = require("path");
var file_array = require("./file_array.js");
const chalk = require("chalk");
var threshold = {'LOC_th':1000,'chains_th':100,'nesting_th':50}
var errors = []

//https://jenkins.io/doc/book/pipeline/#declarative-pipeline-fundamentals

function main()
{
	var args = process.argv.slice(2);

	//jenkins workspace
	f_list = file_array.traverse_with_dir("./app/server-side",[]);
	// f_list = file_array.traverse_with_dir("/home/sjbondu/Complexity/app/checkbox.io/server-side",[]);



	for( let fname of f_list){
		complexity(fname);}
	for( var node in builders )
	{
		var builder = builders[node];
		builder.report(); //its basically a print statement
	}
	// console.log(builders)

	if(errors.length>0){
		console.log("----------`````````Errors Start Here```````---------------`````````Errors Start Here```````---------------```````````Errors Start Here```````----------\n");
		console.log("----------`````````Errors Start Here```````---------------`````````Errors Start Here```````---------------```````````Errors Start Here```````----------\n");
		console.log("----------`````````Errors Start Here```````---------------`````````Errors Start Here```````---------------```````````Errors Start Here```````----------\n\n\n");
		errors.forEach(element => console.log(chalk.red(element),"\n\n"));
		console.log("\n----------`````````Errors End Here```````---------------`````````Errors End Here```````---------------```````````Errors End Here```````----------\n");
		console.log("----------`````````Errors End Here```````---------------`````````Errors End Here```````---------------```````````Errors End Here```````----------\n");
		console.log("----------`````````Errors End Here```````---------------`````````Errors End Here```````---------------```````````Errors End Here```````----------\n");
		throw console.error("The Threshold values are voilated check the above error list");	
	}

}



var builders = {};

// Represent a reusable "class" following the Builder pattern.
function FunctionBuilder()
{
	this.StartLine = 0;
	this.FunctionName = "";
	// The number of parameters for functions
	this.ParameterCount  = 0,
	// Number of if statements/loops + 1
	this.SimpleCyclomaticComplexity = 0;
	// The max depth of scopes (nested ifs, loops, etc)
	this.MaxNestingDepth    = 0;
	// The max number of conditions if one decision statement.
	this.MaxConditions      = 0;
	// Maxmsg chains
	this.MaxMsgChains = 0;
	//LOC
	this.LOC = 0;
	//To include filename too
	this.FileName = "";

	this.report = function()
	{

		if (threshold.LOC_th < this.LOC){
			console.log(chalk.red("LOC exceeds in ", "\"",this.FunctionName,"\"", " function in file --- ", "\"",this.FileName,"\""))
			errors.push("LOC found "+"\""+this.LOC+"\""+" exceeds the threshold "+"\""+threshold.LOC_th+"\""+" in function "+"\""+this.FunctionName+"\""+" in file "+"\""+this.FileName+"\"")
		}
		if (threshold.nesting_th < this.MaxNestingDepth){
			console.log(chalk.red("Nesting depth exceed inside ", "\"",this.FunctionName,"\"", " function in file ---", this.FileName))
			errors.push("Nesting depth found "+"\""+this.MaxNestingDepth+"\""+" exceeds the threshold "+"\""+threshold.nesting_th+"\""+" in function "+"\""+this.FunctionName+"\""+" in file "+"\""+this.FileName+"\"")
		}
		if (threshold.chains_th < this. MaxMsgChains){
			console.log(chalk.red("Max Msg chains exceed inside ","\"",this.FunctionName,"\"", " function in file ---", this.FileName))
			errors.push("Max Msg chains found "+"\""+this.MaxMsgChains+"\""+" exceeds the threshold "+"\""+threshold.chains_th+"\""+" in function "+"\""+this.FunctionName+"\""+" in file "+"\""+this.FileName+"\"")
		}
		console.log((chalk.rgb(150,136,0)
		   (
		   	"{0}(): {1}\n" +
		   	"============\n" +
			   "SimpleCyclomaticComplexity: {2}\t" +
				"MaxNestingDepth: {3}\t" +
				"MaxConditions: {4}\t" +
				"Parameters: {5}\t" +
				"LOC: {6}\t" +
				"MaxMsgChains: {7}\n\n"
			))
			.format(this.FunctionName, this.StartLine,
				     this.SimpleCyclomaticComplexity, this.MaxNestingDepth,
					this.MaxConditions, this.ParameterCount, this.LOC, this.MaxMsgChains)
					
		
		);
	}
};

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// Number of strings in a file.
	this.Strings = 0;
	// Number of imports in a file.
	this.ImportCount = 0;
	this.report = function()
	{
		console.log (chalk.cyan(
			( "{0}\n" +
			  "~~~~~~~~~~~~\n"+
			  "ImportCount {1}\t" +
			  "Strings {2}\n"
			)).format( this.FileName, this.ImportCount, this.Strings));
	}
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function atleast_one_if(object)
{
    var key, child;
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
				child.parent = object;
				if(object.type==="IfStatement"){
					return 1
				}
				atleast_one_if(child);
            }
        }
	}
}

function depth_fn(object,depth)
{
	builder = builders[func_name]
	builder.MaxNestingDepth = Math.max(depth,builder.MaxNestingDepth)
	builders[builder] = builder
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
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
        }
    }
}



function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;

	// A file level-builder:
	var fileBuilder = new FileBuilder();
	fileBuilder.FileName = filePath;
	func_name = ""
	fileBuilder.ImportCount = 0;
	fileBuilder.Strings = 0; //to be written
	builders[filePath] = fileBuilder;

	// console.log(filePath)
	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			func_name = functionName(node);
			var builder = new FunctionBuilder();
			builder.FunctionName = functionName(node);
			builder.FileName = filePath;

			//LOC
			builder.StartLine = node.loc.start.line;
			builder.Endline = node.loc.end.line;
			builder.LOC = builder.Endline-builder.StartLine
			builders[builder.FunctionName] = builder;
			if_count = 0;


			//Max msg chains
			//should i put if condition also outside
			traverseWithParents(node, function(node){
				if (node.type === 'MemberExpression') 
				{
					builder = builders[func_name];
					local = 0
					traverseWithParents(node, function(node){
						if (node.type==='MemberExpression'){ 
							//console.log(local)
							local = local + 1;
							if (local>builder.MaxMsgChains){
								builder.MaxMsgChains = local;
							}
						}
					});
					builders[func_name] = builder;
				}
			})

			
			traverseWithParents(node, function(node){
				builder = builders[func_name]
				depth = 0
				if (node.type === 'IfStatement'){
					depth_fn(node,depth)
				}			
			})

		}

	});

}

// Helper function for counting children of node.
function childrenLength(node)
{
	var key, child;
	var count = 0;
	for (key in node) 
	{
		if (node.hasOwnProperty(key)) 
		{
			child = node[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				count++;
			}
		}
	}	
	return count;
}

	

// Helper function for checking if a node is a "decision type node"
function isDecision(node)
{
	if( node.type == 'IfStatement' || node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}

// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();

function Crazy (argument) 
{

	var date_bits = element.value.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
	var new_date = null;
	if(date_bits && date_bits.length == 4 && parseInt(date_bits[2]) > 0 && parseInt(date_bits[3]) > 0)
    new_date = new Date(parseInt(date_bits[1]), parseInt(date_bits[2]) - 1, parseInt(date_bits[3]));

    var secs = bytes / 3500;

      if ( secs < 59 )
      {
          return secs.toString().split(".")[0] + " seconds";
      }
      else if ( secs > 59 && secs < 3600 )
      {
          var mints = secs / 60;
          var remainder = parseInt(secs.toString().split(".")[0]) -
(parseInt(mints.toString().split(".")[0]) * 60);
          var szmin;
          if ( mints > 1 )
          {
              szmin = "minutes";
          }
          else
          {
              szmin = "minute";
          }
          return mints.toString().split(".")[0] + " " + szmin + " " +
remainder.toString() + " seconds";
      }
      else
      {
          var mints = secs / 60;
          var hours = mints / 60;
          var remainders = parseInt(secs.toString().split(".")[0]) -
(parseInt(mints.toString().split(".")[0]) * 60);
          var remainderm = parseInt(mints.toString().split(".")[0]) -
(parseInt(hours.toString().split(".")[0]) * 60);
          var szmin;
          if ( remainderm > 1 )
          {
              szmin = "minutes";
          }
          else
          {
              szmin = "minute";
          }
          var szhr;
          if ( remainderm > 1 )
          {
              szhr = "hours";
          }
          else
          {
              szhr = "hour";
              for ( i = 0 ; i < cfield.value.length ; i++)
				  {
				    var n = cfield.value.substr(i,1);
				    if ( n != 'a' && n != 'b' && n != 'c' && n != 'd'
				      && n != 'e' && n != 'f' && n != 'g' && n != 'h'
				      && n != 'i' && n != 'j' && n != 'k' && n != 'l'
				      && n != 'm' && n != 'n' && n != 'o' && n != 'p'
				      && n != 'q' && n != 'r' && n != 's' && n != 't'
				      && n != 'u' && n != 'v' && n != 'w' && n != 'x'
				      && n != 'y' && n != 'z'
				      && n != 'A' && n != 'B' && n != 'C' && n != 'D'
				      && n != 'E' && n != 'F' && n != 'G' && n != 'H'
				      && n != 'I' && n != 'J' && n != 'K' && n != 'L'
				      && n != 'M' && n != 'N' &&  n != 'O' && n != 'P'
				      && n != 'Q' && n != 'R' && n != 'S' && n != 'T'
				      && n != 'U' && n != 'V' && n != 'W' && n != 'X'
				      && n != 'Y' && n != 'Z'
				      && n != '0' && n != '1' && n != '2' && n != '3'
				      && n != '4' && n != '5' && n != '6' && n != '7'
				      && n != '8' && n != '9'
				      && n != '_' && n != '@' && n != '-' && n != '.' )
				    {
				      window.alert("Only Alphanumeric are allowed.\nPlease re-enter the value.");
				      cfield.value = '';
				      cfield.focus();
				    }
				    cfield.value =  cfield.value.toUpperCase();
				  }
				  return;
          }
          return hours.toString().split(".")[0] + " " + szhr + " " +
mints.toString().split(".")[0] + " " + szmin;
      }
  }
exports.main = main;


