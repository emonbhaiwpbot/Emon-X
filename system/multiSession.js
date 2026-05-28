/*
========================================
€м𝐨Ⓝ MULTI SESSION
========================================
*/

const fs = require("fs")
const path = require("path")

const {
createPairSession
} = require("./pairSystem")

const {
SESSION_FOLDER
} = require("./sessionManager")

async function loadSessions(){

if(
!fs.existsSync(
SESSION_FOLDER
)
) return

const folders =
fs.readdirSync(
SESSION_FOLDER
)

for(
const number of folders
){

try{

await createPairSession(
number
)

console.log(`
✅ SESSION LOADED :
${number}
`)

}catch(err){

console.log(err)

}

}

}

module.exports = {
loadSessions
}
