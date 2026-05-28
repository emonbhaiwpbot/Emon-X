const config = require("../config.json")
const axios = require("axios")

async function handleMessage(sock, m) {

try {

const body =
m.message?.conversation ||
m.message?.extendedTextMessage?.text ||
m.message?.imageMessage?.caption ||
m.message?.videoMessage?.caption ||
""

if (!body) return

const sender =
m.key.participant ||
m.key.remoteJid

const adminData = await axios.get(
"https://raw.githubusercontent.com/emonbhaiwpbot/Wp-Control/main/admin.json"
)

const banData = await axios.get(
"https://raw.githubusercontent.com/emonbhaiwpbot/Wp-Control/main/ban.json"
)

const admins = adminData.data
const bans = banData.data

if (bans.includes(sender)) return

let prefix = config.prefix

let isCmd = body.startsWith(prefix)

let command
let args

if (isCmd) {

command = body
.slice(prefix.length)
.trim()
.split(/ +/)
.shift()
.toLowerCase()

args = body.trim().split(/ +/).slice(1)

} else {

command = body
.trim()
.split(/ +/)
.shift()
.toLowerCase()

args = body.trim().split(/ +/).slice(1)

}

const plugin = global.plugins[command]

if (!plugin) return

const isAdmin = admins.includes(
sender.split("@")[0]
)

await plugin.execute(
sock,
m,
args,
{
body,
sender,
isAdmin,
config
}
)

} catch (e) {

console.log(e)

}

}

module.exports = {
handleMessage
}
