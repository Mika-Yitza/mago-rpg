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

function fightValues() {

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

    const returnedItems={
        charName: charName,
        charHp: charHp,
        charCoding: charCoding,
        charStrength: charStrength,
        charHpTotal: charHpTotal,
        oppName: oppName,
        oppHp: oppHp,
        oppFw: oppFw,
        oppStrength: oppStrength,
        oppFwTotal: oppFwTotal,
        oppHpTotal: oppHpTotal,
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

document.getElementById(`action-hack`).onclick = function () {
    if (isGameOver) {
        alert(gameOverMessage)
    }
    else {
        roundCount()
        const values = fightValues()

        const newOppValues = newCharValue(values.charCoding, values.oppFw, 50)
        const newOppFw = newOppValues.newCharValue

        const newHeroValues = newCharValue(values.oppStrength, values.charHp, 30)
        const newHeroHp = newHeroValues.newCharValue

        const fightLine1 = values.charName + ' used his hacking skills to reduce ' + values.oppName + '\’(s) firewall by ' + newOppValues.dmgTaken + newOppValues.criticalText
        const fightLine2 = values.oppName + ' - Remaining firewall : ' + newOppFw
        const fightLine3 = values.oppName + ' attacked ' + values.charName + ' for ' + newHeroValues.dmgTaken + newHeroValues.criticalText
        const fightLine4 = values.charName + ' - Remaining health : ' + newHeroHp

        fightLogic(fightLine1, fightLine2, fightLine3, fightLine4, 'Fw', newOppFw, values.oppFwTotal, newHeroHp, values.charHpTotal)
    }
}

document.getElementById(`action-punch`).onclick = function () {

    if (isGameOver) {
        alert(gameOverMessage)
    }
    else {
        roundCount()

        const values = fightValues()

        const newOppValues = newCharValue(values.charStrength, values.oppHp, 40)
        const newOppHp = newOppValues.newCharValue

        const newHeroValues = newCharValue(values.oppStrength, values.charHp, 30)
        const newHeroHp = newHeroValues.newCharValue

        const fightLine1 = values.charName + ' used his mighty punch to reduce ' + values.oppName + '\’(s) health by ' + newOppValues.dmgTaken + newOppValues.criticalText
        const fightLine2 = values.oppName + ' - Remaining health : ' + newOppHp
        const fightLine3 = values.oppName + ' attacked ' + values.charName + ' for ' + newHeroValues.dmgTaken + newHeroValues.criticalText
        const fightLine4 = values.charName + ' - Remaining health : ' + newHeroHp

        fightLogic(fightLine1, fightLine2, fightLine3, fightLine4, 'Hp', newOppHp, values.oppHpTotal, newHeroHp, values.charHpTotal)
    }
}