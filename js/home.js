import * as dbHelp from '../js/db-helper.js'

let appbaseRef
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
    for(let classObj of heroClassStats){
        document.getElementById(`class`).append(new Option(classObj.name, classObj.name))
    }

    appbaseRef = dbHelp.auth()
}

document.getElementById(`create`).onclick = function() {
    const charName = document.getElementById(`register-name`).value

    if (charName === '') {
        alert('You need to name your hero before you can create it')
    }
    else{
        const password = document.getElementById(`register-pass`).value

        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

        if (password === '' || password.match(/\d+/g) === null || format.test(password) === false)  {
            alert('You need set a password with numbers and special characters.')
        }
        else{

            const charClass = document.getElementById(`class`).value

            if (charClass === 'Pick your class') {
                alert('You need select a class before you can create your hero')
            }
            else{
                let userData

                const encryptedPass = Math.random().toString(36).substr(2, 5) + "%mago%" + password + "%mago%" + Math.random().toString(36).substr(2, 5)
                const id = Math.random().toString(36).substr(2, 5) + Date.now()

                for(let stats of heroClassStats){
                    if(stats.name == charClass){
                        userData = {
                            name: charName,
                            password: encryptedPass,
                            class: charClass,
                            health: stats.health,
                            coding: stats.coding,
                            strength: stats.strength,
                            level: 1,
                            xp: 0
                        }
                        dbHelp.register(appbaseRef, charName, userData, id)
                    }
                }
            }
        }
    }
}

document.getElementById(`play`).onclick = function() {
    const charName = document.getElementById(`login-name`).value

    if (charName === '') {
        alert(`Please enter your hero's name`)
    }
    else{
        const password = document.getElementById(`login-pass`).value

        if (password === '') {
            alert('Please enter your password')
        }
        else{
            dbHelp.login(appbaseRef, charName, password)
        }
    }
}

document.getElementById(`passViewLogin`).onclick = function() {

    if(document.getElementById(`passViewLogin`).innerHTML == 'show'){
        document.getElementById(`passViewLogin`).innerHTML = 'hide'
        document.getElementById(`login-pass`).type = 'text'
    }
    else{
        document.getElementById(`passViewLogin`).innerHTML = 'show'
        document.getElementById(`login-pass`).type = 'password'
    }
}


document.getElementById(`passViewRegister`).onclick = function() {

    if(document.getElementById(`passViewRegister`).innerHTML == 'show'){
        document.getElementById(`passViewRegister`).innerHTML = 'hide'
        document.getElementById(`register-pass`).type = 'text'
    }
    else{
        document.getElementById(`passViewRegister`).innerHTML = 'show'
        document.getElementById(`register-pass`).type = 'password'
    }
}