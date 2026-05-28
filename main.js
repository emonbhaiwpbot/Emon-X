process.on("uncaughtException", console.log)
process.on("unhandledRejection", console.log)

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const fs = require("fs")
const path = require("path")

const config = require("./config.json")

const { loadPlugins } = require("./system/loader")
const { handleMessage } = require("./system/handler")
const { watchPlugins } = require("./system/watcher")
const { checkUpdate } = require("./system/updater")

async function startBot() {

await checkUpdate()

const {
state,
saveCreds
} = await useMultiFileAuthState(
"./sessions/main"
)

const { version } =
await fetchLatestBaileysVersion()

const sock = makeWASocket({

logger: pino({
level: "silent"
}),

auth: state,

version,

printQRInTerminal: false,

browser: [
config.botName,
"Chrome",
"1.0.0"
]

})

global.sock = sock
global.plugins = {}

await loadPlugins()

watchPlugins(loadPlugins)

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
!sock.authState.creds
.registered
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

sock.ev.on(
"messages.upsert",
async ({ messages }) => {

try {

const m = messages[0]

if (!m.message) return

if (
m.key.remoteJid ===
"status@broadcast"
) return

await handleMessage(
sock,
m
)

} catch (e) {

console.log(e)

}

}
)

sock.ev.on(
"group-participants.update",
async(data) => {

try {

const eventPath = path.join(
__dirname,
"./plugins/events/welcomeEvent.js"
)

if (
fs.existsSync(eventPath)
) {

delete require.cache[
require.resolve(eventPath)
]

const welcomeEvent =
require(eventPath)

await welcomeEvent(
sock,
data
)

}

} catch (e) {

console.log(e)

}

}
)

sock.ev.on(
"call",
async(callData) => {

try {

for (const call of callData) {

if (
call.status === "offer"
) {

await sock.sendMessage(
call.from,
{
text:
"CALL NOT ALLOWED"
}
)

await sock.updateBlockStatus(
call.from,
"block"
)

}

}

} catch (e) {

console.log(e)

}

}
)

sock.ev.on(
"connection.update",
async(update) => {

const {
connection,
lastDisconnect
} = update

if (
connection === "close"
) {

const reason =
lastDisconnect?.error
?.output?.statusCode

if (
reason !==
DisconnectReason.loggedOut
) {

console.log(
"[ RECONNECTING ]"
)

startBot()

}

}

if (
connection === "open"
) {

console.log(`
╔════════════════════════════╗
║
║   ${config.botName}
║
║      CONNECTED
║
╚════════════════════════════╝
`)

}

}
)

}

startBot()
