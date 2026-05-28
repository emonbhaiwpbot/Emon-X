/*
========================================
€м𝐨Ⓝ HANDLER.JS
MAIN ROUTER SYSTEM
========================================
*/

const fs = require("fs")

const config =
require("../config")

const {
permissionHandler
} = require("./handler2")

const {
securityHandler
} = require("./handler3")

const {
eventHandler
} = require("./handler4")

const {
commandHandler
} = require("./handler5")

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
MAIN HANDLER
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

if(!body)
return

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
CTX
========================================
*/

const ctx = {

sock,
m,

body,
from,
sender,
senderNumber,

args,
command,
isCmd,

isGroup,

config,

cmd,

DB_FOLDER,

loadJSON,
saveJSON,

GLOBAL_ADMIN:
global.GLOBAL_ADMIN,

GLOBAL_BAN:
global.GLOBAL_BAN

}

/*
========================================
PERMISSION HANDLER
========================================
*/

await permissionHandler(ctx)

/*
========================================
SECURITY HANDLER
========================================
*/

const stopSecurity =
await securityHandler(ctx)

if(stopSecurity)
return

/*
========================================
EVENT HANDLER
========================================
*/

await eventHandler(ctx)

/*
========================================
COMMAND HANDLER
========================================
*/

await commandHandler(ctx)

}catch(err){

console.log(err)

}

}

module.exports = {
handleMessage
}
