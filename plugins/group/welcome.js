const fs = require("fs")

module.exports = {
name: "welcome",

async execute(sock, m, args) {

const settings = JSON.parse(fs.readFileSync("./database/settings.json"))

const group = m.key.remoteJid

if (!settings[group]) settings[group] = {}

if (args[0] === "on") {
settings[group].welcome = true
}

if (args[0] === "off") {
settings[group].welcome = false
}

fs.writeFileSync(
"./database/settings.json",
JSON.stringify(settings, null, 2)
)

await sock.sendMessage(group, {
text: `Welcome ${args[0]}`
}, {
quoted: m
})

}
}
