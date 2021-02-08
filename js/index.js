let title = 'MAGO rpg title'
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
                document.getElementById(`heroImg`).src = "assets/" + stats.img
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
                document.getElementById(`oppImg`).src = "assets/" + stats.img
            }
        }
    }
}

document.getElementById(`fight`).onclick = function() {
    const charPannel = document.getElementById(`panel`).value
    const oppPannel = document.getElementById(`opponentPanel`).value

    if (charPannel === '' || oppPannel === '') {
        alert('You need to create the hero and the opponent before you can fight')
    }
    else {
        const charName = document.getElementById(`name`).value
        const charClass = document.getElementById(`class`).value
        const oppName = document.getElementById(`opponent`).value
        const oppClass = document.getElementById(`classOpponent`).value
    
        document.getElementById(`combat`).innerHTML = charName + ' is ready to fight ' + oppName
    
        document.getElementById(`heroName-fight`).innerHTML = charName
        document.getElementById(`oppName-fight`).innerHTML = oppName
        document.getElementById(`heroImg-fight`).src = document.getElementById(`heroImg`).src
        document.getElementById(`oppImg-fight`).src = document.getElementById(`oppImg`).src
    
        for(let stats of heroClassStats){
            if(stats.name == charClass){
                document.getElementById(`heroLabelHp`).innerHTML = stats.health
                document.getElementById(`heroStrength-fight`).innerHTML = stats.strength
                document.getElementById(`heroCoding-fight`).innerHTML = stats.coding
                document.getElementById(`heroImg-fight`).alt = stats.health
            }
        }
    
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
        const charName = document.getElementById(`heroName-fight`).innerHTML
        const oppName = document.getElementById(`oppName-fight`).innerHTML
        const charHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
        const oppFw = parseInt(document.getElementById(`oppLabelFw`).innerHTML)
        const charCoding = parseInt(document.getElementById(`heroCoding-fight`).innerHTML)
        const oppStrength = parseInt(document.getElementById(`oppStrength-fight`).innerHTML)
        const charHpTotal = parseInt(document.getElementById(`heroImg-fight`).alt)
        const oppFwTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[1])
    
        const newHeroHp = charHp - oppStrength
        const newOppFw = oppFw - charCoding
    
        document.getElementById(`combat`).innerHTML += '\n' + charName + ' used his hacking skills to reduce ' + oppName + '\’(s) firewall by ' + charCoding
        document.getElementById(`combat`).innerHTML += '\n' + oppName + ' - Remaining firewall : ' + newOppFw
    
        if(newOppFw < 1){
            document.getElementById(`combat`).innerHTML += '\n' + 'Victory!'
            isGameOver = true
        }
        else{
            document.getElementById(`combat`).innerHTML += '\n' + oppName + ' attacked ' + charName + ' for ' + oppStrength
            document.getElementById(`combat`).innerHTML += '\n' + charName + ' - Remaining health : ' + newHeroHp
            if(newHeroHp < 1){
                document.getElementById(`combat`).innerHTML += '\n' + 'Game Over!'
                isGameOver = true
            }
            else{
                document.getElementById(`heroLabelHp`).innerHTML = newHeroHp
                document.getElementById(`oppLabelFw`).innerHTML = newOppFw
                document.getElementById(`heroHp`).style.width = (newHeroHp / charHpTotal * 60) + "%"
                document.getElementById(`oppFw`).style.width = (newOppFw / oppFwTotal * 60) + "%"
            }
        }
    }
}

document.getElementById(`action-punch`).onclick = function() {

    if (isGameOver) {
        alert(gameOverMessage)
    } 
    else {
        const charName = document.getElementById(`heroName-fight`).innerHTML
        const oppName = document.getElementById(`oppName-fight`).innerHTML
        const charHp = parseInt(document.getElementById(`heroLabelHp`).innerHTML)
        const oppHp = parseInt(document.getElementById(`oppLabelHp`).innerHTML)
        const charStrength = parseInt(document.getElementById(`heroStrength-fight`).innerHTML)
        const oppStrength = parseInt(document.getElementById(`oppStrength-fight`).innerHTML)
        const charHpTotal = parseInt(document.getElementById(`heroImg-fight`).alt)
        const oppHpTotal = parseInt(document.getElementById(`oppImg-fight`).alt.split('&')[0])
    
        const newHeroHp = charHp - oppStrength
        const newOppHp = oppHp - charStrength
    
        document.getElementById(`combat`).innerHTML += '\n' + charName + ' used his mighty punch to reduce ' + oppName + '\’(s) health by ' + charStrength
        document.getElementById(`combat`).innerHTML += '\n' + oppName + ' - Remaining health : ' + newOppHp
    
        if(newOppHp < 1){
            document.getElementById(`combat`).innerHTML += '\n' + 'Victory!'
            isGameOver = true
        }
        else{
            document.getElementById(`combat`).innerHTML += '\n' + oppName + ' attacked ' + charName + ' for ' + oppStrength
            document.getElementById(`combat`).innerHTML += '\n' + charName + ' - Remaining health : ' + newHeroHp
            if(newHeroHp < 1){
                document.getElementById(`combat`).innerHTML += '\n' + 'Game Over!'
                isGameOver = true
            }
            else{
                document.getElementById(`heroLabelHp`).innerHTML = newHeroHp
                document.getElementById(`oppLabelHp`).innerHTML = newOppHp
                document.getElementById(`heroHp`).style.width = (newHeroHp / charHpTotal * 60) + "%"
                document.getElementById(`oppHp`).style.width = (newOppHp / oppHpTotal * 60) + "%"
            }
        }
    }
}