import * as dbHelp from './db-helper.js'

window.onload = function () {

        let userData = dbHelp.getStoredValues()

        document.getElementById(`heroName-fight`).innerHTML = userData.name
        document.getElementById(`heroImg-fight`).src = "assets/" + userData.class + ".png"
        document.getElementById(`heroLevel`).innerHTML = userData.level
        document.getElementById(`heroXp`).innerHTML = userData.xp
        document.getElementById(`heroHealth`).innerHTML = userData.health
        document.getElementById(`heroStrength`).innerHTML = userData.strength
        document.getElementById(`heroCoding`).innerHTML = userData.coding
        document.getElementById(`heroTalent`).innerHTML = userData.talent
        document.getElementById(`heroAgility`).innerHTML = userData.agility
}

document.getElementById(`back`).onclick = function () {

        window.open("menu.html", "_self")
}