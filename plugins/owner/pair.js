module.exports = {
name: "pair",

async execute(sock, m, args, extra) {

if (!extra.isAdmin) return

const number = args[0]

if (!number) {
return sock.sendMessage(m.key.remoteJid, {
text: "Give Number"
}, {
quoted: m
})
}

const code = await sock.requestPairingCode(number)

await sock.sendMessage(m.key.remoteJid, {
text: `PAIR CODE : ${code}`
}, {
quoted: m
})

}
}
