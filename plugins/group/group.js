module.exports = {
name: "group",

async execute(sock, m, args) {

const action = args[0]

if (action === "open") {

await sock.groupSettingUpdate(
m.key.remoteJid,
"not_announcement"
)

await sock.sendMessage(m.key.remoteJid, {
text: "Group Opened"
}, {
quoted: m
})

}

if (action === "close") {

await sock.groupSettingUpdate(
m.key.remoteJid,
"announcement"
)

await sock.sendMessage(m.key.remoteJid, {
text: "Group Closed"
}, {
quoted: m
})

}
}
