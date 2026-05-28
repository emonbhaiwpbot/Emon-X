module.exports = {
name: "restart",

async execute(sock, m, args, extra) {

if (!extra.isAdmin) return

await sock.sendMessage(m.key.remoteJid, {
text: "Restarting"
}, {
quoted: m
})

process.exit()

}
}
