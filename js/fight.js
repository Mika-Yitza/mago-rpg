import * as dbHelp from './db-helper.js'
import {opponents} from '.././data/opponents.js'
import {abilities} from '.././data/abilities.js'

let appbaseRef, round, charValues, opponent, xpIncrease

function combatState(combatText, action, img){
    document.getElementById(`combat`).innerHTML += '\n' + combatText
    document.getElementById(`combatText`).innerHTML = combatText
    document.getElementById(`combatImg`).src = "assets/" + action + "/" + img + ".png"
}

function combatValues(stat, heroNewValue, oppNewValue, oppTotal){
    document.getElementById(`heroLabelHp`).innerHTML = heroNewValue
    document.getElementById(`oppLabel` + stat).innerHTML = oppNewValue
    document.getElementById(`heroHp`).style.width = (heroNewValue / charValues.health * 200) + "px"
    document.getElementById(`opp` + stat).style.width = (oppNewValue / oppTotal * 200) + "px"
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
    document.getElementById(`heroHp`).style.width = "200px"
    document.getElementById(`oppFw`).style.width = "200px"
    document.getElementById(`oppHp`).style.width = "200px"
    document.getElementById(`continuePanel`).style.visibility = "hidden"
    document.getElementById(`action1`).innerHTML = charValues.ability1
    document.getElementById(`action2`).innerHTML = charValues.ability2
    document.getElementById(`action3`).innerHTML = charValues.ability3
}

document.getElementById(`continue`).onclick = function () {

    if((charValues.xp + xpIncrease) >= (charValues.level * 100)){
        sessionStorage.setItem('xp', (charValues.xp + xpIncrease))
        window.open("upgrade.html", "_self")
    }
    else{
        charValues.xp += xpIncrease
        const userData = dbHelp.setNewValues(charValues)
        dbHelp.add(appbaseRef, userData, charValues.id)
    }
}

for(let i=1; i<=3; i++){
    document.getElementById(`action` + i).onclick = function () {
        document.getElementById(`action1`).disabled = true
        document.getElementById(`action2`).disabled = true
        document.getElementById(`action3`).disabled = true

        const action = document.getElementById(`action` + i).innerHTML

        let ability

        for(let usedAbility of abilities){
            if(usedAbility.name == action){
                ability = usedAbility
            }
        }

        const charCurrentHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
        const oppCurrentValue = parseInt(document.getElementById(`oppLabel` + ability.stat).innerHTML)

        const baseDmgDone = (charValues.coding * ability.codingMultiplier) + (charValues.strength * ability.strengthMultiplier)
                            + (charValues.talent * ability.talentMultiplier)
        const heroDmgDone = (Math.random() * 100) > ability.criticalChance ? 
                    {
                        value: Math.floor(baseDmgDone),
                        criticalText: ""
                    } :
                    {
                        value: Math.floor(baseDmgDone) + charValues.agility,
                        criticalText:" (CH)"
                    }
                    
        const oppDmgDone = (Math.random() * 100) > opponent.overdriveChance ? 
                    {
                        value: opponent.strength,
                        criticalText: ""
                    } :
                    {
                        value: opponent.overdrive,
                        criticalText:" (OD)"
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
                xpIncrease = opponent.xpWorth
                combatState('Victory!' + '\n' + 'Xp increased by ' + xpIncrease, "Game End", "victory")
                document.getElementById(`continuePanel`).style.visibility = "visible"
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
                    xpIncrease = opponent.xpWorth / 2
                    combatState('Game Over!' + '\n' + 'Xp increased by ' + xpIncrease, "Game End", "game over")
                    document.getElementById(`continuePanel`).style.visibility = "visible"
                }, 8000)
            }
            else{
                setTimeout(function(){
                    document.getElementById(`action1`).disabled = false
                    document.getElementById(`action2`).disabled = false
                    document.getElementById(`action3`).disabled = false
                }, 8000)
            }
        }
        setTimeout(function(){
            document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight
        }, 8001)
    }
}