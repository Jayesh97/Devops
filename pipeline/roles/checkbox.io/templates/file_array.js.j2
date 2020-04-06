const fs = require("fs")
const path = require("path")
var current_path = __dirname
 
function traverse_with_dir(dir_path, result) {
  files = fs.readdirSync(dir_path)
  result = result
  files.forEach(function(file) {
    if (fs.statSync(dir_path + "/" + file).isDirectory()) {
        // console.log(dir_path,__dirname)
        result = traverse_with_dir(dir_path + "/" + file, result)
    } 
    else{
        if(file.endsWith('.js') && dir_path.includes("node_modules")===false){
            result.push(path.join(dir_path, "/", file))
        }
    }
  })
  return result
}

// res = traverse_with_dir("/home/sjbondu/Complexity/app/checkbox.io/server-side",[]);
// console.log(res)
// console.log("i have node_modules".includes("node_odules"))
exports.traverse_with_dir = traverse_with_dir;