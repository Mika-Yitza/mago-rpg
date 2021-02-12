let title = 'Home Page'
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
            }
        }
    }
}