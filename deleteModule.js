const configs = require('./common.js');
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function deleteModule() {
    rl.question('Type ' + configs.txtBlue + 'exit ' + configs.colorReset + 'to quit or type module name to delete: ', async function(answer) {
        //check input is exit to close
        if (answer == '' || answer.match(/^e(xit)?$/i)) {
            rl.close();
        } else {
            //check module already existed to deleted
            if (fs.existsSync(configs.dirModule + answer)){
                //read file to remove import js
                let promise1 = new Promise((resolve) => {
                  fs.readFile(configs.assets + configs.fileImportJs, 'utf-8', function (err, dataJs){
                      if (err) throw err;
                      var newDataJs = removeLineWillDelete(dataJs, answer);
                      fs.writeFile(configs.assets + configs.fileImportJs, newDataJs, function (errUpdateJs){
                          if (errUpdateJs) throw errUpdateJs;
                          resolve('Unimport ' + configs.txtGreen + answer + configs.colorReset + '.js');
                      })
                  });
                })

                //read file to remove import css
                let promise2 = new Promise((resolve) => {
                  fs.readFile(configs.assets + configs.fileImportScss, 'utf-8', function (err, dataCss){
                      if (err) throw err;
                      var newDataCss = removeLineWillDelete(dataCss, answer);
                      fs.writeFile(configs.assets + configs.fileImportScss, newDataCss, function (errUpdateCss){
                          if (errUpdateCss) throw errUpdateCss;
                          resolve('Unimport ' + configs.txtGreen + answer + configs.colorReset + '.css');
                      })
                  });
                })

                //read all file inside folder
                let promise3 = new Promise((resolve) => {
                  fs.readdir(configs.dirModule + answer, (err, files) => {
                      if (err) throw err;
                      for (const file of files) {
                          // delete each file in folder
                          fs.unlink(configs.dirModule  + answer + '/' + file, err => {
                              if (err) throw err;
                              fs.rmdir(configs.dirModule + answer, err => {
                                resolve('Folder ' + configs.txtGreen + answer + configs.colorReset + ' is deleted');
                              });
                          });
                      } 
                  });
                })

                let result1 = await promise1
                let result2 = await promise2
                let result3 = await promise3

                console.log(result1)
                console.log(result2)
                console.log(result3)

                deleteModule();
                
            } else {
                //module don't exist
                console.log('Module ' + configs.txtGreen + answer +  configs.colorReset + ' does not exist');
                deleteModule();
            }
        }
    })
}

//remove line import of module will delete
function removeLineWillDelete(data, moduleDel){
    var breaklines = data.split(';');    
    for (const [index, oneLine] of breaklines.entries()) {
        if (oneLine.includes('/' + moduleDel)) {
            breaklines.splice(index, 1);
        }
    }
    return breaklines.join(';');
}

deleteModule();
