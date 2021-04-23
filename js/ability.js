import * as dbHelp from './db-helper.js'
import {abilities} from '.././data/abilities.js'

const actions = 6
let userData, appbaseRef

window.onload = function () {

        userData = dbHelp.getStoredValues()
        appbaseRef = dbHelp.auth()
        let k=0
        for(let i=1; i<=actions; i++){
                for(let j=k; j< abilities.length;j++){
                        if(abilities[j][`for${userData.class}`]){
                                document.getElementById(`action${i}`).innerHTML = abilities[j].name
                                if(userData.ability1 == abilities[j].name || userData.ability2 == abilities[j].name || userData.ability3 == abilities[j].name){
                                        document.getElementById(`action${i}`).disabled = true
                                        document.getElementById(`action${i}`).innerHTML += ' - selected'
                                }
                                if(userData.level < abilities[j].level){
                                        document.getElementById(`action${i}`).disabled = true
                                        document.getElementById(`action${i}`).innerHTML += ' (level ' + abilities[j].level + ')'  
                                }
                                k=j+1
                                break
                        }
                }
        }
}

for(let i=1; i<=actions; i++){
        document.getElementById(`action${i}`).onclick = function () {
                const id = window.location.href.split('=')[1]
                const newData = {
                        name: userData.name,
                        password: userData.password,
                        class: userData.class,
                        health: userData.health,
                        coding: userData.coding,
                        strength: userData.strength,
                        talent: userData.talent,
                        agility: userData.agility,
                        ability1: userData.ability1,
                        ability2: userData.ability2,
                        ability3: userData.ability3,
                        level: userData.level,
                        xp: userData.xp
                }
                newData[`ability${id}`] = document.getElementById(`action${i}`).innerHTML
                dbHelp.add(appbaseRef, newData, userData.id)
        }
}