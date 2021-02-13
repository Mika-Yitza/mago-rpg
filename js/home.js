import * as dbHelp from '/js/db-helper.js'

let title = 'Home Page'
let appbaseRef
const heroClassStats = [
    {
        name : 'Tester',
        health : 10,
        coding : 1,
        strength : 3,
        img : 'tester.png'
    },
    {
        name : 'Developer',
        health : 8,
        coding : 3,
        strength : 1,
        img : 'dev.png'
    },
    {
        name : 'Data Analyst',
        health : 12,
        coding : 2,
        strength : 2,
        img : 'da.png'
    }
]

window.onload = function() {
    document.getElementById(`title`).innerHTML = title

    for(let classObj of heroClassStats){
        document.getElementById(`class`).append(new Option(classObj.name, classObj.name))
    }

    appbaseRef = dbHelp.auth()
}

document.getElementById(`create`).onclick = function() {
    const charName = document.getElementById(`name`).value

    if (charName === '') {
        alert('You need to name your hero before you can create it')
    }
    else{  
        const charClass = document.getElementById(`class`).value    
        let userData

        for(let stats of heroClassStats){
            if(stats.name == charClass){
                userData = {
                    name: charName,
                    class: charClass,
                    health: stats.health,
                    coding: stats.coding,
                    strength: stats.strength,
                    level: 1,
                    xp: 0
                }
                dbHelp.uniqueAdd(appbaseRef, charName, userData)
            }
        }
    }
}