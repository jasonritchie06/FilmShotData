const {app, BrowserWindow, Menu, MenuItem} = require('electron') 
const url = require('url') 
const path = require('path') 
const {ipcMain} = require('electron')  
const fs = require('fs') 

let win  


function getIcon()
{
  if(process.platform === 'darwin')
  {
    return 'icon.icns'
  }
  else
  {
    return 'icon.png'
  }

}

function createWindow() { 

    win = new BrowserWindow({ 
    width: 975,
    height: 960, 
    icon: path.join(__dirname, getIcon()), 
    webPreferences: {
      nodeIntegration: true
    }
}) 

 


   win.loadURL(url.format ({ 
      pathname: path.join(__dirname, 'index2.html'), 
      protocol: 'file:', 
      slashes: true 
   })) 
   //win.webContents.openDevTools()
}  

ipcMain.on('invchange',(event) => {

  // we get the invchange here since inventory.js cannot communicate directly with index.js
  // once we get this msg we send out another msg to index.js to re-load the config file.
  win.webContents.send('invchange');
  console.log ("got our invchange in main");

})

ipcMain.on('openFile', (event, path) => { 
   const {dialog} = require('electron') 
   const fs = require('fs') 
   var lastDir = getLastDir();
  console.log("Last directory used: " + lastDir);
   //dialog.showOpenDialog({properties: ['openDirectory'],;(filePaths) => function { 
    const options = {
      //title: 'Open a file or folder',
      defaultPath: lastDir,
      //buttonLabel: 'Do it',
      /*filters: [
        { name: 'xml', extensions: ['xml'] }
      ],*/
      //properties: ['openFile', 'openDirectory', 'multiSelections']
      properties: ['openDirectory'],
      //message: 'This message will only be shown on macOS'
    };
    dialog.showOpenDialog(null, options, (filePaths) => {

      // filePaths is an array that contains all the selected 
      if(filePaths === undefined)
       { 
         console.log("No path selected"); 
      
        }
       else 
       { 
         //readFile(fileNames[0]); 
         //set location textbox to path
         //then read the info.txt file
        
         event.sender.send('path', filePaths);
         //Check if file exists
         
         event.sender.send('fileData', filePaths)
        } 
        
   });
   
   
})  
ipcMain.on('newData', (event, data) => { 
  //add new data to config file
  console.log("receieved newData:" + data);
  let line = data;
  let newCameras = "";
  let newLenses = "";
  let newFilms = "";
  let newIsos = "";
  let newFormats = "";
  let newDevelopers = "";
  let newPhotographers = "";
  let newBinders = "";

  if(line.startsWith('Cameras:'))
    {
      newCameras =  line.substr(9).trim() + ";";
    }
  else if(line.startsWith('Lenses:'))
    {
      newLenses =  line.substr(8).trim();
    }
  else if(line.startsWith('Films:'))
    {
      newFilms = line.substr(7).trim() + ";";
    }
  else if(line.startsWith('Film ISOs:'))
    {
      newIsos =  line.substr(10).trim() + ";";
    }
  else if(line.startsWith('Film Formats:'))
    {
      newFormats =  line.substr(13).trim() + ";";
    }
  else if(line.startsWith('Developers:'))
    {
      newDevelopers = line.substr(11).trim() + ";";
    }
  else if(line.startsWith('Photographers:'))
    {
      newPhotographers = line.substr(14).trim() + ";";
    }
  else if(line.startsWith('Binders:'))
    {
      newBinders = line.substr(8).trim() + ";";
    }
// end of collecting new data to add

//read in presets file
let configFile = path.join(getUserHome(), '.FilmShotDataConfig');
let cameras = "";
let lenses = "";
let films = "";
let isos = "";
let formats = "";
let developers = "";
let photographers = "";
let binders = "";
let sheetNum = "";
let create_thumbs = "";
let lastDir = "";

if(fs.existsSync(configFile))
 {
    let cfData = fs.readFileSync(configFile, 'utf8').split('\n');
     cfData.forEach((line) => {
      if(line.startsWith('Cameras:'))
          {
            cameras = line.substr(9).trim();
          }
        else if(line.startsWith('Lenses:'))
          {
            lenses = line.substr(8).trim();
          }
        else if(line.startsWith('Films:'))
          {
            films = line.substr(7).trim();
          }
        else if(line.startsWith('Film ISOs:'))
          {
            isos = line.substr(10).trim();
          }
        else if(line.startsWith('Film Formats:'))
          {
            formats = line.substr(13).trim();
          }
                          
        else if(line.startsWith('Developers:'))
          {
            developers = line.substr(11).trim();
          }
                        
        else if(line.startsWith('Photographers:'))
          {
            photographers = line.substr(14).trim();
          }
        else if(line.startsWith('Binders:'))
          {
            binders = line.substr(8).trim();
          }
        else if (line.startsWith('Last Sheet: '))
        {
          sheetNum = line.substr(11).trim();
        }
        else if(line.startsWith('Create Thumbs:'))
        {
          create_thumbs = line.substr(14).trim();
                        
        }
        else if(line.startsWith('Last Directory:'))
        {
          lastDir = line.substr(15).trim();
                        
        }
     }) //end for each

     // prepare variables to save out. We will add in in the new value here
     var cameraToSave = "Cameras: " + cameras + newCameras + "\n";
     var lensesToSave = "Lenses: " + lenses + newLenses + "\n";
     var filmToSave = "Films: " + films + newFilms +  "\n";
     var isoToSave = "Film ISOs: " + isos + newIsos + "\n";
     var formatToSave = "Film Formats: " + formats + newFormats + "\n";
     var developerToSave = "Developers: " + developers + newDevelopers + "\n";
     var photogToSave = "Photographers: " + photographers + newPhotographers + "\n";
     var binderToSave = "Binders: " + binders + newBinders +  "\n";
     var lastSheet = "Last Sheet: " + sheetNum + "\n";
     var createThumbs = "Create Thumbs: " + create_thumbs + "\n";
     var lastDirectory = "Last Directory: " + lastDir;
     
     var dataOut = cameraToSave + lensesToSave + filmToSave + isoToSave + formatToSave + developerToSave +
     photogToSave + binderToSave + lastSheet + createThumbs + lastDirectory;
     try {
             fs.writeFileSync(configFile, dataOut, 'utf-8');
            console.log("saved config file.");
          }
     catch(e)
          {
              console.log('Failed to save the presets file !');
          }         
                  
      }// End if



});

function getLastDir()
{
  var lastDirectory="";
  let configFile = path.join(getUserHome(), '.FilmShotDataConfig');

  if(fs.existsSync(configFile))
 {
    let cfData = fs.readFileSync(configFile, 'utf8').split('\n');
     cfData.forEach((line) => {
      if(line.startsWith('Last Directory:'))
          {
            lastDirectory = line.substr(16).trim();

          }

     }) //end for each
     console.log("returning: " + lastDirectory);
     return lastDirectory;
    }
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

app.on('ready', createWindow)
