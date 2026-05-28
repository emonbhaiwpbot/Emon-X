/*
========================================
€м𝐨Ⓝ SESSION MANAGER
========================================
*/

const fs = require("fs")
const path = require("path")

const sessions = new Map()

const SESSION_FOLDER =
"./session/users"

if(
!fs.existsSync(
SESSION_FOLDER
)
){

fs.mkdirSync(
SESSION_FOLDER,
{
recursive:true
}
)

}

/*
========================================
SAVE SESSION
========================================
*/

function saveSession(
number,
sock
){

sessions.set(
number,
sock
)

}

/*
========================================
GET SESSION
========================================
*/

function getSession(
number
){

return sessions.get(number)

}

/*
========================================
DELETE SESSION
========================================
*/

async function deleteSession(
number
){

const sessionPath =
path.join(
SESSION_FOLDER,
number
)

if(
fs.existsSync(sessionPath)
){

fs.rmSync(
sessionPath,
{
recursive:true,
force:true
}
)

}

sessions.delete(number)

}

/*
========================================
GET ALL SESSIONS
========================================
*/

function getAllSessions(){

return sessions

}

module.exports = {

saveSession,
getSession,
deleteSession,
getAllSessions,

SESSION_FOLDER

}
