import * as dbHelp from './db-helper.js'
import {opponents} from '.././data/opponents.js'
import {abilities} from '.././data/abilities.js'

let appbaseRef
let round
let isGameOver
let gameConclusion
const gameOverMessage = 'This game has finished.'
let opponent

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

    let ability

    for(let usedAbility of abilities){
        if(usedAbility.name == action){
            ability = usedAbility
        }
    }

    const charValues = dbHelp.getStoredValues()
    const charCurrentHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
    const oppCurrentValue = parseInt(document.getElementById(`oppLabel` + ability.stat).innerHTML)
    
    const newOppValues = newCharValue(charValues[ability.charBaseValue], oppCurrentValue, ability.criticalChance)
    const newHeroValues = newCharValue(opponent.strength, charCurrentHp, 30)
    const fightLine1 = charValues.name + ability.line101 + opponent.name + '\’(s) ' + ability.statLong + ' by ' + newOppValues.dmgTaken + newOppValues.criticalText
    const fightLine2 = opponent.name + ' - Remaining ' + ability.statLong + ' : ' + newOppValues.newCharValue
    const fightLine3 = opponent.name + ' attacked ' + charValues.name + ' for ' + newHeroValues.dmgTaken + newHeroValues.criticalText
    const remainingHealth = newHeroValues.newCharValue > 0 ? newHeroValues.newCharValue : 0
    const fightLine4 = charValues.name + ' - Remaining health : ' + remainingHealth

    const returnedItems={
        charHpTotal: charValues.health,
        newCharValue: newHeroValues.newCharValue,
        newOppValue: newOppValues.newCharValue,
        oppTotalValue: opponent[ability.statLong],
        stat: ability.stat,
        fightLine1: fightLine1,
        fightLine2: fightLine2,
        fightLine3: fightLine3,
        fightLine4: fightLine4
    }
    return returnedItems
}

function combatState(combatText, action, img){
    document.getElementById(`combat`).innerHTML += '\n' + combatText
    document.getElementById(`combatText`).innerHTML = combatText
    document.getElementById(`combatImg`).src = "assets/" + action + "/" + img + ".png"
}

function fightLogic(action, fightLine1, fightLine2, fightLine3, fightLine4, stat, newOppValue, oppTotalValue, newHeroValue, heroTotalValue) {

    combatState(fightLine1, action, 1)

    setTimeout(function(){
        combatState(fightLine2, action, 2)
    }, 2000)


    if (newOppValue < 1) {
        setTimeout(function(){
            victory(stat)
        }, 4000)
    }
    else {
        setTimeout(function(){
            combatState(fightLine3, "Opponent", 1)
        }, 4000)

        setTimeout(function(){
            combatState(fightLine4, "Opponent", 2)
        }, 6000)

        if (newHeroValue < 1) {
            setTimeout(function(){
                gameOver(stat, newOppValue, oppTotalValue)
            }, 6000)
        }
        else {
            setTimeout(function(){
                gameOn(stat, newOppValue, oppTotalValue, newHeroValue, heroTotalValue)
            }, 6000)
        }
    }
    setTimeout(function(){
        document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight
    }, 6001)
}

window.onload = function () {

    appbaseRef = dbHelp.auth()
    round = 1
    const charValues = dbHelp.getStoredValues()

    const randomOpp = Math.floor(Math.random() * opponents.length)
    opponent = opponents[randomOpp]
    document.getElementById(`combatText`).innerHTML = charValues.name + ' is ready to fight ' + opponents[randomOpp].name

    document.getElementById(`heroName-fight`).innerHTML = charValues.name
    document.getElementById(`oppName-fight`).innerHTML = opponent.name
    document.getElementById(`heroLabelHp`).innerHTML = charValues.health
    document.getElementById(`oppLabelHp`).innerHTML = opponent.health
    document.getElementById(`oppLabelFw`).innerHTML = opponent.firewall
    document.getElementById(`oppStrength-fight`).innerHTML = opponent.strength
    document.getElementById(`heroImg-fight`).src = "assets/" + charValues.class + ".png"
    document.getElementById(`oppImg-fight`).src = "assets/" + opponent.img
    document.getElementById(`combatImg`).src = "assets/ready.png"
    document.getElementById(`heroHp`).style.width = "60%"
    document.getElementById(`oppFw`).style.width = "60%"
    document.getElementById(`oppHp`).style.width = "60%"
    document.getElementById(`continuePanel`).style.visibility = "hidden"
    isGameOver = false
}

for(let i=1; i<=3; i++){
    document.getElementById(`action` + i).onclick = function () {
        const action = document.getElementById(`action` + i).innerHTML
        if (isGameOver) {
            alert(gameOverMessage)
        }
        else {
            roundCount()
            const values = fightValues(action)
            fightLogic(action, values.fightLine1, values.fightLine2, values.fightLine3, values.fightLine4, values.stat, values.newOppValue, values.oppTotalValue, values.newCharValue, values.charHpTotal)
        }
    }
}

document.getElementById(`continue`).onclick = function () {

    const charValues = dbHelp.getStoredValues()
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