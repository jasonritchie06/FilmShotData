const {ipcRenderer} = require('electron') 
const path = require('path')
const {app} = require('electron') 
const fs = require('fs') 
const {ipcMain} = require('electron') 

window.onload = function(){ loadForm(); }

window.onclose = function(){
   
 
  }

document.getElementById('closeForm').onclick = (event) => {
  
  window.close(); 
   
}
document.getElementById('create_thumbs').onclick = (event) => {
  
  if(document.getElementById('create_thumbs').checked)
  {
    alert('Warning: This might take some time for very large images...');
  }
}

document.getElementById('saveForm').onclick = (event) => {
  
  saveData(); 
   
}

document.getElementById('camera').onchange= (event) => {

  addListItem('camera','cameras');
}

document.getElementById('lens').onchange= (event) => {

  addListItem('lens','lenses');
}

document.getElementById('film').onchange= (event) => {

  addListItem('film','films');
}

document.getElementById('iso').onchange= (event) => {

  addListItem('iso','ISOs');
}

document.getElementById('format').onchange= (event) => {

  addListItem('format','formats');
}
document.getElementById('binder').onchange= (event) => {

  addListItem('binder','binders');
}
document.getElementById('photographer').onchange= (event) => {

  addListItem('photographer','photographers');
}
document.getElementById('developer').onchange= (event) => {

  addListItem('developer','developers');
}

document.getElementById("cameras").addEventListener("dblclick",function(e) {
    if(e.target && e.target.nodeName == "LI") {
        var ul = document.getElementById("cameras");
        ul.removeChild(e.target);
    }
});

document.getElementById("lenses").addEventListener("dblclick",function(e) {
    if(e.target && e.target.nodeName == "LI") {
        var ul = document.getElementById("lenses");
        ul.removeChild(e.target);
    }
});

document.getElementById("films").addEventListener("dblclick",function(e) {
  if(e.target && e.target.nodeName == "LI") {
      var ul = document.getElementById("films");
      ul.removeChild(e.target);
  }
});

document.getElementById("ISOs").addEventListener("dblclick",function(e) {
  if(e.target && e.target.nodeName == "LI") {
      var ul = document.getElementById("ISOs");
      ul.removeChild(e.target);
  }
});

document.getElementById("developers").addEventListener("dblclick",function(e) {
  if(e.target && e.target.nodeName == "LI") {
      var ul = document.getElementById("developers");
      ul.removeChild(e.target);
  }
});

document.getElementById("photographers").addEventListener("dblclick",function(e) {
   if(e.target && e.target.nodeName == "LI") {
      var ul = document.getElementById("photographers");
      ul.removeChild(e.target);
  }
});

document.getElementById("formats").addEventListener("dblclick",function(e) {
  if(e.target && e.target.nodeName == "LI") {
     var ul = document.getElementById("formats");
     ul.removeChild(e.target);
 }
});

document.getElementById("binders").addEventListener("dblclick",function(e) {
  if(e.target && e.target.nodeName == "LI") {
     var ul = document.getElementById("binders");
     ul.removeChild(e.target);
 }
});

function loadForm(){
    // read in the config file and preload the controls with preset data
    console.log("we hit loadForm function");
    let configFile = path.join(getUserHome(), '.FilmShotDataConfig');
       console.log("configFile: " + configFile);
             
             if(fs.existsSync(configFile)) {
                let cfData = fs.readFileSync(configFile, 'utf8').split('\n');
                
                cfData.forEach((line) => {
                   if(line.startsWith('Cameras:'))
                   {
                    let cameras = line.substr(9).trim().split(';');
                    cameras.forEach((camera, index) =>{
                        if(camera != "")
                        {
                          var ul = document.getElementById("cameras");
                          var li = document.createElement("li");
                           li.setAttribute('id',camera);
                           li.appendChild(document.createTextNode(camera));
                           ul.appendChild(li);
                        }

                      
                      })
                   }
                   else if(line.startsWith('Lenses:'))
                   {
                    let lenses = line.substr(8).trim().split(';');
                    lenses.forEach((lens, index) =>{
                        if(lens != "")
                        {
                          var ul = document.getElementById("lenses");
                          var li = document.createElement("li");
                           li.setAttribute('id',lens);
                           li.appendChild(document.createTextNode(lens));
                           ul.appendChild(li);
                        }

                     })
                    }
                    else if(line.startsWith('Films:'))
                    {
                      let films = line.substr(7).trim().split(';');
                      films.forEach((film, index) =>{
                        if(film != "")
                        {
                          var ul = document.getElementById("films");
                          var li = document.createElement("li");
                           li.setAttribute('id',film);
                           li.appendChild(document.createTextNode(film));
                           ul.appendChild(li);
                        }

                     })
                        
                      }
                      else if(line.startsWith('Film ISOs:'))
                      {
                        let isos = line.substr(10).trim().split(';');
                        isos.forEach((iso, index) =>{
                          if(iso !=  "")
                          {
                            var ul = document.getElementById("ISOs");
                            var li = document.createElement("li");
                             li.setAttribute('id',iso);
                             li.appendChild(document.createTextNode(iso));
                             ul.appendChild(li);
                          }

                       })
                          
                        }
                        else if(line.startsWith('Film Formats:'))
                        {
                          let formats = line.substr(13).trim().split(';');
                          formats.forEach((format, index) =>{
                          if(format != "")
                          {
                            var ul = document.getElementById("formats");
                            var li = document.createElement("li");
                            li.setAttribute('id',format);
                            li.appendChild(document.createTextNode(format));
                            ul.appendChild(li);
                          }

                         })
                        }
                          
                        else if(line.startsWith('Developers:'))
                          {
                            let developers = line.substr(11).trim().split(';');
                            developers.forEach((developer, index) =>{
                            if(developer != "")
                            {
                              var ul = document.getElementById("developers");
                              var li = document.createElement("li");
                              li.setAttribute('id',developer);
                              li.appendChild(document.createTextNode(developer));
                              ul.appendChild(li);
                            }

                           })
                          }
                         
                        else if(line.startsWith('Photographers:'))
                          {
                            let photographers = line.substr(14).trim().split(';');
                            photographers.forEach((photographer, index) =>{
                            if(photographer != "")
                            {
                              var ul = document.getElementById("photographers");
                              var li = document.createElement("li");
                              li.setAttribute('id',photographer);
                              li.appendChild(document.createTextNode(photographer));
                              ul.appendChild(li);
                            }

                           })
                          }
                        else if(line.startsWith('Binders:'))
                          {
                            let binders = line.substr(8).trim().split(';');
                            binders.forEach((binder, index) =>{
                            if(binder != "")
                            {
                              var ul = document.getElementById("binders");
                              var li = document.createElement("li");
                              li.setAttribute('id',binder);
                              li.appendChild(document.createTextNode(binder));
                              ul.appendChild(li);
                            }

                             })     
                                  
                          }
                       else if(line.startsWith('Last Sheet:'))
                        {
                          let lastSheet = line.substr(11).trim();
                          document.getElementById('lastSheet').value = lastSheet;
                        }
                      else if(line.startsWith('Create Thumbs:'))
                        {
                          let create_thumbs = line.substr(14).trim();
                          if(create_thumbs == 'yes')
                          {
                            document.getElementById('create_thumbs').checked = true;
                          }
                          else
                          {
                            document.getElementById('create_thumbs').checked = false;
                          }
                          
                        }
                        else if(line.startsWith('Last Directory:'))
                        {
                          document.getElementById('lastDir').value = line.substr(16).trim();
                        }
                  } //end for each
    
                    //file didn't exist. do nothing
                )}
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function saveData()
{
  let configFile = path.join(getUserHome(), '.FilmShotDataConfig');

    var cameraToSave = "Cameras: " + getListItems('cameras') + "\n";
    var lensesToSave = "Lenses: " + getListItems('lenses') + "\n";
    var filmToSave = "Films: " + getListItems('films') + "\n";
    var isoToSave = "Film ISOs: " + getListItems('ISOs')+ "\n";
    var formatToSave = "Film Formats: " + getListItems('formats') + "\n";
    var developerToSave = "Developers: " + getListItems('developers') + "\n";
    var photogToSave = "Photographers: " + getListItems('photographers') + "\n";
    var binderToSave = "Binders: " + getListItems('binders') + "\n";
    var lastSheet = "Last Sheet: " + document.getElementById('lastSheet').value.trim() + "\n"
    var create_thumbs = "Create Thumbs: ";
    var lastDir = "Last Directory: " + document.getElementById('lastDir').value.trim() 

    if(document.getElementById('create_thumbs').checked == true)
    {
      console.log("create_thumbs is checked")
      create_thumbs += "yes" + "\n";
    }
    else
    {
      console.log("create_thumbs not checked")
      create_thumbs += "no" + "\n";
    }
    var dataOut = cameraToSave + lensesToSave + filmToSave + isoToSave + formatToSave + developerToSave +
    photogToSave + binderToSave + lastSheet + create_thumbs + lastDir;
    try {
            fs.writeFileSync(configFile, dataOut, 'utf-8');
            alert('Presets saved');
         }
    catch(e)
         {
             alert('Failed to save the presets file !');
         }
         
        ipcRenderer.send('invchange');
}

function getListItems(listName)
{
    // function to retrieve list of lenses from lens ul list and return a string ready to write out to a file
    var itemList="";
    var ul = document.getElementById(listName);
    var items = ul.getElementsByTagName('li');
    for (var i= 0, n= items.length; i < n ; i++) {
        if(i == (n - 1))
            {
                //last item. we don't want a semi-colon on the end
                itemList += items[i].innerText;
            }
            else
            {
              itemList += items[i].innerText + ';';
            }    
        
        }
    return itemList;
}

function addListItem(textName, listName)
{
  var newValue = document.getElementById(textName).value;
  if(newValue.trim() == "")
  {
    return;
  }
  var ul = document.getElementById(listName);
  var items = ul.getElementsByTagName('li');
  for (var i= 0, n= items.length; i < n ; i++) {
        console.log(items[i].innerText);
        if(items[i].innerText == newValue){
          document.getElementById(textName).value = "";
          return;
        } 
        else
        {
          
        }
    }
    var li = document.createElement("li");
    li.setAttribute('id',newValue);
    li.appendChild(document.createTextNode(newValue));
    ul.appendChild(li);
  document.getElementById(textName).value = "";
}