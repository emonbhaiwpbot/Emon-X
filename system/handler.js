/*
========================================
€м𝐨Ⓝ HANDLER.JS
========================================
*/

const fs = require("fs")
const path = require("path")

const config =
require("../config")

/*
========================================
DATABASE
========================================
*/

const DB_FOLDER =
"./plugins/emon"

if(!fs.existsSync(DB_FOLDER)){

fs.mkdirSync(
DB_FOLDER,
{
recursive:true
}
)

}

const dbFiles = [

"groups.json",
"users.json",
"warns.json",
"settings.json",
"premium.json",
"ai.json",
"ban.json"

]

for(let file of dbFiles){

const fullPath =
`${DB_FOLDER}/${file}`

if(!fs.existsSync(fullPath)){

if(file === "ban.json"){

fs.writeFileSync(
fullPath,
JSON.stringify([],null,2)
)

}else{

fs.writeFileSync(
fullPath,
JSON.stringify({},null,2)
)

}

}

}

/*
========================================
JSON SYSTEM
========================================
*/

function loadJSON(file){

if(!fs.existsSync(file)){

fs.writeFileSync(
file,
JSON.stringify({},null,2)
)

}

return JSON.parse(
fs.readFileSync(file)
)

}

function saveJSON(file,data){

fs.writeFileSync(
file,
JSON.stringify(data,null,2)
)

}

/*
========================================
HANDLER
========================================
*/

async function handleMessage(
sock,
m
){

try{

const body =
m.message?.conversation ||

m.message?.extendedTextMessage
?.text ||

m.message?.imageMessage
?.caption ||

m.message?.videoMessage
?.caption ||

""

const from =
m.key.remoteJid

const isGroup =
from.endsWith("@g.us")

const sender =
m.key.participant ||
from

const senderNumber =
sender.split("@")[0]

/*
========================================
PREFIX
========================================
*/

const prefix =
config.prefix.find(v =>
body.startsWith(v)
)

const isCmd =
prefix !== undefined

const command =
isCmd
? body
.slice(prefix.length)
.trim()
.split(" ")[0]
.toLowerCase()
: body
.trim()
.split(" ")[0]
.toLowerCase()

const args =
body
.trim()
.split(" ")
.slice(1)

const cmd =
global.plugins[command]

/*
========================================
GROUP INFO
========================================
*/

let isGroupAdmin =
false

let isBotAdmin =
false

let groupAdmins =
[]

if(isGroup){

try{

const metadata =
await sock.groupMetadata(
from
)

groupAdmins =
metadata.participants
.filter(v => v.admin)
.map(v => v.id)

isGroupAdmin =
groupAdmins.includes(
sender
)

const botIds = [

sock.user.id,

sock.user.id
.split(":")[0] +
"@s.whatsapp.net"

]

isBotAdmin =
groupAdmins.some(id =>
botIds.includes(id)
)

}catch(err){

console.log(err)

}

}

/*
========================================
OWNER & ADMIN
========================================
*/

const isOwner =
senderNumber ===
config.owner

const isAdmin =

config.admins.includes(
senderNumber
)

||

global.GLOBAL_ADMIN
.includes(senderNumber)

/*
========================================
GLOBAL BAN
========================================
*/

if(
global.GLOBAL_BAN
.includes(senderNumber)
){

return sock.sendMessage(
from,
{
text:
"🚫 You Are Globally Banned"
},
{
quoted:m
}
)

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

return sock.sendMessage(
from,
{
text:
"🚫 You Are Banned"
},
{
quoted:m
}
)

}

/*
========================================
ANTI LINK
========================================
*/

const settingsPath =
`${DB_FOLDER}/settings.json`

const settings =
loadJSON(settingsPath)

if(
!settings[from]
){

settings[from] = {

antilink:false,
welcome:false

}

saveJSON(
settingsPath,
settings
)

}

if(
settings[from].antilink &&
body.includes(
"https://chat.whatsapp.com"
)
){

try{

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

if(isBotAdmin){

await sock.groupParticipantsUpdate(
from,
[sender],
"remove"
)

}

}catch(err){

console.log(err)

}

return

}

/*
========================================
FAKE TYPING
========================================
*/

if(config.fakeTyping){

try{

await sock.sendPresenceUpdate(
"composing",
from
)

}catch{}

}

/*
========================================
PLUGIN EVENTS
========================================
*/

for(let name in global.plugins){

const plugin =
global.plugins[name]

if(plugin.event){

try{

await plugin.event({

sock,
m,

body,
from,
sender,

args,
command,
isCmd,

isGroup,
isOwner,
isAdmin,

isGroupAdmin,
isBotAdmin,

config,

loadJSON,
saveJSON,

DB_FOLDER,

GLOBAL_ADMIN:
global.GLOBAL_ADMIN,

GLOBAL_BAN:
global.GLOBAL_BAN

})

}catch(err){

console.log(err)

}

}

}

/*
========================================
COMMAND NOT FOUND
========================================
*/

if(!cmd)
return

/*
========================================
GROUP ONLY
========================================
*/

if(
cmd.config.group &&
!isGroup
){

return sock.sendMessage(
from,
{
text:
"❌ Group Only Command"
},
{
quoted:m
}
)

}

/*
========================================
BOT ADMIN
========================================
*/

if(
cmd.config.botAdmin &&
!isBotAdmin
){

return sock.sendMessage(
from,
{
text:
"❌ Bot Must Be Admin"
},
{
quoted:m
}
)

}

/*
========================================
GROUP ADMIN
========================================
*/

if(
cmd.config.admin &&
!isGroupAdmin
){

return sock.sendMessage(
from,
{
text:
"❌ Group Admin Only"
},
{
quoted:m
}
)

}

/*
========================================
OWNER ONLY
========================================
*/

if(
cmd.config.owner
){

if(
!isOwner &&
!isAdmin
){

return sock.sendMessage(
from,
{
text:
"❌ Owner/Admin Only"
},
{
quoted:m
}
)

}

}

/*
========================================
LOG
========================================
*/

if(isCmd){

console.log(`
╔════════════════════════════╗
║         €м𝐨Ⓝ LOG           ║
╠════════════════════════════╣
║ 👤 User : ${senderNumber}
║ 💬 Type : ${isGroup ? "GROUP" : "PRIVATE"}
║ ⚡ Cmd  : ${command}
╚════════════════════════════╝
`)

}

/*
========================================
RUN COMMAND
========================================
*/

await cmd.run({

sock,
m,

body,
from,
sender,

args,
command,
isCmd,

isGroup,
isOwner,
isAdmin,

isGroupAdmin,
isBotAdmin,

config,

loadJSON,
saveJSON,

DB_FOLDER,

GLOBAL_ADMIN:
global.GLOBAL_ADMIN,

GLOBAL_BAN:
global.GLOBAL_BAN

})

}catch(err){

console.log(err)

}

}

module.exports = {
handleMessage
}
