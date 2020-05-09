const express = require(`express`)
const axios = require('axios')
////////////////////////////////
const router = express.Router()
////////////////////////////////
const teamToIDs = {
    "lakers": "1610612747",
    "warriors": "1610612744",
    "heat": "1610612748",
    "suns": "1610612756"
}
let dreamTeam = [] //max of 5 players // array of player Obect
let players = []

axios.get('http://data.nba.net/10s/prod/v1/2018/players.json').then(function (apiRes) {
    let data = apiRes.data
    players = data.league.standard
})

const createPlayers = function(players){
    const res = players.map(item => {
        let newItem = {
            personId: item.personId,
            firstName: item.firstName,
            lastName: item.lastName,
            jersey: item.jersey,
            pos: item.pos
        }
        return newItem
    })
    return res
}
router.get(`/dreamTeam`, function (req, res) {
    res.send(dreamTeam)
})
//get players on team
router.get(`/teams/:teamName`, function (req, res) {
    let teamName = req.params.teamName
    const teamID = teamToIDs[teamName]

    const matchPlayers = players.filter(item => item.teamId === teamID && item.isActive === true)
    res.send(createPlayers(matchPlayers))
})

router.get(`/playerStats/:lName/:fName`, function (req, res) {
    let fName = req.params.fName
    let lName = req.params.lName
    axios.get(`https://nba-players.herokuapp.com/players-stats/${lName}/${fName}`).then(function (apiRes) {
        let stats = apiRes.data
        console.log(`in server: ${stats}`);
        res.send(stats)
    })
})
const isInList = function(id){
    let find = dreamTeam.find(item => item.personId === id)
    if (find === undefined){
        return false
    }else{
        return true
    }
}
//add player to dream team
router.post(`/roster`, function (req, res) {//req.body = personId
    const playerId = req.body.playerId
    if (dreamTeam.length < 5 && !isInList(playerId)) {
        const player = players.filter(player => player.personId === playerId)        
        dreamTeam.push(createPlayers(player)[0])
    }
    res.send(dreamTeam)
})
router.put(`/team`, function (req, res) {//req.body = {teamName: name, teamId: id}
    const obj = req.body
    teamToIDs[obj.teamName] = obj.teamId
    res.send(`teamToIDs new count: ${Object.keys(teamToIDs).length}`)
})
//remove player from dream team
router.delete(`/roster/:playerId`, function(req, res){
    const playerId = req.params.playerId
    const index = dreamTeam.findIndex(item => item.personId === playerId)
    dreamTeam.splice(index, 1)
    res.send(`${playerId} was removed from dream team`)
})
//////////////////////////////////
module.exports = router