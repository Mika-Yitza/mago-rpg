import * as dbHelp from './db-helper.js'

let appbaseRef
let round
let isGameOver
const gameOverMessage = 'This game has finished.'

const opponents = [
    {
        name: 'Robot',
        strength: 3,
        firewall: 8,
        health: 10,
        img: 'robot.png'
    },
    {
        name: 'A.I.',
        strength: 2,
        firewall: 10,
        health: 8,
        img: 'ai.png'
    }
]

function roundCount() {
    document.getElementById(`combat`).innerHTML += '\n\n' + 'Round ' + round + '\n'
    round++
}

function victory(stat) {
    document.getElementById(`combat`).innerHTML += '\n' + 'Victory!'
    document.getElementById(`oppLabel` + stat).innerHTML = 0
    document.getElementById(`opp` + stat).style.width = 0
    isGameOver = true
}

function gameOver(stat, newValue, total) {
    document.getElementById(`combat`).innerHTML += '\n' + 'Game Over!'
    document.getElementById(`heroLabel` + stat).innerHTML = 0
    document.getElementById(`hero` + stat).style.width = 0
    document.getElementById(`oppLabel` + stat).innerHTML = newValue
    document.getElementById(`opp` + stat).style.width = (newValue / total * 60) + "%"
    isGameOver = true
}

function gameOn(stat, newValue, total, newHeroHp, charHpTotal) {
    document.getElementById(`heroLabelHp`).innerHTML = newHeroHp
    document.getElementById(`oppLabel` + stat).innerHTML = newValue
    document.getElementById(`heroHp`).style.width = (newHeroHp / charHpTotal * 60) + "%"
    document.getElementById(`opp` + stat).style.width = (newValue / total * 60) + "%"
}

function calculateNewHeroHp(oppStrength, charHp){
    let heroDmgTaken
    let oppCriticalText

    if ((Math.random() * 100) > 30) {
        heroDmgTaken = oppStrength
        oppCriticalText = ""
    }
    else {
        heroDmgTaken = oppStrength + 1
        oppCriticalText = " (Critical Hit)"
    }
    const newHeroHp = charHp - heroDmgTaken

    const returnedItems={
        oppCriticalText: oppCriticalText,
        newHeroHp: newHeroHp,
        heroDmgTaken: heroDmgTaken
    }
    return returnedItems    
} 

window.onload = function () {

    for (let oppObj of opponents) {
        document.getElementById(`classOpponent`).append(new Option(oppObj.name, oppObj.name))
    }

    const userId = window.location.href.split("id=")[1]

    appbaseRef = dbHelp.auth()
    dbHelp.search(appbaseRef, userId)

}

document.getElementById(`createOpp`).onclick = function () {
    const oppName = document.getElementById(`opponent`).value

    if (oppName === '') {
        alert('You need to name your opponent before you can create it')
    }
    else {
        const oppClass = document.getElementById(`classOpponent`).value

        for (let stats of opponents) {
            if (stats.name == oppClass) {
                document.getElementById(`opponentPanel`).innerHTML = oppName + '\n\n Class: ' + oppClass +
                    '\n HP: ' + stats.health + '\n Firewall: ' + stats.firewall + '\n Strength: ' + stats.strength
                document.getElementById(`oppImg`).src = "assets/" + stats.img
            }
        }
    }
}

document.getElementById(`fight`).onclick = function () {
    round = 1
    const oppPannel = document.getElementById(`opponentPanel`).value

    if (oppPannel === '') {
        alert('You need to create the opponent before you can fight')
    }
    else {
        const charName = sessionStorage.getItem('name')
        const charClass = sessionStorage.getItem('class')
        const oppName = document.getElementById(`opponent`).value
        const oppClass = document.getElementById(`classOpponent`).value

        document.getElementById(`combat`).innerHTML = charName + ' is ready to fight ' + oppName

        document.getElementById(`heroName-fight`).innerHTML = charName
        document.getElementById(`oppName-fight`).innerHTML = oppName
        document.getElementById(`heroImg-fight`).src = "assets/" + charClass + ".png"
        document.getElementById(`oppImg-fight`).src = document.getElementById(`oppImg`).src


        document.getElementById(`heroLabelHp`).innerHTML = sessionStorage.getItem('health')
        document.getElementById(`heroStrength-fight`).innerHTML = sessionStorage.getItem('strength')
        document.getElementById(`heroCoding-fight`).innerHTML = sessionStorage.getItem('coding')
        document.getElementById(`heroImg-fight`).alt = sessionStorage.getItem('health')

        for (let stats of opponents) {
            if (stats.name == oppClass) {
                document.getElementById(`oppLabelHp`).innerHTML = stats.health
                document.getElementById(`oppLabelFw`).innerHTML = stats.firewall
                document.getElementById(`oppStrength-fight`).innerHTML = stats.strength
                document.getElementById(`oppImg-fight`).alt = stats.health + "&" + stats.firewall
            }
        }
        document.getElementById(`heroHp`).style.width = "60%"
        document.getElementById(`oppFw`).style.width = "60%"
        document.getElementById(`oppHp`).style.width = "60%"
        document.getElementById(`fight-details`).style.visibility = "visible"
        document.getElementById(`fight-panel`).style.visibility = "visible"
        isGameOver = false
    }
}

document.getElementById(`action-hack`).onclick = function () {
    if (isGameOver) {
        alert(gameOverMessage)
    }
    else {
        roundCount()

        const charName = document.getElementById(`heroName-fight`).innerHTML
        const oppName = document.getElementById(`oppName-fight`).innerHTML
        const charHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
        const oppFw = parseInt(document.getElementById(`oppLabelFw`).innerHTML)
        const charCoding = parseInt(document.getElementById(`heroCoding-fight`).innerHTML)
        const oppStrength = parseInt(document.getElementById(`oppStrength-fight`).innerHTML)
        const charHpTotal = parseInt(document.getElementById(`heroImg-fight`).alt)
        const oppFwTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[1])

        let oppDmgTaken
        let heroCriticalText
        if ((Math.random() * 100) > 50) {
            oppDmgTaken = charCoding
            heroCriticalText = ""
        }
        else {
            oppDmgTaken = charCoding + 1
            heroCriticalText = " (Critical Hit)"
        }
        const newOppFw = oppFw - oppDmgTaken

        const newValues = calculateNewHeroHp(oppStrength, charHp)
        const newHeroHp = newValues.newHeroHp

        document.getElementById(`combat`).innerHTML += '\n' + charName + ' used his hacking skills to reduce ' + oppName + '\’(s) firewall by ' + oppDmgTaken + heroCriticalText
        document.getElementById(`combat`).innerHTML += '\n' + oppName + ' - Remaining firewall : ' + newOppFw

        if (newOppFw < 1) {
            victory('Fw')
        }
        else {
            document.getElementById(`combat`).innerHTML += '\n' + oppName + ' attacked ' + charName + ' for ' + newValues.heroDmgTaken + newValues.oppCriticalText
            document.getElementById(`combat`).innerHTML += '\n' + charName + ' - Remaining health : ' + newHeroHp
            if (newHeroHp < 1) {
                gameOver('Fw', newOppFw, oppFwTotal)
            }
            else {
                gameOn('Fw', newOppFw, oppFwTotal, newHeroHp, charHpTotal)
            }
        }
        document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight
    }
}

document.getElementById(`action-punch`).onclick = function () {

    if (isGameOver) {
        alert(gameOverMessage)
    }
    else {
        roundCount()

        const charName = document.getElementById(`heroName-fight`).innerHTML
        const oppName = document.getElementById(`oppName-fight`).innerHTML
        const charHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
        const oppHp = parseInt(document.getElementById(`oppLabelHp`).innerHTML)
        const charStrength = parseInt(document.getElementById(`heroStrength-fight`).innerHTML)
        const oppStrength = parseInt(document.getElementById(`oppStrength-fight`).innerHTML)
        const charHpTotal = parseInt(document.getElementById(`heroImg-fight`).alt)
        const oppHpTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[0])

        let oppDmgTaken
        let heroCriticalText
        if ((Math.random() * 100) > 50) {
            oppDmgTaken = charStrength
            heroCriticalText = ""
        }
        else {
            oppDmgTaken = charStrength + 1
            heroCriticalText = " (Critical Hit)"
        }
        const newOppHp = oppHp - oppDmgTaken

        const newValues = calculateNewHeroHp(oppStrength, charHp)
        const newHeroHp = newValues.newHeroHp

        document.getElementById(`combat`).innerHTML += '\n' + charName + ' used his mighty punch to reduce ' + oppName + '\’(s) health by ' + oppDmgTaken + heroCriticalText
        document.getElementById(`combat`).innerHTML += '\n' + oppName + ' - Remaining health : ' + newOppHp

        if (newOppHp < 1) {
            victory('Hp')
        }
        else {
            document.getElementById(`combat`).innerHTML += '\n' + oppName + ' attacked ' + charName + ' for ' + newValues.heroDmgTaken + newValues.oppCriticalText
            document.getElementById(`combat`).innerHTML += '\n' + charName + ' - Remaining health : ' + newHeroHp
            if (newHeroHp < 1) {
                gameOver('Hp', newOppHp, oppHpTotal)
            }
            else {
                gameOn('Hp', newOppHp, oppHpTotal, newHeroHp, charHpTotal)
            }
        }
        document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight
    }
}