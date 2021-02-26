import * as dbHelp from './db-helper.js'

let appbaseRef
let userId

window.onload = function () {

    userId = sessionStorage.getItem('id')

    setTimeout(function(){
        appbaseRef = dbHelp.auth()
        dbHelp.search(appbaseRef, userId)
    }, 200)

    setTimeout(function(){
        document.getElementById(`heroName-fight`).innerHTML = sessionStorage.getItem('name')
        document.getElementById(`heroImg-fight`).src = "assets/" + sessionStorage.getItem('class') + ".png"
        document.getElementById(`heroLabelHp`).innerHTML = sessionStorage.getItem('health')
        document.getElementById(`heroLevel`).innerHTML = sessionStorage.getItem('level')
        document.getElementById(`heroXp`).innerHTML = sessionStorage.getItem('xp')
        document.getElementById(`heroStrength`).innerHTML = sessionStorage.getItem('strength')
        document.getElementById(`heroCoding`).innerHTML = sessionStorage.getItem('coding')
        document.getElementById(`heroImg-fight`).alt = sessionStorage.getItem('health')
    }, 500)
}

document.getElementById(`fight`).onclick = function () {
    window.open("fight.html", "_self")
}