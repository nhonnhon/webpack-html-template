const configs = require('./common.js');
const readline = require("readline");
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function createModule() {
    rl.question('Type ' + configs.txtBlue + 'exit ' + configs.colorReset + 'to quit or type module name to create: ', answer => {
        //check input is exit to close
        if (answer == '' || answer.match(/^e(xit)?$/i)) {
            rl.close();
        } else {
            if (!fs.existsSync(configs.dirModule + answer)){
                //create new folder
                fs.mkdir(configs.dirModule + answer, async function(err) {
                    if (err) {
                        console.log(configs.txtRed + 'Has problem when create new module' + configs.textWhite);
                        rl.close();
                    } else {
                        console.log('Creating...');
                        //create html file in new folder
                        let promise = new Promise((resolve) => {
                          fs.writeFile(configs.dirModule + answer + '/' + answer + '.html', '', function(errHTML) {
                              if (errHTML) throw errHTML;
                              //create css file in new folder
                              fs.writeFile(configs.dirModule + answer + '/' + answer + '.scss', '', function(errCSS) {
                                  if (errCSS) throw errCSS;
                                  //create js file in new folder
                                  fs.writeFile(configs.dirModule + answer + '/' + answer + '.js', '', function(errJS) {
                                      if (errJS) throw errJS;
                                      //import scss file to scss common
                                      fs.appendFile(configs.assets + configs.fileImportScss, configs.importScss + answer + '/' + answer + '.scss";', function(err){
                                          console.log('File ' + configs.txtGreen + answer +  '.scss '+ configs.colorReset +'is' + ' imported');
                                          //import js file to js common
                                          fs.appendFile(configs.assets + configs.fileImportJs, configs.importJs + answer + '/' + answer + '.js";', function(err){
                                              console.log('File ' + configs.txtGreen + answer +  '.js '+ configs.colorReset +'is' + ' imported');
                                              resolve('Module ' + configs.txtGreen + answer +  configs.colorReset + ' is created')
                                          })
                                      })
                                  })
                              })
                          })
                        })

                        let result = await promise; 
                        console.log(result);
                        createModule();
                    }
                });
            } else {
                console.log('Module ' + configs.txtGreen + answer +  configs.colorReset + ' is existed');
                createModule();
            }
        }
    });
}

createModule();
