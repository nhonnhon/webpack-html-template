# webpack-html-template

Build a webpack template for html static, just frontend. Include and extend another file, combine sass from folder, combine js from another folder.

### Install
  - open command line and type: **$ npm install**

### Prepare
  - Look the source code and try to understand how the webpack do.
  - First thing, folder **assets** has 3 folders **js, scss, images**. 
    In folder js, all js file will be imported in script.js.
    In folder scss, all scss file will be imported in style.scss.
    In folder images, all images will be stored.
  - Second thing, folder **module** has subfolders, each subsfolder has 3 file **.css, .html, .js**.
  - Last thing, each html file will include some modules or extend from another file. 
    
### Start 
  - In command line, type: **$ npm start**
  - The webpack read config in file webpack.dev.js and open browser with port you already configured.
  - Look file webpack.dev.js, you will see the port in line 9, you can change any port you line.
  - When you change any file in source code, browser will be automatic refresh.
  
### Build
  - In command line, type: **$ npm run build**
  - The webpack read config in file webpack.prod.js and bundle your source code to dist folder.


