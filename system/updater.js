const axios = require("axios")
const { exec } = require("child_process")
const cron = require("node-cron")
const fs = require("fs")

const LOCAL_VERSION = require("../package.json").version

const VERSION_URL =
"https://raw.githubusercontent.com/emonbhaiwpbot/Wp-Control/main/version.json"

async function checkUpdate() {

try {

const { data } = await axios.get(VERSION_URL)

const githubVersion = data.version
const force = data.force

if (
githubVersion !== LOCAL_VERSION ||
force === true
) {

console.log("[ UPDATE DETECTED ]")

exec("git pull", (err, stdout) => {

if (err) {
console.log(err)
return
}

console.log(stdout)

exec("npm install", (err2, stdout2) => {

if (err2) {
console.log(err2)
return
}

console.log(stdout2)

console.log("[ BOT RESTARTING ]")

process.exit()

})

})

}

} catch (e) {

console.log("[ UPDATE ERROR ]")
console.log(e)

}

}

cron.schedule("*/1 * * * *", async () => {

await checkUpdate()

})

module.exports = {
checkUpdate
}
