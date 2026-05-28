const config = require("../config.json")
const admins = require("../admin.json")
const bans = require("../ban.json")

async function handleMessage(sock, m) {

const body =
m.message?.conversation ||
m.message?.extendedTextMessage?.text ||
""

const sender = m.key.participant || m.key.remoteJid

if (bans.includes(sender)) return

let prefix = config.prefix

let isCmd = body.startsWith(prefix)

let command
let args

if (isCmd) {

command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
args = body.trim().split(/ +/).slice(1)

} else {

command = body.trim().split(/ +/).shift().toLowerCase()
args = body.trim().split(/ +/).slice(1)

}

const plugin = global.plugins[command]

module.exports = { handleMessage }
