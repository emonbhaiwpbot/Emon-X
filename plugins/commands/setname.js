const fs = require("fs")
const config = require("../../config.json")

module.exports = {
name: "setname",

async execute(sock, m, args, extra) {

if (!extra.isAdmin) return

const name = args.join(" ")

if (!name) {
return sock.sendMessage(m.key.remoteJid, {
text: "Give Name"
}, {
quoted: m
})
}

config.botName = name

fs.writeFileSync(
"./config.json",
JSON.stringify(config, null, 2)
)

await sock.sendMessage(m.key.remoteJid, {
text: `Bot Name Changed To ${name}`
}, {
quoted: m
})

}
}
