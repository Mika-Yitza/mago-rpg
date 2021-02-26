import * as dbHelp from './db-helper.js'

let appbaseRef
let round
let isGameOver
let gameConclusion
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
    document.getElementById(`combat`).innerHTML += '\n' + 'Victory!' + '\n' + 'Xp increased by 50'
    document.getElementById(`oppLabel` + stat).innerHTML = 0
    document.getElementById(`opp` + stat).style.width = 0
    isGameOver = true
    gameConclusion = "victory"
    document.getElementById(`continuePanel`).style.visibility = "visible"
}

function gameOver(stat, newValue, total) {
    document.getElementById(`combat`).innerHTML += '\n' + 'Game Over!' + '\n' + 'Xp increased by 25'
    document.getElementById(`heroLabelHp`).innerHTML = 0
    document.getElementById(`heroHp`).style.width = 0
    document.getElementById(`oppLabel` + stat).innerHTML = newValue
    document.getElementById(`opp` + stat).style.width = (newValue / total * 60) + "%"
    isGameOver = true
    gameConclusion = "defeat"
    document.getElementById(`continuePanel`).style.visibility = "visible"
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

    appbaseRef = dbHelp.auth()
    round = 1
    const charName = sessionStorage.getItem('name')
    const charClass = sessionStorage.getItem('class')

    const randomOpp = Math.floor(Math.random() * opponents.length)
    const oppName = opponents[randomOpp].name
    document.getElementById(`combat`).innerHTML = charName + ' is ready to fight ' + oppName

    document.getElementById(`heroName-fight`).innerHTML = charName
    document.getElementById(`oppName-fight`).innerHTML = oppName
    document.getElementById(`heroImg-fight`).src = "assets/" + charClass + ".png"
    document.getElementById(`oppImg-fight`).src = "assets/" + opponents[randomOpp].img

    document.getElementById(`heroLabelHp`).innerHTML = sessionStorage.getItem('health')
    document.getElementById(`heroStrength-fight`).innerHTML = sessionStorage.getItem('strength')
    document.getElementById(`heroCoding-fight`).innerHTML = sessionStorage.getItem('coding')
    document.getElementById(`heroImg-fight`).alt = sessionStorage.getItem('health')

    document.getElementById(`oppLabelHp`).innerHTML = opponents[randomOpp].health
    document.getElementById(`oppLabelFw`).innerHTML = opponents[randomOpp].firewall
    document.getElementById(`oppStrength-fight`).innerHTML = opponents[randomOpp].strength
    document.getElementById(`oppImg-fight`).alt = opponents[randomOpp].health + "&" + opponents[randomOpp].firewall

    document.getElementById(`heroHp`).style.width = "60%"
    document.getElementById(`oppFw`).style.width = "60%"
    document.getElementById(`oppHp`).style.width = "60%"
    document.getElementById(`continuePanel`).style.visibility = "hidden"
    isGameOver = false
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

document.getElementById(`continue`).onclick = function () {

    const heroId = sessionStorage.getItem('id')
    const currentXP = parseInt(sessionStorage.getItem('xp'))
    const xpIncrease = gameConclusion == 'victory' ? 50 : 25
    const currentLvl = sessionStorage.getItem('level')

    if((currentXP + xpIncrease) >= (currentLvl * 100)){
        sessionStorage.setItem('xp', (currentXP + xpIncrease - (currentLvl * 100)))
        window.open("upgrade.html", "_self")
    }
    else{
        const userData = {
            name: sessionStorage.getItem('name'),
            password: sessionStorage.getItem('password'),
            class: sessionStorage.getItem('class'),
            health: sessionStorage.getItem('health'),
            coding: sessionStorage.getItem('coding'),
            strength: sessionStorage.getItem('strength'),
            level: currentLvl,
            xp: (currentXP + xpIncrease)
        }
        dbHelp.add(appbaseRef, userData, heroId)
    }
}