export function auth(){
    const appbaseRef = Appbase({
        url: 'https://mago-gvidyko-arc.searchbase.io',
        app: 'mago-rpg',
        credentials: '855393263486:fc178b51-0c98-476e-a041-bcf1519cb7f0',
    })
    return appbaseRef
}

export function add(appbaseRef, char, id){
    
    appbaseRef.index({
        type: '_doc',
        id: id,
        body: char
    })
    .then(function() {
        window.open("menu.html", "_self")
    })
    .catch(function(error) {
        console.log(error)
    })    
}

export async function register(appbaseRef, name, userData, id){
    const searchResult = await appbaseRef.search({
        body: {
            query: {
                match: {
                    name: name
                }
            }
        }
    }).then(function(response) {
        return response
    }).catch(function(error) {
        console.log("caught an error: ", error)
    })
        
    if(searchResult.hits.hits.length > 0){
        alert('The name is already taken.')
    }
    else{
        add(appbaseRef, userData, id)
    }
}

export async function login(appbaseRef, name, password){
    await appbaseRef.search({
        body: {
            query: {
                match: {
                    name: name
                }
            }
        }
    }).then(function(response) {
        if(response.hits.hits.length == 0){
            alert(`We couldn't find any hero with that name.`)
        }
        else{
            const decryptedPass = response.hits.hits[0]._source.password.split("%mago%")[1]
            if(decryptedPass == password){
                const heroId = response.hits.hits[0]._id
                window.open("menu.html", "_self")
            }
            else{
                alert(`The password is incorrect.`)
            }
        }
    }).catch(function(error) {
        console.log("caught an error: ", error)
    })
}

export async function search(appbaseRef, id){
    await appbaseRef.search({
        body: {
            query: {
                match: {
                    _id: id
                }
            }
        }
    }).then(function(response) {
        const heroData = response.hits.hits[0]._source

        sessionStorage.clear()
        sessionStorage.setItem('id', id)
        sessionStorage.setItem('name', heroData.name)
        sessionStorage.setItem('class', heroData.class)
        sessionStorage.setItem('health', heroData.health)
        sessionStorage.setItem('coding', heroData.coding)
        sessionStorage.setItem('strength', heroData.strength)
        sessionStorage.setItem('level', heroData.level)
        sessionStorage.setItem('xp', heroData.xp)
        sessionStorage.setItem('password', heroData.password)

    }).catch(function(error) {
        console.log("caught an error: ", error)
    })
}
