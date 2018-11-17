const configs = require('./common.js');
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function renameModule() {
    rl.question('Type ' + configs.txtBlue + 'exit ' + configs.textWhite + 'to quit or type module name to rename: ', answer => {
        //check input is exit to close
        if (answer.match(/^e(xit)?$/i)) {
            rl.close();
        } else {
            //check module already existed to deleted
            if (fs.existsSync(configs.dirModule + answer)){
                //type new name to rename
                rl.question('Type ' + configs.txtBlue + 'exit ' + configs.textWhite + 'to quit or type new name: ', answerNewName => {
                    //check input is exit to close
                    if (answer.match(/^e(xit)?$/i)) {
                        rl.close();
                    } else {
                        //read file to remove import js
                        fs.readFile(configs.assets + configs.fileImportJs, 'utf-8', function (err, dataJs){
                            if (err) throw err;
                            var newDataJs = replaceNameModule(dataJs, answer, answerNewName, 'js');
                            fs.writeFile(configs.assets + configs.fileImportJs, newDataJs, function (errUpdateJs){
                                if (errUpdateJs) throw errUpdateJs;
                                console.log('Rename ' + configs.txtGreen + answer + configs.textWhite + '.js');
                            })
                        });
                        //read file to remove import css
                        fs.readFile(configs.assets + configs.fileImportScss, 'utf-8', function (err, dataCss){
                            if (err) throw err;
                            var newDataCss = replaceNameModule(dataCss, answer, answerNewName, 'scss');
                            fs.writeFile(configs.assets + configs.fileImportScss, newDataCss, function (errUpdateCss){
                                if (errUpdateCss) throw errUpdateCss;
                                console.log('Rename ' + configs.txtGreen + answer + configs.textWhite + '.scss');
                            })
                        });
                        //read all file inside folder
                        fs.readdir(configs.dirModule + answer, (err, files) => {
                            if (err) throw err;
                            for (const file of files) {
                                var newName = file.replace(answer, answerNewName);
                                fs.rename(configs.dirModule + answer + '/' + file, configs.dirModule + answer + '/' + newName, function(err){
                                    if (err) throw err;
                                })
                            }
                        });
                        setTimeout(function() {
                            //rename folder after rename sub of folder
                            fs.rename(configs.dirModule + answer, configs.dirModule + answerNewName,  err => {
                                console.log('Folder ' + configs.txtGreen + answer + configs.textWhite + ' renamed');
                                renameModule();
                            });
                        }, 1000);
                    }
                })
            } else {
                //module don't exist
                console.log('Module ' + configs.txtGreen + answer +  configs.textWhite + ' do not exist');
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