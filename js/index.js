let title = 'MAGO rpg title'
const heroClassStats = [
    {
        name : 'Tester',
        health : 10,
        coding : 1,
        hacking : 3
    },
    {
        name : 'Developer',
        health : 8,
        coding : 3,
        hacking : 2
    },
    {
        name : 'Data Analyst',
        health : 12,
        coding : 2,
        hacking : 2
    }
]

const opponents = [    
    {
        name : 'Robot',
        attack : 3,
        firewall : 7
    },
    {
        name : 'A.I.',
        attack : 3,
        firewall : 10
    }
]

window.onload = function() {
    document.getElementById(`title`).innerHTML = title

    for(let classObj of heroClassStats){
        document.getElementById(`class`).append(new Option(classObj.name, classObj.name))
    }

    for(let oppObj of opponents){
        document.getElementById(`classOpponent`).append(new Option(oppObj.name, oppObj.name))
    }
}

document.getElementById(`create`).onclick = function() {
    const charName = document.getElementById(`name`).value
    const charClass = document.getElementById(`class`).value

    for(let stats of heroClassStats){
        if(stats.name == charClass){
            document.getElementById(`panel`).innerHTML = charName + '\n\n Class: ' + charClass +
            '\n HP: ' + stats.health + '\n Coding: ' + stats.coding + '\n Hacking: ' + stats.hacking
        }
    }
}

document.getElementById(`createOpp`).onclick = function() {
    const oppName = document.getElementById(`opponent`).value
    const oppClass = document.getElementById(`classOpponent`).value

    for(let stats of opponents){
        if(stats.name == oppClass){
            document.getElementById(`opponentPanel`).innerHTML = oppName + '\n\n Class: ' + oppClass +
            '\n Attack: ' + stats.attack + '\n Firewall: ' + stats.firewall
        }
    }
}

document.getElementById(`fight`).onclick = function() {
    const charName = document.getElementById(`name`).value
    const oppName = document.getElementById(`opponent`).value

    document.getElementById(`combat`).innerHTML = charName + ' is ready to fight ' + oppName
}