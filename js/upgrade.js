import * as dbHelp from './db-helper.js'

let appbaseRef
let userData

window.onload = function () {

    appbaseRef = dbHelp.auth()

    userData = dbHelp.getStoredValues()
    
    userData.xp -= (userData.level * 100)
    userData.level++
    userData.health+=2

    let statMessage1, statMessage2
    switch(userData.class){
        case "Security": {
            userData.strength++
            statMessage1 = "Strength increased to " + userData.strength
            document.getElementById(`action1`).innerHTML = "Increase Coding"
            document.getElementById(`action2`).innerHTML = "Increase Talent"
            break
        }
        case "Developer": {
            userData.coding++
            statMessage1 = "Coding increased to " + userData.coding
            document.getElementById(`action1`).innerHTML = "Increase Strength"
            document.getElementById(`action2`).innerHTML = "Increase Talent"
            break
        }        
        case "Barista": {
            userData.talent++
            statMessage1 = "Talent increased to " + userData.talent
            document.getElementById(`action1`).innerHTML = "Increase Coding"
            document.getElementById(`action2`).innerHTML = "Increase Strength"
            break
        }
    }

    if(userData.level%2 == 0){
        userData.agility++
        statMessage2 = "Agility increased to " + userData.agility + '\n '
    }
    else{
        statMessage2 = ""
    }

    document.getElementById(`lvlup`).innerHTML = '\n ' + "Congratulations, you have reached level " + userData.level
                                                + '\n ' + "Health increased to " + userData.health
                                                + '\n ' + statMessage1
                                                + '\n ' + statMessage2
}

for(let i=1; i<=2; i++){
    document.getElementById(`action` + i).onclick = function () {
        const stat = document.getElementById(`action` + i).innerHTML.split(' ')[1]
        userData[stat.toLowerCase()]++
        document.getElementById(`lvlup`).innerHTML += stat + " increased to " + userData[stat.toLowerCase()]
        document.getElementById(`action1`).style.visibility = "hidden"
        document.getElementById(`action2`).style.visibility = "hidden"
        document.getElementById(`continue`).style.visibility = "visible"
    }
}

document.getElementById(`continue`).onclick = function () {
    const newData = {
        name: userData.name,
        password: userData.password,
        class: userData.class,
        health: userData.health,
        coding: userData.coding,
        strength: userData.strength,
        talent: userData.talent,
        agility: userData.agility,
        ability1: userData.ability1,
        ability2: userData.ability2,
        ability3: userData.ability3,
        level: userData.level,
        xp: userData.xp
    }
    dbHelp.add(appbaseRef, newData, userData.id)
}
