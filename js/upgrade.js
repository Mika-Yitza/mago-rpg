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
            break
        }
        case "Developer": {
            userData.coding++
            statMessage1 = "Coding increased to " + userData.coding
            break
        }        
        case "Barista": {
            userData.talent++
            statMessage1 = "Talent increased to " + userData.talent
            break
        }
    }

    if(userData.level%2 == 0){
        userData.agility++
        statMessage2 = "Agility increased to " + userData.agility
    }
    else{
        statMessage2 = ""
    }

    document.getElementById(`lvlup`).innerHTML = '\n ' + "Congratulations, you have reached level " + userData.level
                                                + '\n ' + "Health increased to " + userData.health
                                                + '\n ' + statMessage1
                                                + '\n ' + statMessage2

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
        level: userData.level,
        xp: userData.xp
    }
    dbHelp.add(appbaseRef, newData, userData.id)
}
