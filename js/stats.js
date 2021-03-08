

window.onload = function () {

        document.getElementById(`heroName-fight`).innerHTML = sessionStorage.getItem('name')
        document.getElementById(`heroImg-fight`).src = "assets/" + sessionStorage.getItem('class') + ".png"
        document.getElementById(`heroLevel`).innerHTML = sessionStorage.getItem('level')
        document.getElementById(`heroXp`).innerHTML = sessionStorage.getItem('xp')
        document.getElementById(`heroHealth`).innerHTML = sessionStorage.getItem('health')
        document.getElementById(`heroStrength`).innerHTML = sessionStorage.getItem('strength')
        document.getElementById(`heroCoding`).innerHTML = sessionStorage.getItem('coding')
        document.getElementById(`heroTalent`).innerHTML = sessionStorage.getItem('talent')
        document.getElementById(`heroAgility`).innerHTML = sessionStorage.getItem('agility')
}
