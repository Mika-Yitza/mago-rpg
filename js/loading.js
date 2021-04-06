import * as dbHelp from './db-helper.js'

let appbaseRef
let userId

window.onload = function () {

    userId = sessionStorage.getItem('id')

    setTimeout(function(){
        appbaseRef = dbHelp.auth()
        dbHelp.search(appbaseRef, userId)
    }, 1000)

    setTimeout(function(){
        window.open("menu.html", "_self")
    }, 2000) 
}