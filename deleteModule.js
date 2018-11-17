const configs = require('./common.js');
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function deleteModule() {
    rl.question('Type ' + configs.txtBlue + 'exit ' + configs.textWhite + 'to quit or type module name to rename: ', answer => {
        //check input is exit to close
        if (answer.match(/^e(xit)?$/i)) {
            rl.close();
        } else {
            //check module already existed to deleted
            if (fs.existsSync(configs.dirModule + answer)){
                //read file to remove import js
                fs.readFile(configs.assets + configs.fileImportJs, 'utf-8', function (err, dataJs){
                    if (err) throw err;
                    var newDataJs = removeLineWillDelete(dataJs, answer);
                    fs.writeFile(configs.assets + configs.fileImportJs, newDataJs, function (errUpdateJs){
                        if (errUpdateJs) throw errUpdateJs;
                        console.log('Unimport ' + configs.txtGreen + answer + configs.textWhite + '.js');
                    })
                });
                //read file to remove import css
                fs.readFile(configs.assets + configs.fileImportScss, 'utf-8', function (err, dataCss){
                    if (err) throw err;
                    var newDataCss = removeLineWillDelete(dataCss, answer);
                    fs.writeFile(configs.assets + configs.fileImportScss, newDataCss, function (errUpdateCss){
                        if (errUpdateCss) throw errUpdateCss;
                        console.log('Unimport ' + configs.txtGreen + answer + configs.textWhite + '.css');
                    })
                });
                //read all file inside folder
                fs.readdir(configs.dirModule + answer, (err, files) => {
                    if (err) throw err;
                    for (const file of files) {
                        // delete each file in folder
                        fs.unlink(configs.dirModule  + answer + '/' + file, err => {
                            if (err) throw err;
                            
                        });
                    } 
                });
                setTimeout(function() {
                    //delete folder after delete sub of folder
                    fs.rmdir(configs.dirModule + answer, err => {
                        console.log('Folder ' + configs.txtGreen + answer + configs.textWhite + ' deleted');
                        deleteModule();
                    });
                }, 1000);
            } else {
                //module don't exist
                console.log('Module ' + configs.txtGreen + answer +  configs.textWhite + ' do not exist');
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
