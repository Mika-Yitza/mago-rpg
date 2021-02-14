import * as dbHelp from './db-helper.js'

let appbaseRef
let round
let isGameOver
const gameOverMessage = 'This game has finished.'

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

    for(let oppObj of opponents){
        document.getElementById(`classOpponent`).append(new Option(oppObj.name, oppObj.name))
    }

    const userId = window.location.href.split("id=")[1]

    appbaseRef = dbHelp.auth()
    dbHelp.search(appbaseRef, userId)

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
                document.getElementById(`oppImg`).src = "assets/" + stats.img
            }
        }
    }
}

document.getElementById(`fight`).onclick = function() {
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
    
        for(let stats of opponents){
            if(stats.name == oppClass){
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

document.getElementById(`action-hack`).onclick = function() {
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
        if((Math.random()*100)>50){
            oppDmgTaken = charCoding
            heroCriticalText = ""
        }
        else{
            oppDmgTaken = charCoding + 1
            heroCriticalText = " (Critical Hit)"
        }
        const newOppFw = oppFw - oppDmgTaken

        let heroDmgTaken
        let oppCriticalText
        if((Math.random()*100)>30){
            heroDmgTaken = oppStrength
            oppCriticalText = ""
        }
        else{
            heroDmgTaken = oppStrength + 1
            oppCriticalText = " (Critical Hit)"
        }
        const newHeroHp = charHp - heroDmgTaken
    
        document.getElementById(`combat`).innerHTML += '\n' + charName + ' used his hacking skills to reduce ' + oppName + '\’(s) firewall by ' + oppDmgTaken + heroCriticalText
        document.getElementById(`combat`).innerHTML += '\n' + oppName + ' - Remaining firewall : ' + newOppFw
    
        if(newOppFw < 1){
            victoryUpdate('Fw')
        }
        else{
            document.getElementById(`combat`).innerHTML += '\n' + oppName + ' attacked ' + charName + ' for ' + heroDmgTaken + oppCriticalText
            document.getElementById(`combat`).innerHTML += '\n' + charName + ' - Remaining health : ' + newHeroHp
            if(newHeroHp < 1){
                document.getElementById(`combat`).innerHTML += '\n' + 'Game Over!'
                document.getElementById(`heroLabelHp`).innerHTML = 0
                document.getElementById(`heroHp`).style.width = 0
                document.getElementById(`oppLabelFw`).innerHTML = newOppFw
                document.getElementById(`oppFw`).style.width = (newOppFw / oppFwTotal * 60) + "%"
                isGameOver = true
            }
            else{
                document.getElementById(`heroLabelHp`).innerHTML = newHeroHp
                document.getElementById(`oppLabelFw`).innerHTML = newOppFw
                document.getElementById(`heroHp`).style.width = (newHeroHp / charHpTotal * 60) + "%"
                document.getElementById(`oppFw`).style.width = (newOppFw / oppFwTotal * 60) + "%"
            }
        }
        document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight 
    }
}

document.getElementById(`action-punch`).onclick = function() {

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
        if((Math.random()*100)>50){
            oppDmgTaken = charStrength
            heroCriticalText = ""
        }
        else{
            oppDmgTaken = charStrength + 1
            heroCriticalText = " (Critical Hit)"
        }
        const newOppHp = oppHp - oppDmgTaken

        let heroDmgTaken
        let oppCriticalText
        if((Math.random()*100)>30){
            heroDmgTaken = oppStrength
            oppCriticalText = ""
        }
        else{
            heroDmgTaken = oppStrength + 1
            oppCriticalText = " (Critical Hit)"
        }
        const newHeroHp = charHp - heroDmgTaken
    
        document.getElementById(`combat`).innerHTML += '\n' + charName + ' used his mighty punch to reduce ' + oppName + '\’(s) health by ' + oppDmgTaken + heroCriticalText
        document.getElementById(`combat`).innerHTML += '\n' + oppName + ' - Remaining health : ' + newOppHp
    
        if(newOppHp < 1){
            victoryUpdate('Hp')
        }
        else{
            document.getElementById(`combat`).innerHTML += '\n' + oppName + ' attacked ' + charName + ' for ' + heroDmgTaken + oppCriticalText
            document.getElementById(`combat`).innerHTML += '\n' + charName + ' - Remaining health : ' + newHeroHp
            if(newHeroHp < 1){
                document.getElementById(`combat`).innerHTML += '\n' + 'Game Over!'
                document.getElementById(`heroLabelHp`).innerHTML = 0
                document.getElementById(`heroHp`).style.width = 0
                document.getElementById(`oppLabelHp`).innerHTML = newOppHp
                document.getElementById(`oppHp`).style.width = (newOppHp / oppHpTotal * 60) + "%"
                isGameOver = true
            }
            else{
                document.getElementById(`heroLabelHp`).innerHTML = newHeroHp
                document.getElementById(`oppLabelHp`).innerHTML = newOppHp
                document.getElementById(`heroHp`).style.width = (newHeroHp / charHpTotal * 60) + "%"
                document.getElementById(`oppHp`).style.width = (newOppHp / oppHpTotal * 60) + "%"
            }
        }
        document.getElementById("combat").scrollTop = document.getElementById("combat").scrollHeight 
    }
}