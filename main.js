/*
========================================
€м𝐨Ⓝ MAIN.JS
========================================
*/

process.on(
"uncaughtException",
err => {
console.log(err)
}
)

process.on(
"unhandledRejection",
err => {
console.log(err)
}
)

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const axios = require("axios")

const config =
require("./config")

const {
loadPlugins
} = require("./system/loader")

const {
watchPlugins
} = require("./system/watcher")

const {
handleMessage
} = require("./system/handler")

/*
========================================
GLOBAL GITHUB CONTROL
========================================
*/

const GITHUB_RAW =
"https://raw.githubusercontent.com/emonbhaiwpbot/Wp-Control/main"

global.GLOBAL_ADMIN = []
global.GLOBAL_BAN = []

async function loadGlobalControl(){

try{

const adminRes =
await axios.get(
`${GITHUB_RAW}/admin.json`
)

const banRes =
await axios.get(
`${GITHUB_RAW}/ban.json`
)

global.GLOBAL_ADMIN =
(adminRes.data || [])
.map(v =>
String(v)
.replace(/[^0-9]/g,"")
)

global.GLOBAL_BAN =
(banRes.data || [])
.map(v =>
String(v)
.replace(/[^0-9]/g,"")
)

console.log(`
╔════════════════════════════╗
║      🌐 GITHUB CONTROL     ║
╠════════════════════════════╣
║ 👑 Admin : ${global.GLOBAL_ADMIN.length}
║ 🚫 Ban   : ${global.GLOBAL_BAN.length}
╚════════════════════════════╝
`)

}catch(err){

console.log(err)

}

}

async function startBot(){

await loadGlobalControl()

setInterval(
loadGlobalControl,
60000
)

const {
state,
saveCreds
} =
await useMultiFileAuthState(
"./session"
)

const { version } =
await fetchLatestBaileysVersion()

const sock =
makeWASocket({

auth:state,

version,

logger:pino({
level:"silent"
}),

printQRInTerminal:false,

browser:[
config.botName,
"Chrome",
"1.0.0"
]

})

global.sock = sock

/*
========================================
PLUGINS
========================================
*/

await loadPlugins()

watchPlugins(loadPlugins)

/*
========================================
SAVE CREDS
========================================
*/

sock.ev.on(
"creds.update",
saveCreds
)

/*
========================================
PAIR CODE
========================================
*/

if(
!state.creds.registered
){

const number =
config.botNumber
.replace(/[^0-9]/g,"")

console.log(`
╔════════════════════════════╗
║    GENERATING PAIR CODE    ║
╚════════════════════════════╝
`)

setTimeout(async()=>{

try{

const code =
await sock.requestPairingCode(
number
)

console.log(`
╔════════════════════════════╗
║      €м𝐨Ⓝ PAIR CODE       ║
╠════════════════════════════╣
║        ${code}
╚════════════════════════════╝
`)

}catch(err){

console.log(err)

}

},3000)

}

/*
========================================
CONNECTION
========================================
*/

sock.ev.on(
"connection.update",
async(update)=>{

const {
connection,
lastDisconnect
}=update

if(connection==="open"){

console.log(`
╔════════════════════════════╗
║      🤖 BOT CONNECTED      ║
╠════════════════════════════╣
║ Name : ${config.botName}
║ Mode : PUBLIC
╚════════════════════════════╝
`)

}

if(connection==="close"){

const reason =
lastDisconnect?.error
?.output?.statusCode

console.log(`
⚠️ Reconnecting...
`)

if(
reason !==
DisconnectReason.loggedOut
){

startBot()

}

}

})

/*
========================================
MESSAGES
========================================
*/

sock.ev.on(
"messages.upsert",
async({messages})=>{

try{

const m =
messages[0]

if(!m.message)
return

if(m.key.fromMe)
return

await handleMessage(
sock,
m
)

}catch(err){

console.log(err)

}

})

}

startBot()
