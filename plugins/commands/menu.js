const config = require("../../config.json")

module.exports = {
name: "menu",
alias: ["help"],

async execute(sock, m) {

const text = `
╭─〔 ${config.botName} MENU 〕
│
├ ping
├ menu
├ setname
├ setprefix
├ welcome on/off
├ antilink on/off
│
╰──────────────
`

await sock.sendMessage(m.key.remoteJid, {
text
}, {
quoted: m
})

}
}
