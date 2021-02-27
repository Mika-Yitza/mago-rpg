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

function storedValues() {
    const returnedItems={
        agility: parseInt(sessionStorage.getItem('agility')),
        class: sessionStorage.getItem('class'),
        coding: parseInt(sessionStorage.getItem('coding')),
        health: parseInt(sessionStorage.getItem('health')),
        id: sessionStorage.getItem('id'),
        level: parseInt(sessionStorage.getItem('level')),
        name: sessionStorage.getItem('name'),
        password: sessionStorage.getItem('password'),
        strength: parseInt(sessionStorage.getItem('strength')),
        talent: parseInt(sessionStorage.getItem('talent')),
        xp: parseInt(sessionStorage.getItem('xp'))
    }
    return returnedItems
}

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

    const charValues = storedValues()
    const charCurrentHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
    const oppName = document.getElementById(`oppName-fight`).innerHTML
    const oppHp = parseInt(document.getElementById(`oppLabelHp`).innerHTML)
    const oppFw = parseInt(document.getElementById(`oppLabelFw`).innerHTML)
    const oppStrength = parseInt(document.getElementById(`oppStrength-fight`).innerHTML)
    const oppFwTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[1])
    const oppHpTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[0])

    let charBaseValue, oppValue, oppTotalValue, criticalChance, stat, line101, line102, line201
    switch(action){
        case 'Hack':{
            charBaseValue = charValues.coding
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
            charBaseValue = charValues.strength
            oppValue = oppHp
            oppTotalValue = oppHpTotal
            criticalChance = 40
            stat = 'Hp'
            line101 = ' used his mighty punch to reduce '
            line102 = '\’(s) health by '
            line201 = ' - Remaining health : '
            break
        }
        case 'Coffee Splash':{
            charBaseValue = charValues.talent
            oppValue = oppHp
            oppTotalValue = oppHpTotal
            criticalChance = 40
            stat = 'Hp'
            line101 = ' tossed a delicious coffee to burn the circuits and reduce '
            line102 = '\’(s) health by '
            line201 = ' - Remaining health : '
            break
        }
    }
    
    const newOppValues = newCharValue(charBaseValue, oppValue, criticalChance)
    const newHeroValues = newCharValue(oppStrength, charCurrentHp, 30)
    const fightLine1 = charValues.name + line101 + oppName + line102 + newOppValues.dmgTaken + newOppValues.criticalText
    const fightLine2 = oppName + line201 + newOppValues.newCharValue
    const fightLine3 = oppName + ' attacked ' + charValues.name + ' for ' + newHeroValues.dmgTaken + newHeroValues.criticalText
    const remainingHealth = newHeroValues.newCharValue > 0 ? newHeroValues.newCharValue : 0
    const fightLine4 = charValues.name + ' - Remaining health : ' + remainingHealth

    const returnedItems={
        charHpTotal: charValues.health,
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
    const charValues = storedValues()

    const randomOpp = Math.floor(Math.random() * opponents.length)
    document.getElementById(`combat`).innerHTML = charValues.name + ' is ready to fight ' + opponents[randomOpp].name

    document.getElementById(`heroName-fight`).innerHTML = charValues.name
    document.getElementById(`oppName-fight`).innerHTML = opponents[randomOpp].name
    document.getElementById(`heroImg-fight`).src = "assets/" + charValues.class + ".png"
    document.getElementById(`oppImg-fight`).src = "assets/" + opponents[randomOpp].img

    document.getElementById(`heroLabelHp`).innerHTML = charValues.health

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

for(let i=1; i<=3; i++){
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

    const charValues = storedValues()
    const xpIncrease = gameConclusion == 'victory' ? 50 : 25

    if((charValues.xp + xpIncrease) >= (charValues.level * 100)){
        sessionStorage.setItem('xp', (charValues.xp + xpIncrease))
        window.open("upgrade.html", "_self")
    }
    else{
        const userData = {
            name: charValues.name,
            password: charValues.password,
            class: charValues.class,
            health: charValues.health,
            coding: charValues.coding,
            strength: charValues.strength,
            talent: charValues.talent,
            agility: charValues.agility,
            level: charValues.level,
            xp: (charValues.xp + xpIncrease)
        }
        dbHelp.add(appbaseRef, userData, charValues.id)
    }
}