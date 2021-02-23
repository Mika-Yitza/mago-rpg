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
    document.getElementById(`heroLabelHp`).innerHTML = 0
    document.getElementById(`heroHp`).style.width = 0
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

function newCharValue (attackBaseValue, oldCharValue, criticalChance){
    let dmgTaken
    let criticalText

    if ((Math.random() * 100) > criticalChance) {
        dmgTaken = attackBaseValue
        criticalText = ""
    }
    else {
        dmgTaken = attackBaseValue + 1
        criticalText = " (Critical Hit)"
    }
    const newCharValue = oldCharValue - dmgTaken

    const returnedItems={
        criticalText: criticalText,
        newCharValue: newCharValue,
        dmgTaken: dmgTaken
    }
    return returnedItems    
}

function fightValues(action) {

    const charName = document.getElementById(`heroName-fight`).innerHTML
    const charHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
    const charCoding = parseInt(document.getElementById(`heroCoding-fight`).innerHTML)
    const charStrength = parseInt(document.getElementById(`heroStrength-fight`).innerHTML)
    const charHpTotal = parseInt(document.getElementById(`heroImg-fight`).alt)
    const oppName = document.getElementById(`oppName-fight`).innerHTML
    const oppHp = parseInt(document.getElementById(`oppLabelHp`).innerHTML)
    const oppFw = parseInt(document.getElementById(`oppLabelFw`).innerHTML)
    const oppStrength = parseInt(document.getElementById(`oppStrength-fight`).innerHTML)
    const oppFwTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[1])
    const oppHpTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[0])

    let charBaseValue, oppValue, oppTotalValue, criticalChance, stat, line101, line102, line201
    switch(action){
        case 'Hack':{
            charBaseValue = charCoding
            oppValue = oppFw
            oppTotalValue = oppFwTotal
            criticalChance = 50
            stat = 'Fw'
            line101 = ' used his hacking skills to reduce '
            line102 = '\’(s) firewall by '
            line201 = ' - Remaining firewall : '
            break
        }
        case 'Punch':{
            charBaseValue = charStrength
            oppValue = oppHp
            oppTotalValue = oppHpTotal
            criticalChance = 40
            stat = 'Hp'
            line101 = ' used his mighty punch to reduce '
            line102 = '\’(s) health by '
            line201 = ' - Remaining health : '
            break
        }
    }
    
    const newOppValues = newCharValue(charBaseValue, oppValue, criticalChance)
    const newHeroValues = newCharValue(oppStrength, charHp, 30)
    const fightLine1 = charName + line101 + oppName + line102 + newOppValues.dmgTaken + newOppValues.criticalText
    const fightLine2 = oppName + line201 + newOppValues.newCharValue
    const fightLine3 = oppName + ' attacked ' + charName + ' for ' + newHeroValues.dmgTaken + newHeroValues.criticalText
    const fightLine4 = charName + ' - Remaining health : ' + newHeroValues.newCharValue

    const returnedItems={
        charHpTotal: charHpTotal,
        newCharValue: newHeroValues.newCharValue,
        newOppValue: newOppValues.newCharValue,
        oppTotalValue: oppTotalValue,
        stat: stat,
        fightLine1: fightLine1,
        fightLine2: fightLine2,
        fightLine3: fightLine3,
        fightLine4: fightLine4
    }
    return returnedItems
}

function fightLogic(fightLine1, fightLine2, fightLine3, fightLine4, stat, newOppValue, oppTotalValue, newHeroValue, heroTotalValue) {

    document.getElementById(`combat`).innerHTML += '\n' + fightLine1 + '\n' + fightLine2

    if (newOppValue < 1) {
        victory(stat)
    }
    else {
        document.getElementById(`combat`).innerHTML += '\n' + fightLine3 + '\n' + fightLine4
        if (newHeroValue < 1) {
            gameOver(stat, newOppValue, oppTotalValue)
        }
        else {
            gameOn(stat, newOppValue, oppTotalValue, newHeroValue, heroTotalValue)
        }
    }
    document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight
    
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

for(let i=1; i<=2; i++){
    document.getElementById(`action` + i).onclick = function () {
        if (isGameOver) {
            alert(gameOverMessage)
        }
        else {
            roundCount()
            const values = fightValues(document.getElementById(`action` + i).innerHTML)
            fightLogic(values.fightLine1, values.fightLine2, values.fightLine3, values.fightLine4, values.stat, values.newOppValue, values.oppTotalValue, values.newCharValue, values.charHpTotal)
        }
    }
}