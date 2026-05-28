/*
========================================
€м𝐨Ⓝ HANDLER3.JS
SECURITY SYSTEM
========================================
*/

async function securityHandler(ctx){

const {

sock,
m,

body,
from,

sender,
senderNumber,

isGroup,

loadJSON,
saveJSON,

DB_FOLDER,

isBotAdmin,
isGlobalBan

} = ctx

/*
========================================
GLOBAL BAN
========================================
*/

if(isGlobalBan){

await sock.sendMessage(
from,
{
text:
"🚫 You Are Globally Banned"
},
{
quoted:m
}
)

return true

}

/*
========================================
LOCAL BAN
========================================
*/

const localBanPath =
`${DB_FOLDER}/ban.json`

const localBans =
loadJSON(localBanPath)

if(
Array.isArray(localBans) &&
localBans.includes(senderNumber)
){

await sock.sendMessage(
from,
{
text:
"🚫 You Are Banned"
},
{
quoted:m
}
)

return true

}

/*
========================================
SETTINGS
========================================
*/

const settingsPath =
`${DB_FOLDER}/settings.json`

const settings =
loadJSON(settingsPath)

if(!settings[from]){

settings[from] = {

antilink:false,
welcome:false,
warn:false

}

saveJSON(
settingsPath,
settings
)

}

/*
========================================
ANTI LINK
========================================
*/

if(
settings[from].antilink &&
body.includes(
"https://chat.whatsapp.com"
)
){

await sock.sendMessage(
from,
{
text:
"❌ Group Link Not Allowed"
},
{
quoted:m
}
)

if(
isGroup &&
isBotAdmin
){

try{

await sock.groupParticipantsUpdate(
from,
[sender],
"remove"
)

}catch(err){

console.log(err)

}

}

return true

}

return false

}

module.exports = {
securityHandler
}
