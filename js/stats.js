import * as dbHelp from './db-helper.js'

window.onload = function () {

        let userData = dbHelp.getStoredValues()

        document.getElementById(`heroName-fight`).innerHTML = userData.name
        document.getElementById(`heroLevel`).innerHTML = userData.level
        document.getElementById(`heroXp`).innerHTML = userData.xp
        document.getElementById(`heroHealth`).innerHTML = userData.health
        document.getElementById(`heroStrength`).innerHTML = userData.strength
        document.getElementById(`heroCoding`).innerHTML = userData.coding
        document.getElementById(`heroTalent`).innerHTML = userData.talent
        document.getElementById(`heroAgility`).innerHTML = userData.agility
        document.getElementById(`action1`).innerHTML = userData.ability1
        document.getElementById(`action2`).innerHTML = userData.ability2
        document.getElementById(`action3`).innerHTML = userData.ability3
}