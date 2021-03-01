import * as dbHelp from './db-helper.js'

let appbaseRef

window.onload = function () {

    appbaseRef = dbHelp.auth()
}

document.getElementById(`continue`).onclick = function () {
    window.open("menu.html", "_self")
}
