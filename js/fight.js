import * as dbHelp from './db-helper.js'
import {opponents} from '.././data/opponents.js'
import {abilities} from '.././data/abilities.js'

let appbaseRef, round, isGameOver, gameConclusion, charValues, opponent
const gameOverMessage = 'This game has finished.'

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

function combatState(combatText, action, img){
    document.getElementById(`combat`).innerHTML += '\n' + combatText
    document.getElementById(`combatText`).innerHTML = combatText
    document.getElementById(`combatImg`).src = "assets/" + action + "/" + img + ".png"
}

function combatValues(stat, heroNewValue, oppNewValue, oppTotal){
    document.getElementById(`heroLabelHp`).innerHTML = heroNewValue
    document.getElementById(`oppLabel` + stat).innerHTML = oppNewValue
    document.getElementById(`heroHp`).style.width = (heroNewValue / charValues.health * 60) + "%"
    document.getElementById(`opp` + stat).style.width = (oppNewValue / oppTotal * 60) + "%"
}

window.onload = function () {

    appbaseRef = dbHelp.auth()
    round = 1
    charValues = dbHelp.getStoredValues()

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

document.getElementById(`continue`).onclick = function () {

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

for(let i=1; i<=3; i++){
    document.getElementById(`action` + i).onclick = function () {
        if (isGameOver) {
            alert(gameOverMessage)
        }
        else {
            const action = document.getElementById(`action` + i).innerHTML

            let ability

            for(let usedAbility of abilities){
                if(usedAbility.name == action){
                    ability = usedAbility
                }
            }

            const charCurrentHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
            const oppCurrentValue = parseInt(document.getElementById(`oppLabel` + ability.stat).innerHTML)

            const heroDmgDone = (Math.random() * 100) > ability.criticalChance ? 
                        {
                            value: charValues[ability.charBaseValue],
                            criticalText: ""
                        } :
                        {
                            value: charValues[ability.charBaseValue] + charValues.agility + 1,
                            criticalText:" (CH)"
                        }
                        
            const oppDmgDone = (Math.random() * 100) > 30 ? 
                        {
                            value: opponent.strength,
                            criticalText: ""
                        } :
                        {
                            value: opponent.strength + 1,
                            criticalText:" (CH)"
                        }

            const fightLine1 = charValues.name + ability.line101 + opponent.name + '\’(s) ' + ability.statLong + ' by ' + heroDmgDone.value + heroDmgDone.criticalText
            const newOppValue = (oppCurrentValue - heroDmgDone.value) > 0 ? oppCurrentValue - heroDmgDone.value : 0
            const fightLine2 = opponent.name + ' - Remaining ' + ability.statLong + ' : ' + newOppValue
            const fightLine3 = opponent.name + ' attacked ' + charValues.name + ' for ' + oppDmgDone.value + oppDmgDone.criticalText
            const newHeroValue = (charCurrentHp - oppDmgDone.value) > 0 ? charCurrentHp - oppDmgDone.value : 0
            const fightLine4 = charValues.name + ' - Remaining health : ' + newHeroValue


            document.getElementById(`combat`).innerHTML += '\n\n' + 'Round ' + round + '\n'
            round++
            
            combatState(fightLine1, action, 1)

            setTimeout(function(){
                combatState(fightLine2, action, 2)
                combatValues(ability.stat, charCurrentHp, newOppValue, opponent[ability.statLong])
            }, 2000)


            if (newOppValue < 1) {
                setTimeout(function(){
                    victory(ability.stat)
                }, 4000)
            }
            else {
                setTimeout(function(){
                    combatState(fightLine3, "Opponent", 1)
                }, 4000)

                setTimeout(function(){
                    combatState(fightLine4, "Opponent", 2)
                    combatValues(ability.stat, newHeroValue, newOppValue, opponent[ability.statLong])
                }, 6000)

                if (newHeroValue < 1) {
                    setTimeout(function(){
                        gameOver(ability.stat, newOppValue, opponent[ability.statLong])
                    }, 8000)
                }
            }
            setTimeout(function(){
                document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight
            }, 6001)
        }
    }
}