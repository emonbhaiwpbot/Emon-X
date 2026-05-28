const fs = require("fs")
const config = require("../../config.json")

module.exports = async (sock, data) => {

const settings = JSON.parse(fs.readFileSync("./database/settings.json"))

const group = data.id

if (!settings[group]) return

if (!settings[group].welcome) return

for (const user of data.participants) {

if (data.action === "add") {

await sock.sendMessage(group, {
text: `Welcome To ${config.botName}\n@${user.split("@")[0]}`,
mentions: [user]
})

}

}

}
