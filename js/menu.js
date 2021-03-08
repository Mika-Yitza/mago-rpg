import * as dbHelp from './db-helper.js'

let appbaseRef
let userId
let ready = 0

window.onload = function () {

    userId = sessionStorage.getItem('id')

    setTimeout(function(){
        appbaseRef = dbHelp.auth()
        dbHelp.search(appbaseRef, userId)
        ready = 1
    }, 1000)
}

document.getElementById(`action1`).onclick = function () {
    if(ready == 0){
        alert(`Your data is still loading.`)
    }
    else{
        window.open("fight.html", "_self")
    }
}

document.getElementById(`action2`).onclick = function () {
    if(ready == 0){
        alert(`Your data is still loading.`)
    }
    else{
        window.open("stats.html", "_self")
    }
}

document.getElementById(`action4`).onclick = function () {
    if(ready == 0){
        alert(`Your data is still loading.`)
    }
    else{
        window.open("home.html", "_self")
    }
}