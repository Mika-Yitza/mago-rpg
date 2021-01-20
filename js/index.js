let title = 'MAGO rpg title'
const heroClassStats = [
    {
        name : 'Tester',
        health : 10,
        coding : 1,
        hacking : 3
    },
    {
        name : 'Developer',
        health : 8,
        coding : 3,
        hacking : 2
    }
]

window.onload = function() {
    document.getElementById(`title`).innerHTML = title

    const classes = ['Tester', 'Developer']

    for(let className of classes){
        document.getElementById(`class`).append(new Option(className, className))
    }
}

document.getElementById(`create`).onclick = function() {
    title = 'New title'
    document.getElementById(`title`).innerHTML = title

    const charName = document.getElementById(`name`).value
    const charClass = document.getElementById(`class`).value

    for(let stats of heroClassStats){
        if(stats.name == charClass){
            document.getElementById(`panel`).innerHTML = charName + '\n\n Class: ' + charClass +
            '\n HP: ' + stats.health + '\n Coding: ' + stats.coding + '\n Hacking: ' + stats.hacking
        }
    }
}

document.getElementById(`fight`).onclick = function() {
    const charName = document.getElementById(`name`).value
    const oppName = document.getElementById(`opponent`).value

    document.getElementById(`combat`).innerHTML = charName + ' is ready to fight ' + oppName
}