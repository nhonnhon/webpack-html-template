const configs = require('./common.js');
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function renameModule() {
    rl.question('Type ' + configs.txtBlue + 'exit ' + configs.colorReset + 'to quit or type module name to rename: ', answer => {
        //check input is exit to close
        if (answer == '' || answer.match(/^e(xit)?$/i)) {
            rl.close();
        } else {
            //check module already existed to deleted
            if (fs.existsSync(configs.dirModule + answer)){
                //type new name to rename
                rl.question('Type ' + configs.txtBlue + 'exit ' + configs.colorReset + 'to quit or type new name: ', async function(answerNewName) {
                    //check input is exit to close
                    if (answerNewName == '' || answerNewName.match(/^e(xit)?$/i) || fs.existsSync(configs.dirModule + answerNewName)) {
                        if(fs.existsSync(configs.dirModule + answerNewName)) {
                          console.log(configs.txtRed + answerNewName + configs.colorReset +' is already existed')
                        }
                        rl.close();
                    } else {
                        //read file to remove import js
                        let promise1 = new Promise((resolve) => {
                          fs.readFile(configs.assets + configs.fileImportJs, 'utf-8', function (err, dataJs){
                              if (err) throw err;
                              var newDataJs = replaceNameModule(dataJs, answer, answerNewName, 'js');
                              fs.writeFile(configs.assets + configs.fileImportJs, newDataJs, function (errUpdateJs){
                                  if (errUpdateJs) throw errUpdateJs;
                                  resolve('Rename ' + configs.txtGreen + answer + '.js' + configs.colorReset + ' to ' + configs.txtBlue + answerNewName + '.js' + configs.colorReset);
                              })
                          });
                        })

                        //read file to remove import css
                        let promise2 = new Promise((resolve) => {
                          fs.readFile(configs.assets + configs.fileImportScss, 'utf-8', function (err, dataCss){
                              if (err) throw err;
                              var newDataCss = replaceNameModule(dataCss, answer, answerNewName, 'scss');
                              fs.writeFile(configs.assets + configs.fileImportScss, newDataCss, function (errUpdateCss){
                                  if (errUpdateCss) throw errUpdateCss;
                                  resolve('Rename ' + configs.txtGreen + answer + '.scss' + configs.colorReset + ' to ' + configs.txtBlue + answerNewName + '.scss' + configs.colorReset);
                              })
                          });
                        })
                        
                        //read all file inside folder
                        let promise3 = new Promise((resolve) => {
                          fs.readdir(configs.dirModule + answer, (err, files) => {
                              if (err) throw err;
                              for (const file of files) {
                                  var newName = file.replace(answer, answerNewName);
                                  fs.rename(configs.dirModule + answer + '/' + file, configs.dirModule + answer + '/' + newName, function(err){
                                      if (err) throw err;
                                      fs.rename(configs.dirModule + answer, configs.dirModule + answerNewName,  err => {
                                        resolve('Folder ' + configs.txtGreen + answer + configs.colorReset + ' is changed to ' + configs.txtBlue + answerNewName + configs.colorReset);
                                      });
                                  })
                              }
                          });
                        })

                        let result1 = await promise1
                        let result2 = await promise2
                        let result3 = await promise3

                        console.log(result1)
                        console.log(result2)
                        console.log(result3)

                        renameModule();
                    }
                })
            } else {
                //module don't exist
                console.log('Module ' + configs.txtGreen + answer +  configs.colorReset + ' does not exist');
                renameModule();
            }
        }
        
    })
}

//rename line import of module will rename
function replaceNameModule(data, moduleRename, newName, strImport){
    var breaklines = data.split(';');    
    for (const [index, oneLine] of breaklines.entries()) {
        if (oneLine.includes('/' + moduleRename)) {
            if (strImport === 'js') {
                breaklines[index] = configs.importJs + newName + '/' + newName + '.' + strImport + '"';
            } 
            if (strImport === 'scss'){
                breaklines[index] = configs.importScss + newName + '/' + newName + '.' + strImport + '"';
            }
        }
    }
    return breaklines.join(';');
}

renameModule(); 