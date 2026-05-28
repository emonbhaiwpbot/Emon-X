/*
========================================
€м𝐨Ⓝ PAIR SYSTEM
========================================
*/

const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const path = require("path")

const {
saveSession,
SESSION_FOLDER
} = require("./sessionManager")

async function createPairSession(
number
){

const sessionPath =
path.join(
SESSION_FOLDER,
number
)

const {
state,
saveCreds
} =
await useMultiFileAuthState(
sessionPath
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
"EMON-X",
"Chrome",
"1.0.0"
]

})

sock.ev.on(
"creds.update",
saveCreds
)

saveSession(
number,
sock
)

/*
========================================
WAIT CONNECTION
========================================
*/

await new Promise(resolve => {

sock.ev.on(
"connection.update",
(update)=>{

const {
connection
} = update

if(
connection ===
"connecting"
){

resolve()

}

}
)

})

/*
========================================
PAIR CODE
========================================
*/

let code = null

if(
!state.creds.registered
){

code =
await sock.requestPairingCode(
number
)

}

return {
sock,
code
}

}

module.exports = {
createPairSession
}
