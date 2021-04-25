import * as dbHelp from '../js/db-helper.js'

let appbaseRef

window.onload = function() {

    appbaseRef = dbHelp.auth()
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