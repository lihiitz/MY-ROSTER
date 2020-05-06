

let players = [] //player = {personId, name, jersey, pos, img}
let playerStats = {}
let dreamTeam = [] // array of player Obect
// $("select").change(function() {
//     const teamName = $(`select option:selected`).data().name
//     $.get(`teams/${teamName}`, function(data) {
//         addPlayers(data)
//         render(`#container-template`, {data: players}, `#container`)
//     })
// })

$(`#getRoster`).on(`click`, function() {
    const teamName = $(`input`).val()
    $.get(`teams/${teamName}`, function(data) {
        addPlayers(players, data)
        render(`#container-template`, {data: players}, `#container`)
    })
    console.log(players);
})
$(`#dreamTeam`).on(`click`, function(){
    $.get(`/dreamTeam`, function(data){
        dreamTeam.length = 0
        addPlayers(dreamTeam, data)
        render(`#dreamTeam-template`, {data: dreamTeam}, `#container`)
        console.log(dreamTeam);
        
    })
})
$(`#container`).on(`click`, `img`, function(){
    $.get(`/playerStats/james/lebron`, function(data){
        playerStats = data
        console.log(playerStats); 
    })
})
$(`#container`).on(`click`, `.addToDreamTeam`, function(){
    const playerId = $(this).closest(`div`).data().id
    console.log(playerId)
    $.post(`/roster`, {playerId}, function(data){
        console.log("POST complete")
    })
})
const addPlayers = function(arr, data){
    arr.length = 0
    data.forEach(element => {
        arr.push(
            {
                personId: element.personId,
                name: element.firstName + ' ' + element.lastName,
                jersey: element.jersey,
                pos: element.pos,
                imgUrl: `https://nba-players.herokuapp.com/players/${element.lastName}/${element.firstName}`,
            }
        )
    })
}

const myFunction = function(){
    return "https://cdn.britannica.com/s:700x500/18/137318-050-29F7072E/rooster-Rhode-Island-Red-roosters-chicken-domestication.jpg"
}
const render = function(src, data, append){
    $(append).empty()
    const source = $(src).html()
    const template = Handlebars.compile(source)
    let newHtml = template(data)
     $(append).append(newHtml)
}