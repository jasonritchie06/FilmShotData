    const {ipcRenderer} = require('electron') 
    const path = require('path')
    const {app} = require('electron') 
    const fs = require('fs') 
    const { remote } = require('electron');
    const {Menu, MenuItem} = remote
    const {ipcMain} = require('electron') 
    const { writeFileSync } = require('fs');
    const Jimp = require('jimp');



document.getElementById('openFile').onclick = (event) => {
    ipcRenderer.send('openFile');
}



document.getElementById('closeForm').onclick = (event) => {
    
    window.close(); 
     
}

document.getElementById('saveForm').onclick = (event) => {
    
    saveData(); 
    
     
}
document.getElementById('loadInventory').onclick = (event) => {
    loadInventory();
    
}

function loadInventory(){
    let win = new remote.BrowserWindow({
        width: 975,
        height: 920, 
        icon: 'icon.png', 
        parent: remote.getCurrentWindow(),
        modal: true, 
        webPreferences: {
          nodeIntegration: true
        }
      })
      //win.setMenuBarVisibility(false);
      win.setAutoHideMenuBar(true);
      //win.webContents.openDevTools()
       var theUrl = 'file://' + path.join(__dirname, 'inventory.html')
       win.loadURL(theUrl);
       

}

function loadInstructions(){
  let win = new remote.BrowserWindow({
      width: 975,
      height: 920, 
      icon: 'icon.png', 
      parent: remote.getCurrentWindow(),
      modal: true, 
      webPreferences: {
        nodeIntegration: true
      }
    })
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);
   
     var theUrl = 'file://' + path.join(__dirname, 'instructions.html')
     win.loadURL(theUrl);
     
}
function loadAbout(){
  let win = new remote.BrowserWindow({
      width: 775,
      height: 780, 
      icon: 'icon.png', 
      parent: remote.getCurrentWindow(),
      modal: true, 
      webPreferences: {
        nodeIntegration: true
      }
    })
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);
     var theUrl = 'file://' + path.join(__dirname, 'about.html')
     win.loadURL(theUrl);
}
document.getElementById("lenses_used").addEventListener("dblclick",function(e) {
    // e.target is our targetted element.
    // try doing console.log(e.target.nodeName), it will result LI
    if(e.target && e.target.nodeName == "LI") {
        //console.log(e.target.id + " was clicked");
        //ulElem.removeChild(ulElem.childNodes[e.target.id])
        var ul = document.getElementById("lenses_used");
        ul.removeChild(e.target);
    }
});

document.getElementById('lens').onchange= (event) => {
  var newValue = document.getElementById('lens').value;
  if(newValue.trim() == "")
  {
    return;
  }
  var ul = document.getElementById("lenses_used");
  var items = ul.getElementsByTagName('li');
  for (var i= 0, n= items.length; i < n ; i++) {
        console.log(items[i].innerText);
        if(items[i].innerText == newValue){
          console.log("found existing item:" + newValue + " matches:" + items[i].innerText)

          document.getElementById('lens').value = "";
          return;
        } 
        else
        {
          //ipcRenderer.send('newData', "Lenses: " + newValue + ";"); 
        }
    }
    var li = document.createElement("li");
    li.setAttribute('id',newValue);
    li.appendChild(document.createTextNode(newValue));
    ul.appendChild(li);
    document.getElementById('lens').value = "";
}

document.getElementById('gen').onclick = () => {
    let curSheetNum = getLastSheetNum(); 
    curSheetNum = Number(curSheetNum) + 1;
    updateLastSheet(curSheetNum);
    console.log("curSheetNum: " + curSheetNum);
    document.getElementById('sheet').value = curSheetNum;
}
window.onload = function(){ loadForm(); }
ipcRenderer.on('fileData', (event, data) => { 
   //document.write(data) 
}) 

ipcRenderer.on('path', (event, data) => { 
  //blank out form
  clearForm();
  loadInfoFile(data); 
            
})

ipcRenderer.on('invchange', (event, data) => { 
  
  loadConfig(); 
            
})

function loadInfoFile(data)
{
  document.getElementById('location').value = data;
  updateLastDirectory(data);
   let filename = path.join(data[0], 'info.txt');
   console.log("Filename:" + filename);
         
         if(fs.existsSync(filename)) {
            let fileData = fs.readFileSync(filename, 'utf8').split('\n');
            
            fileData.forEach((line) => {
               if(line.startsWith('Camera:'))
               {
                let camera = line.substr(8).trim();
                let found=0;
                  console.log("Camera:" + camera)
                  document.getElementById('camera').value = camera;
                  var options= document.getElementById('cameras').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==camera) {
                          document.getElementById("cameras").selectedIndex = i;
                          console.log("matched " + camera + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add camera to config list
                    //ipcRenderer.send('newData', "Cameras: " + camera );
                  }
               }
               else if(line.startsWith('Lens:'))
               {
                  let lineData = line.substr(6).trim();
                  let options = "";
                  console.log(lineData);
                  lenses=lineData.split(',');
                  lenses.forEach((lens, index) =>{
                    if(lens != "")
                    {
                      var ul = document.getElementById("lenses_used");
                      var li = document.createElement("li");
                       li.setAttribute('id',lens);
                       li.appendChild(document.createTextNode(lens));
                       ul.appendChild(li);
                    } 

                                           
                  })
                  
               }
               else if(line.startsWith('Film:'))
               {
                let film = line.substr(5).trim();
                let found=0;
                  console.log("Film:" + film)
                  document.getElementById('film').value = film;
                  var options= document.getElementById('films').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==film) {
                          document.getElementById("films").selectedIndex = i;
                          console.log("matched " + film + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add film to config list
                    //ipcRenderer.send('newData', "Films: " + film );
                  }
                 }
                else if(line.startsWith('Film Type:'))
                {
                  let filmType = line.substr(11).trim();
                  let found=0;
                  console.log("Film Type:" + filmType)
                  document.getElementById('type').value = filmType;
                  var options= document.getElementById('types').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==filmType) {
                          document.getElementById("types").selectedIndex = i;
                          console.log("matched " + filmType + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add film to config list
                    //ipcRenderer.send('newData', "Film Types: " + filmType );
                  }
                 }
                 else if(line.startsWith('Film Shot ISO:'))
                {
                  let found = 0;
                  let iso = line.substr(14).trim();
                  console.log("Film Shot ISO:" + iso)
                  document.getElementById('ISO').value = iso;
                  var options= document.getElementById('ISOs').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==iso) {
                          document.getElementById("ISOs").selectedIndex = i;
                          console.log("matched " + iso + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add film to config list
                    //ipcRenderer.send('newData', "Film ISOs: " + iso );
                  }
                 }
                 else if(line.startsWith('Date:'))
                 {
                  let lineData = line.substr(6);
                  console.log("Date: " + lineData);
                  //find out if a dash or slash was used
                  //if(lineData)
                  //var dateParts = lineData.split('/');
                  document.getElementById('date').value = getDate(lineData);
                  
                 }
                 else if(line.startsWith('Binder Sheet:'))
                 {
                  let lineData = line.substr(14);
                  document.getElementById('sheet').value = lineData;
                  
                 }
                 else if(line.startsWith('Title:'))
                 {
                  let lineData = line.substr(7);
                  document.getElementById('title').value = lineData;
                  
                 }
                 else if(line.startsWith('Film Format:'))
                {
                  let found = 0;
                  let format = line.substr(12).trim();
                  console.log("Film Format:" + format)
                  document.getElementById('format').value = format;
                  var options= document.getElementById('formats').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==format) {
                          document.getElementById("formats").selectedIndex = i;
                          console.log("matched " + format + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add film to config list
                    //ipcRenderer.send('newData', "Film Formats: " + format );
                  }
                 }
                 else if(line.startsWith('Developer:'))
                {
                  let found = 0;
                  let developer = line.substr(11).trim();
                  console.log("Developer:" + developer)
                  document.getElementById('developer').value = developer;
                  var options= document.getElementById('developers').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==developer) {
                          document.getElementById("developers").selectedIndex = i;
                          console.log("matched " + developer + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add film to config list
                    //ipcRenderer.send('newData', "Developers: " + developer );
                  }
                 }
                 else if(line.startsWith('Photographer:'))
                {
                  let found = 0;
                  let photog = line.substr(14).trim();
                  console.log("Photographer:" + photog)
                  document.getElementById('photographer').value = photog;
                  var options= document.getElementById('photographers').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==photog) {
                          document.getElementById("photographers").selectedIndex = i;
                          console.log("matched " + photog + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add film to config list
                    //ipcRenderer.send('newData', "Photographers: " + photog );
                  }
                 }
                 else if(line.startsWith('Binder:'))
                {
                  let found = 0;
                  let binder = line.substr(8).trim();
                  console.log("Binder:" + binder)
                  document.getElementById('binder').value = binder;
                  var options= document.getElementById('binders').options;
                  for (var i= 0, n= options.length; i < n ; i++) {
                      if (options[i].value==binder) {
                          document.getElementById("binders").selectedIndex = i;
                          console.log("matched " + binder + " to " + options[i].value);
                          found=1;
                          break;
                      }
                  }
                  if(found == 0)
                  {
                     //send msg back to main to add film to config list
                    //ipcRenderer.send('newData', "binder:" + binder );
                  }
                 }
                 else if(line.startsWith('People:'))
                 {
                  let lineData = line.substr(8);
                  document.getElementById('people').value = lineData;
                  
                 }
                 else if(line.startsWith('Location:'))
                 {
                  let lineData = line.substr(10);
                  document.getElementById('locations').value = lineData;
                  
                 }
                 else if(line.startsWith('Memo:'))
                 {
                  let lineData = line.substr(5);
                  document.getElementById('memo').value = lineData;
                  
                 }
         
            })
            
      
            } 
            else
            {
              return;
            }
}
function getDate(dt){
  var year
  var month
  var day
  var dtParts
  //find out if a dash or slash was used
  if(dt.indexOf('/')>0)
  {
    //we used a slash
    dtParts = dt.trim().split('/');
    day = dtParts[0];
    month = dtParts[1];
    year = dtParts[2];
    if(day.length < 2)
    {
      day = '0' + day;
    }
    if(month.length < 2)
    {
      month = '0' + month;
    }
    if(year.length < 4)
    {
      if(year < 50){
        year = '20' + year;
      }else{
      year = '19' + year;
      }
    }
    
  }
  else if(dt.indexOf('-')>0)
  {
    // we used a dash
    dtParts = dt.trim().split('-');
    day = dtParts[0];
    month = dtParts[1];
    year = dtParts[2];
    if(day.length < 2)
    {
      day = '0' + day;
    }
    if(month.length < 2)
    {
      month = '0' + month;
    }
    if(year.length < 4)
    {
      if(year < 50){
        year = '20' + year;
      }
      else{
      year = '19' + year;
      }
    }
    
  }
  console.log("getDate:returning:" + year + '-' + day + '-' + month);
  return year + '-' + day + '-' + month;
}


function clearForm(){
  //function to blank form between views
  document.getElementById("myForm").reset();
  // need to clear lenses list
  document.getElementById("lenses_used").innerHTML = "";
}


function loadForm(){
    var menu = Menu.buildFromTemplate([
        {
            label: 'File',
                submenu: [
                {
                  label:'Open Location',
                  click()  {
                    ipcRenderer.send('openFile')
                  }
                
                },
                {
                  label:'Save Data',
                  click() {
                    saveData();
                    
                  }
                },
                {
                  label:'Manage Inventory',
                  click() {
                      loadInventory()
                  }
                },
                
                {
                    role:'Quit', 
                    click() { 
                        app.quit() 
                    } 
                }
             ] //end submenu

        },
      {
      label: 'Help',
          submenu: [
          {
            label:'Instructions',
            click()  {
              // open instructions page
              loadInstructions()
            }
          
          },
          {
            label:'About', 
            click() { 
                // open about page 
                loadAbout()
            } 
        }
        ]}
      ])
      Menu.setApplicationMenu(menu);

// read in the config file and preload the controls with preset data
console.log("we hit loadForm function");
loadConfig();


}

function loadConfig(){

  let configFile = path.join(getUserHome(), '.FilmShotDataConfig');
   console.log("configFile: " + configFile);
         
         if(fs.existsSync(configFile)) {
           // clear exisiting lists
           document.getElementById('cameras').innerHTML = '';
           document.getElementById('lenses').innerHTML = '';
           document.getElementById('films').innerHTML = '';
           document.getElementById('ISOs').innerHTML = '';
           document.getElementById('formats').innerHTML = '';
           document.getElementById('developers').innerHTML = '';
           document.getElementById('photographers').innerHTML = '';
           document.getElementById('binders').innerHTML = '';
           document.getElementById('status').innerHTML = '';
            let cfData = fs.readFileSync(configFile, 'utf8').split('\n');
            
            cfData.forEach((line) => {
               if(line.startsWith('Cameras:'))
               {
                let cameras = line.substr(9).trim().split(';');
                  console.log("Cameras:" + cameras)
                  var list = document.getElementById('cameras');
                  cameras.forEach((camera) => {
                    var option = document.createElement('option');
                    option.value = camera;
                    list.appendChild(option);

                  })
               }
               else if(line.startsWith('Lenses:'))
               {
                let lenses = line.substr(8).trim().split(';');
                  console.log("Lenses:" + lenses)
                  var list = document.getElementById('lenses');
                  lenses.forEach((lens) => {
                    var option = document.createElement('option');
                    option.value = lens;
                    list.appendChild(option);
                  })
                }
                else if(line.startsWith('Films:'))
                {
                  let films = line.substr(7).trim().split(';');
                    console.log("Films:" + films)
                    var list = document.getElementById('films');
                    films.forEach((film) => {
                      var option = document.createElement('option');
                      option.value = film;
                      list.appendChild(option);
                    })
                  }
                  else if(line.startsWith('Film ISOs:'))
                  {
                    let isos = line.substr(10).trim().split(';');
                      console.log("ISOs:" + isos)
                      var list = document.getElementById('ISOs');
                      isos.forEach((iso) => {
                        var option = document.createElement('option');
                        option.value = iso;
                        list.appendChild(option);
                      })
                    }
                    else if(line.startsWith('Film Formats:'))
                    {
                      let formats = line.substr(13).trim().split(';');
                        console.log("Film Formats:" + formats)
                        var list = document.getElementById('formats');
                        formats.forEach((format) => {
                          var option = document.createElement('option');
                          option.value = format;
                          list.appendChild(option);
                        })
                      }
                      
                      else if(line.startsWith('Developers:'))
                      {
                        let developers = line.substr(11).trim().split(';');
                          console.log("Developers" + developers)
                          var list = document.getElementById('developers');
                          developers.forEach((developer) => {
                            var option = document.createElement('option');
                            option.value = developer;
                            list.appendChild(option);
                          })
                        }
                        else if(line.startsWith('Photographers:'))
                        {
                          let photographers = line.substr(14).trim().split(';');
                            console.log("Photographers" + photographers)
                            var list = document.getElementById('photographers');
                            photographers.forEach((photographer) => {
                              var option = document.createElement('option');
                              option.value = photographer;
                              list.appendChild(option);
                            })
                          }
                          else if(line.startsWith('Binders:'))
                          {
                            let binders = line.substr(8).trim().split(';');
                              console.log("Binders" + binders)
                              var list = document.getElementById('binders');
                              binders.forEach((binder) => {
                                var option = document.createElement('option');
                                option.value = binder;
                                list.appendChild(option);
                              })
                            }
                          else if(line.startsWith('Create Thumbs:'))
                          {
                            let create_thumbs = line.substr(14).trim();
                              console.log("create_thumbs" + create_thumbs)
                              document.getElementById('create_thumbs').innerHTML = create_thumbs;
                            }
              } //end for each

              //document.getElementById('status').innerHTML = '';
            )
            //status("Loaded confile file and now ready...");
          }
            else{
                //file didn't exist. display a msg to add equip via inventory
                status('No inventory found. Open Inventory to add a camera, lens, film, developer, etc...');
            }
            
}
function status(msg)
{
  document.getElementById('status').innerHTML = msg;

}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
function getLastSheetNum() {
  let configFile = path.join(getUserHome(), '.FilmShotDataConfig');
  let lastSheet
         
         if(fs.existsSync(configFile)) {
            let cfData = fs.readFileSync(configFile, 'utf8').split('\n');
            
            cfData.forEach((line) => {
               if(line.startsWith('Last Sheet:'))
               {
                lastSheet = Number(line.substr(11).trim());
                
               }

           })
           console.log("returning lastSheet:" + lastSheet);
 
           
           
          }
          if(typeof lastSheet == 'number')
           {
            return lastSheet;
           }
           else
           {
            return 0;
           }
}

async function saveData()
{
  await disableForm("true");
  await saveDataAsync()
  status("Done saving files...")
  alert('Files Saved!')
  status("");
  disableForm("false");
 
}

const saveDataAsync = async () => {

  var result = await saveData2();
  var result2 = await saveHTML();
  
  return "done";
  
}

async function saveData2()
{
 
  var location = document.getElementById('location').value;
    if(location == "")
    {
        console.log("no path chosen");
        return;
    }

    status("Writing info file...");
    console.log("we have a path to save the data. " + location) + "\n";
    var cameraToSave = "Camera: " + document.getElementById('camera').value.trim() + "\n";
    var lensesToSave = "Lens: " + getLenses() + "\n";
    var filmToSave = "Film: " + document.getElementById('film').value.trim() + "\n";
    var filmtypeToSave = "Film Type: " + document.getElementById('type').value.trim() + "\n";
    var isoToSave = "Film Shot ISO: " + document.getElementById('ISO').value.trim() + "\n";
    var formatToSave = "Film Format: " + document.getElementById('format').value.trim() + "\n";
    var developerToSave = "Developer: " + document.getElementById('developer').value.trim() + "\n";
    var dateToSave = "Date: " + formatDate(document.getElementById('date').value) + "\n";
    var photogToSave = "Photographer: " + document.getElementById('photographer').value.trim() + "\n";
    var peopleToSave = "People: " + document.getElementById('people').value.trim() + "\n";
    var locationsToSave = "Location: " + document.getElementById('locations').value.trim() + "\n";
    var binderSheetToSave = "Binder Sheet: " + document.getElementById('sheet').value.trim() + "\n";
    var binderToSave = "Binder: " + document.getElementById('binder').value.trim() + "\n";
    var memoToSave = "Memo: " + document.getElementById('memo').value.trim() + "\n";
    var titleToSave = "Title: " + document.getElementById('title').value.trim() + "\n";
    var dataOut = cameraToSave + lensesToSave + filmToSave + filmtypeToSave + isoToSave + formatToSave + developerToSave +
    dateToSave + photogToSave + peopleToSave + locationsToSave + binderSheetToSave + binderToSave + memoToSave + titleToSave;
    try {
            await fs.writeFileSync(path.join(location, "info.txt"), dataOut, 'utf-8');
            //saveHTML();
            //alert('File saved');
         }
    catch(e)
         {
             alert('Failed to save the file ! ' + e);
         }
         return("success");
        
}

async function saveHTML()
{
  
  var location = document.getElementById('location').value;
  if(location == "")
  {
      //console.log("no path chosen");
      return "fail";
  }
  status("Genrating html file ...");
  console.log("we have a path to save the html. " + location) + "\n";
  var style = "<style>" + "\n" +
  "img {" + "\n" +
  "  border: 1px solid #ddd;" + "\n" +
    "border-radius: 4px;" + "\n" +
    "padding: 5px;" + "\n" +
    "max-width: 450px;" + "\n" +
    "max-height: 450px;" + "\n" +
  "}" + "\n" + "\n" + 
  "  img:hover {" + "\n" +
    "box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);" + "\n" +
  "}" + "\n" +
  "</style>" + "\n"
  var cameraToSave =  document.getElementById('camera').value.trim() + "\n";
  var lensesToSave =  getLenses() + "\n";
  var filmToSave =  document.getElementById('film').value.trim() + "\n";
  var filmtypeToSave =  document.getElementById('type').value.trim() + "\n";
  var isoToSave = document.getElementById('ISO').value.trim() + "\n";
  var formatToSave = document.getElementById('format').value.trim() + "\n";
  var developerToSave =  document.getElementById('developer').value.trim() + "\n";
  var dateToSave =  formatDate(document.getElementById('date').value) + "\n";
  var photogToSave =  document.getElementById('photographer').value.trim() + "\n";
  var peopleToSave =  document.getElementById('people').value.trim() + "\n";
  var locationsToSave =  document.getElementById('locations').value.trim() + "\n";
  var binderSheetToSave =  document.getElementById('sheet').value.trim() + "\n";
  var binderToSave =  document.getElementById('binder').value.trim() + "\n";
  var memoToSave =  document.getElementById('memo').value.trim() + "\n";
  var titleToSave =  document.getElementById('title').value.trim() + "\n";
  var htmlHeader = "<!DOCTYPE html>" + "\n" + "<html>" + "\n" + "   <head>" + "\n" + "        <meta charset = \"UTF-8\">" + 
  "        <title>File Scan Data Film Details</title>" + "        <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">" +
  "     </head> " + "\n";
  var htmlBody = "<body lang=\"en-US\" dir=\"ltr\">" + "\n";
  var htmlPre = "<p><font size=\"4\" style=\"font-size: 15pt\">";
  var htmlTitle = htmlPre + "<b>Title:</b>  <i>" + titleToSave + "</i></font></p>" + "\n";
  var htmlDate = htmlPre + "<b>Date:</b> " + getLongDate(dateToSave) + "</font></p>" + "\n";
  var htmlPhotographer = htmlPre + "<b>Photographer:</b> " + photogToSave + "</font></p>" + "\n";
  var htmlNegLoc = htmlPre + "<b>Negatives are stored in Sheet#:</b> " + binderSheetToSave + "<b> and Binder#: </b>" + binderToSave + " </font></p>" + "\n";
  var htmlCamera = htmlPre + "<b>Camera Used:</b> " + cameraToSave + "</font></p>" + "\n";
  var htmlLenses = htmlPre + "<b>Lenses Used:</b> " +  lensesToSave + "</font></p>" + "\n";
  var htmlFilm = htmlPre + "<b>Film Used: </b>" + filmToSave + "</font></p>" + "\n";
  var htmlFormat = htmlPre + "<b>Film Format:</b> " + formatToSave + "</font></p>" + "\n";
  var htmlFilmType = htmlPre + "<b>Film Type:</b> " + filmtypeToSave + "</font></p>" + "\n";
  var htmlFilmSpeed = htmlPre + "<b>Film Speed Used:</b> " + isoToSave + "</font></p>" + "\n";
  var htmlDeveloper = htmlPre + "<b>Developer Used:</b> " + developerToSave + "</font></p>" + "\n";
  var htmlPeople = htmlPre + "<b>People In The Photos: </b> " + peopleToSave + "</font></p>" + "\n";
  var htmlPlaces = htmlPre + "<b>Places In The Photos:</b> " + locationsToSave + "</font></p>" + "\n";
  var htmlNotes = htmlPre + "<b>Notes: </b> " + memoToSave + "</font></p>" + "\n";
  var htmlPost = "</body>" + "\n" + "</html>" + "\n";
  var htmlImages ="";
  console.log(document.getElementById('create_thumbs').innerText)
  if(document.getElementById('create_thumbs').innerText =='yes')
  {
    
    htmlImages = await getImages(location);
    
    
  }
  else
  {
    htmlImages = htmlPre + "<b>Image Files: </b> " + getImageNames(location) + "</font></p>" + "\n";
  }
  
  var dataOut = htmlHeader + style + htmlBody + htmlTitle + htmlDate + htmlPhotographer + htmlNegLoc + htmlCamera +
  htmlLenses + htmlFilm + htmlFormat + htmlFilmType + htmlFilmSpeed + htmlDeveloper + htmlPeople + htmlPlaces + htmlNotes + htmlImages + htmlPost;
  try {
          fs.writeFileSync(path.join(location, "index.html"), dataOut, 'utf-8');
          
       }
  catch(e)
       {
          alert(e);
       }
       //alert('File saved');
       return ("success");

       
}

function getImageNames(location)
{
  status ("Getting image names from " + location);
  var files = fs.readdirSync(location, []);
  var fileNames="";

  files.forEach(file => {
      //console.log(file);
      if (path.extname(file) == ".jpg" || path.extname(file) == ".tif")
      {
       fileNames += file + ", ";
      }
  });
return fileNames;
}

async function getImages(location)
{

  var preHTML = "<table>" + "\n";
  var postHTML = "\n" + "</table>" + "\n";
  var preRow = "  <tr>" + "\n";
  var postRow = "\n" + "  </tr>" + "\n";
  var preIMG = "\"> <img src=\"./small/";
  var postIMG = "\"></a></td>";
  var htmlOut = preRow;
  var colCount = 0;
  var preA = "<td><a target=\"_blank\" href=\"./small/";
  var postA = "\" title=\"";
  var imageToSave;

  var files = fs.readdirSync(location, []);

    status ("Getting images from " + location);
    await files.forEach( file => {
      console.log(file);
      if (path.extname(file) == ".jpg" || path.extname(file) == ".tif")
      {
        if(path.extname(file) == ".tif")
        {
          imageToSave = file.split('.').slice(0, -1).join('.') + ".jpg";
        }
        else
        {
          imageToSave = file;
        }
        console.log("found jpeg " + file);
         
        if(colCount == 4)
        {
          htmlOut += postRow + preRow;
          htmlOut += preA + imageToSave + postA + imageToSave + preIMG + imageToSave + postIMG;
          colCount = 1;
        }
        else if(colCount == 0)
        {
          //htmlOut += preRow;
          htmlOut += preA + imageToSave + postA + imageToSave + preIMG + imageToSave + postIMG;
          colCount ++;
        }
        else
        {
          htmlOut += preA + imageToSave + postA + imageToSave + preIMG + imageToSave + postIMG;
          colCount ++;
        }
        
      }
  });
  var result = await resizeImages(location);
  console.log(result);
  console.log(colCount);

  return (preHTML + htmlOut + postRow + postHTML);
 
     
}

async function resizeImages(location)
{
  var jpgCount=0;
  var line=1;
  var smallCount=0;
  var jpgSize=0;
  var jpgQuality = 50;
  var scaleFactor = 1;
  var imgWidth;
  var imgHeight;
  var imgLongestEdge;
  var imageToSave;

  const files = await fs.readdirSync(location, []);
  for (const file of files) {
    if (path.extname(file) == ".jpg" || path.extname(file) == ".tif")
    {
      if(path.extname(file) == ".tif")
      {
        imageToSave = file.split('.').slice(0, -1).join('.') + ".jpg";
      }
      else
      {
        imageToSave = file;
      }
      jpgCount ++; // getting a count of jpgs for the progressbar
      if(fs.existsSync(path.join(location,"small",imageToSave)))
      {
        smallCount ++;
      }
    }
  }
  if(smallCount == jpgCount)
  {
    status("Thumbnails already exisit. No need to recreate...");
    return "finished";
  }
  progress(line,jpgCount,"yes");
  for (const file of files) {
    if (path.extname(file) == ".jpg" || path.extname(file) == ".tif")
    {
      //if(!file.exists(path.join(location,"small",file)))
        //jpgSize = getFilesize(file);
        //if(jpgSize >= 1)
        if(path.extname(file) == ".tif")
        {
          imageToSave = file.split('.').slice(0, -1).join('.') + ".jpg";
        }
        else
        {
          imageToSave = file;
        }

        status ("Creating thumbnail image: " + imageToSave + " this might take a bit...");
        try
        {
            const image = await Jimp.read(path.join(location,file));
            imgWidth = image.bitmap.width;
            imgHeight = image.bitmap.height;
            if(imgWidth > imgHeight)
            {
              //image is in landscape orientation
              imgLongestEdge = imgWidth;
            }
            else if(imgWidth < imgHeight)
            {
              //image is in landscape orientation
              imgLongestEdge = imgHeight;
            }
            else
            {
              // image could be square format so doesn't matter
              //we'll use height since they are the same
              imgLongestEdge = imgHeight;
    
            }
    
            //determine the appropriate scale factor based on images longest edge
            if(imgLongestEdge >= 20000)
            {
              scaleFactor = .07;
            }
            else if(imgLongestEdge >= 15000)
            {
              scaleFactor = .08;
            }
            else if(imgLongestEdge >= 10000)
            {
              scaleFactor = .09;
            }
            else if(imgLongestEdge >= 9000)
            {
              scaleFactor = .1;
            }
            else if(imgLongestEdge >= 8000)
            {
              scaleFactor = .15;
            }
            else if(imgLongestEdge >= 7000)
            {
              scaleFactor = .2;
            }
            else if(imgLongestEdge >= 6000)
            {
              scaleFactor = .25;
            }
            else if(imgLongestEdge >= 5000)
            {
              scaleFactor = .29;
            }
            else if(imgLongestEdge >= 4500)
            {
              scaleFactor = .32;
            }
            else if(imgLongestEdge >= 4000)
            {
              scaleFactor = .35;
            }
            else if(imgLongestEdge >= 3500)
            {
              scaleFactor = .38;
            }
            else if(imgLongestEdge >= 3000)
            {
              scaleFactor = .4;
            }
            else if(imgLongestEdge >= 2500)
            {
              scaleFactor = .5;
            }
            else if(imgWidth >= 2000)
            {
              scaleFactor = .6;
            }
            else if(imgLongestEdge >= 1500)
            {
              scaleFactor = .7;
            }
            else if(imgLongestEdge >= 1000)
            {
              scaleFactor = .8;
            }
            else if(imgLongestEdge < 1000)
            {
              scaleFactor = 1;
            }
    
            await image.scale(scaleFactor).quality(jpgQuality).write(path.join(location,"small", imageToSave));
            status("Resized " + file);
            console.log("resized " + file);

        }
       catch(err)
       {
         status("Image is corrupt. skipping: " + file);
          console.log("Image is corrupt. skipping: " + file);
       }


      line ++;
      progress(line,jpgCount,"yes");
    }
    
  }
  progress(line,jpgCount,"no");
  return "finished";
  
} 


function formatDate(dateString)
{
    // function to re-format the date from the date box which is yyyy-MM-dd to MM-dd-yyyy
    if(dateString.length ==0)
    {
        return "";
    }
    var dateParts = dateString.split('-');
    var monthPart = dateParts[1];
    var dayPart = dateParts[2];
    var yearPart = dateParts[0];
    return monthPart + "-" + dayPart + "-" + yearPart;
}

function getLongDate(dateString)
{
  if(dateString.length ==0)
  {
      return "";
  }
  let thisDate = new Date(dateString);
  var options = { weekday: "long", year: "numeric", month: "short",   
    day: "numeric" };
  return thisDate.toLocaleDateString("en-US", options);  


}

function getLenses()
{
    // function to retrieve list of lenses from lens ul list and return a string ready to write out to a file
    var lensList="";
    var ul = document.getElementById("lenses_used");
    var items = ul.getElementsByTagName('li');
    for (var i= 0, n= items.length; i < n ; i++) {
        if(i == (n - 1))
            {
                //last item. we don't want a comma on the end
                lensList += items[i].innerText;
            }
            else
            {
                lensList += items[i].innerText + ',';
            }    
        
        }
    return lensList;
}

function updateLastSheet(sheetNum)
{
  let configFile = path.join(getUserHome(), '.FilmShotDataConfig');
  let cameras;
  let lenses;
  let films;
  let isos;
  let formats;
  let developers;
  let photographers;
  let binders;
  let create_thumbs;
  let lastDirectory;

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
          else if(line.startsWith('Create Thumbs:'))
            {
              create_thumbs = line.substr(14).trim();
                            
            }
          else if(line.startsWith('lastDirectory:'))
            {
              lastDirectory = line.substr(15).trim();
                            
            }
    
       }) //end for each
       var cameraToSave = "Cameras: " + cameras + "\n";
       var lensesToSave = "Lenses: " + lenses + "\n";
       var filmToSave = "Films: " + films + "\n";
       var isoToSave = "Film ISOs: " + isos + "\n";
       var formatToSave = "Film Formats: " + formats + "\n";
       var developerToSave = "Developers: " + developers + "\n";
       var photogToSave = "Photographers: " + photographers + "\n";
       var binderToSave = "Binders: " + binders + "\n";
       var lastSheet = "Last Sheet: " + sheetNum + "\n";
       var createThumbsToSave = "Create Thumbs: " + create_thumbs + "\n";
       var lastDirectoryToSave = "Last Directory: " + lastDirectory;
       
                    
        }// End if
        else
        {
          var cameraToSave = "Cameras: "  + "\n";
          var lensesToSave = "Lenses: "  + "\n";
          var filmToSave = "Films: Ilford HP5+;Ilford FP4+;Ilford Pan F;Ilford Delta 100;Ilford Delta 400;Ilford Delta 3200;"  + "\n";
          var isoToSave = "Film ISOs: 25;80;100;125;200;400;800;1000;1600;3200;6400;"  + "\n";
          var formatToSave = "Film Formats: 35mm;120;620;110;4x5"  + "\n";
          var developerToSave = "Developers: Ilford Ilfosol 3;Kodak D76 Stock;Kodak D76 1:1;Kodak Xtol Stock;Kodak Xtol 1:1;"  + "\n";
          var photogToSave = "Photographers: "  + "\n";
          var binderToSave = "Binders: "  + "\n";
          var lastSheet = "Last Sheet: " + sheetNum + "\n";
          var createThumbsToSave = "Create Thumbs: no" + "\n";
          var lastDirectoryToSave = "Last Directory: ";

        }

        var dataOut = cameraToSave + lensesToSave + filmToSave + isoToSave + formatToSave + developerToSave +
        photogToSave + binderToSave + lastSheet + createThumbsToSave + lastDirectoryToSave;
        try {
                fs.writeFileSync(configFile, dataOut, 'utf-8');
               console.log("saved config file.");
             }
        catch(e)
             {
                 console.log('Failed to save the presets file !');
             }         

}

function updateLastDirectory(location)
{
  let configFile = path.join(getUserHome(), '.FilmShotDataConfig');
  let cameras;
  let lenses;
  let films;
  let isos;
  let formats;
  let developers;
  let photographers;
  let binders;
  let create_thumbs;
  let lastSheet;

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
          else if(line.startsWith('Create Thumbs:'))
            {
              create_thumbs = line.substr(14).trim();
                            
            }
          else if(line.startsWith('Last Sheet:'))
            {
              lastSheet = line.substr(11).trim();
              
            }
          
    
       }) //end for each
       var cameraToSave = "Cameras: " + cameras + "\n";
       var lensesToSave = "Lenses: " + lenses + "\n";
       var filmToSave = "Films: " + films + "\n";
       var isoToSave = "Film ISOs: " + isos + "\n";
       var formatToSave = "Film Formats: " + formats + "\n";
       var developerToSave = "Developers: " + developers + "\n";
       var photogToSave = "Photographers: " + photographers + "\n";
       var binderToSave = "Binders: " + binders + "\n";
       var lastSheetToSave = "Last Sheet: " + lastSheet + "\n";
       var createThumbsToSave = "Create Thumbs: " + create_thumbs + "\n";
       var lastDirectoryToSave = "Last Directory: " + location;
       
                    
        }// End if
        else
        {
          var cameraToSave = "Cameras: "  + "\n";
          var lensesToSave = "Lenses: "  + "\n";
          var filmToSave = "Films: Ilford HP5+;Ilford FP4+;Ilford Pan F;Ilford Delta 100;Ilford Delta 400;Ilford Delta 3200;"  + "\n";
          var isoToSave = "Film ISOs: 25;80;100;125;200;400;800;1000;1600;3200;6400;"  + "\n";
          var formatToSave = "Film Formats: 35mm;120;620;110;4x5"  + "\n";
          var developerToSave = "Developers: Ilford Ilfosol 3;Kodak D76 Stock;Kodak D76 1:1;Kodak Xtol Stock;Kodak Xtol 1:1;"  + "\n";
          var photogToSave = "Photographers: "  + "\n";
          var binderToSave = "Binders: "  + "\n";
          var lastSheetToSave = "Last Sheet: " + "1" + "\n";
          var createThumbsToSave = "Create Thumbs: " + "no" + "\n";
          var lastDirectoryToSave = "Last Directory: " + location;

        }

        var dataOut = cameraToSave + lensesToSave + filmToSave + isoToSave + formatToSave + developerToSave +
        photogToSave + binderToSave + lastSheetToSave + createThumbsToSave + lastDirectoryToSave;
        try {
                fs.writeFileSync(configFile, dataOut, 'utf-8');
               console.log("saved config file.");
             }
        catch(e)
             {
                 console.log('Failed to save the presets file !');
             }         

}


function disableForm(trueFalse)
{
 console.log("disableForm: " + trueFalse);
  if(trueFalse == "true")
    {
      console.log("disableForm: we hit true");
      document.getElementById("camera").setAttribute("disabled", true); 
      document.getElementById("film").setAttribute("disabled", true);  
      document.getElementById("ISO").setAttribute("disabled", true);  
      document.getElementById("lens").setAttribute("disabled", true); 
      document.getElementById("developer").setAttribute("disabled", true); 
      document.getElementById("format").setAttribute("disabled", true); 
      document.getElementById("types").setAttribute("disabled", true); 
      document.getElementById("sheet").setAttribute("disabled", true); 
      document.getElementById("photographer").setAttribute("disabled", true); 
      document.getElementById("people").setAttribute("disabled", true); 
      document.getElementById("date").setAttribute("disabled", true); 
      document.getElementById("binder").setAttribute("disabled", true); 
      document.getElementById("openFile").setAttribute("disabled", true);  
      document.getElementById("loadInventory").setAttribute("disabled", true);   
      document.getElementById("saveForm").setAttribute("disabled", true);  
      document.getElementById("loadInventory").setAttribute("disabled", true); 
      document.getElementById("closeForm").setAttribute("disabled", true); 
      document.getElementById("locations").setAttribute("disabled", true); 
      document.getElementById("memo").setAttribute("disabled", true); 
      document.getElementById("type").setAttribute("disabled", true); 
      document.getElementById("lenses_used").setAttribute("disabled", true); 
      document.getElementById("location").setAttribute("disabled", true); 
      document.getElementById("gen").setAttribute("disabled", true); 
      document.getElementById("lenses").className = "disabled";
      document.getElementById("lenses_used").className = "disabled";
      document.getElementById("title").setAttribute("disabled", true); 
    }
    else if (trueFalse == "false")
    {
      console.log("disableForm: we hit false");
      document.getElementById("camera").removeAttribute('disabled'); 
      document.getElementById("film").removeAttribute('disabled');  
      document.getElementById("ISO").removeAttribute('disabled');  
      document.getElementById("lens").removeAttribute('disabled'); 
      document.getElementById("developer").removeAttribute('disabled'); 
      document.getElementById("format").removeAttribute('disabled'); 
      document.getElementById("types").removeAttribute('disabled'); 
      document.getElementById("sheet").removeAttribute('disabled'); 
      document.getElementById("photographer").removeAttribute('disabled'); 
      document.getElementById("people").removeAttribute('disabled'); 
      document.getElementById("date").removeAttribute('disabled'); 
      document.getElementById("binder").removeAttribute('disabled'); 
      document.getElementById("openFile").removeAttribute('disabled');  
      document.getElementById("loadInventory").removeAttribute('disabled');   
      document.getElementById("saveForm").removeAttribute('disabled');  
      document.getElementById("loadInventory").removeAttribute('disabled'); 
      document.getElementById("closeForm").removeAttribute('disabled');
      document.getElementById("locations").removeAttribute('disabled');
      document.getElementById("memo").removeAttribute('disabled');
      document.getElementById("type").removeAttribute('disabled');
      document.getElementById("lenses_used").removeAttribute('disabled');
      document.getElementById("location").removeAttribute('disabled');
      document.getElementById("gen").removeAttribute('disabled');
      document.getElementById("lenses").className = "none";
      document.getElementById("lenses_used").className = "none";
      document.getElementById("title").removeAttribute('disabled');
    }

}

function progress(value,maxValue,enable)
{
  if(enable == "yes")
  {
    document.getElementById("progress").removeAttribute('hidden');
    document.getElementById("progress").max = maxValue;
    document.getElementById("progress").value = value;
  }
  else
  {
    document.getElementById("progress").setAttribute("hidden", true);

  }

}

function getFilesize(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes / 1000000.0
}