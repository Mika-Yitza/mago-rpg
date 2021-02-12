let title = 'Home Page'
let round
let isGameOver
const gameOverMessage = 'This game has finished.'
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

function roundCount() {
    document.getElementById(`combat`).innerHTML += '\n\n' + 'Round ' + round + '\n'
    round++
}

function victoryUpdate(stat) { 
    document.getElementById(`combat`).innerHTML += '\n' + 'Victory!'
    document.getElementById(`oppLabel` + stat).innerHTML = 0
    document.getElementById(`opp` + stat).style.width = 0
    isGameOver = true
}


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

    if (charName === '') {
        alert('You need to name your hero before you can create it')
    }
    else {
        const charClass = document.getElementById(`class`).value

        for(let stats of heroClassStats){
            if(stats.name == charClass){
                document.getElementById(`panel`).innerHTML = charName + '\n\n Class: ' + charClass +
                '\n HP: ' + stats.health + '\n Coding: ' + stats.coding + '\n Strength: ' + stats.strength
            }
        }
    }
}

document.getElementById(`createOpp`).onclick = function() {
    const oppName = document.getElementById(`opponent`).value
    
    if (oppName === '') {
        alert('You need to name your opponent before you can create it')
    }
    else {
        const oppClass = document.getElementById(`classOpponent`).value
        
        for(let stats of opponents){
            if(stats.name == oppClass){
                document.getElementById(`opponentPanel`).innerHTML = oppName + '\n\n Class: ' + oppClass +
                '\n HP: ' + stats.health + '\n Firewall: ' + stats.firewall + '\n Strength: ' + stats.strength 
            }
        }
    }
}