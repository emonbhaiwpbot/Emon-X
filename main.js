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
const { log } = require("./system/console")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("./sessions/main")

const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
logger: pino({ level: "silent" }),
auth: state,
version,
printQRInTerminal: false,
browser: [config.botName, "Chrome", "1.0.0"]
})

global.sock = sock

global.plugins = {}

await loadPlugins()

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async ({ messages }) => {

const m = messages[0]

if (!m.message) return
if (m.key.remoteJid === "status@broadcast") return

await handleMessage(sock, m)

})

sock.ev.on("group-participants.update", async (data) => {

try {

const eventPath = path.join(__dirname, "plugins/events/welcomeEvent.js")

if (fs.existsSync(eventPath)) {
const event = require(eventPath)
await event(sock, data)
}

} catch {}

})

sock.ev.on("connection.update", async (update) => {

const { connection, lastDisconnect } = update

if (connection === "close") {

const reason = lastDisconnect?.error?.output?.statusCode

if (reason !== DisconnectReason.loggedOut) {
startBot()
}

}

if (connection === "open") {
log(`${config.botName} Connected`)
}

})

}

startBot()
