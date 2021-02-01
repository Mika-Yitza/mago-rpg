let title = 'MAGO rpg title'
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

const opponents = [    
    {
        name : 'Robot',
        strength : 3,
        firewall : 8,
        health : 10,
        img : 'robot.png'
    },
    {
        name : 'A.I.',
        strength : 2,
        firewall : 10,
        health : 8,
        img : 'ai.png'
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
            '\n HP: ' + stats.health + '\n Coding: ' + stats.coding + '\n Strength: ' + stats.strength
            document.getElementById(`heroImg`).src = "assets/" + stats.img
        }
    }
}

document.getElementById(`createOpp`).onclick = function() {
    const oppName = document.getElementById(`opponent`).value
    const oppClass = document.getElementById(`classOpponent`).value

    for(let stats of opponents){
        if(stats.name == oppClass){
            document.getElementById(`opponentPanel`).innerHTML = oppName + '\n\n Class: ' + oppClass +
            '\n HP: ' + stats.health + '\n Firewall: ' + stats.firewall + '\n Strength: ' + stats.strength 
            document.getElementById(`oppImg`).src = "assets/" + stats.img
        }
    }
}

document.getElementById(`fight`).onclick = function() {
    const charName = document.getElementById(`name`).value
    const charClass = document.getElementById(`class`).value
    const oppName = document.getElementById(`opponent`).value
    const oppClass = document.getElementById(`classOpponent`).value

    document.getElementById(`combat`).innerHTML = charName + ' is ready to fight ' + oppName

    document.getElementById(`heroName-fight`).innerHTML = charName
    document.getElementById(`oppName-fight`).innerHTML = oppName
    document.getElementById(`heroImg-fight`).src = document.getElementById(`heroImg`).src
    document.getElementById(`oppImg-fight`).src = document.getElementById(`oppImg`).src

    for(let stats of heroClassStats){
        if(stats.name == charClass){
            document.getElementById(`heroLabelHp`).innerHTML = stats.health
            document.getElementById(`heroStrength-fight`).innerHTML = stats.strength
            document.getElementById(`heroCoding-fight`).innerHTML = stats.coding
            document.getElementById(`heroImg-fight`).alt = stats.health
        }
    }

    for(let stats of opponents){
        if(stats.name == oppClass){
            document.getElementById(`oppLabelHp`).innerHTML = stats.health
            document.getElementById(`oppLabelFw`).innerHTML = stats.firewall
            document.getElementById(`oppStrength-fight`).innerHTML = stats.strength
            document.getElementById(`oppImg-fight`).alt = stats.health + "&" + stats.firewall
        }
    }

    document.getElementById(`fight-details`).style.visibility = "visible"
    document.getElementById(`fight-panel`).style.visibility = "visible"
}

document.getElementById(`action-hack`).onclick = function() {

}

document.getElementById(`action-punch`).onclick = function() {
    
}