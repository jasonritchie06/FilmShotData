const {ipcRenderer} = require('electron') 
const path = require('path')
const {app} = require('electron') 
const fs = require('fs') 



document.getElementById('close').onclick = (event) => {
  
  window.close(); 
   
}