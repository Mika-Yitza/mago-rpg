export function auth(){
    const appbaseRef = Appbase({
        url: 'https://mago-gvidyko-arc.searchbase.io',
        app: 'mago-rpg',
        credentials: '855393263486:fc178b51-0c98-476e-a041-bcf1519cb7f0',
    })
    return appbaseRef
}

export function add(appbaseRef, char){
    
    appbaseRef.index({
        type: '_doc',
        id: 'X2',
        body: char
    })
    .then(function(response) {
        console.log(response)
    })
    .catch(function(error) {
        console.log(error)
    })
}

export async function uniqueAdd(appbaseRef, name, userData){
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
        add(appbaseRef, userData)
    }
}