const axios = require("axios")
const cron = require("node-cron")

const LOCAL_VERSION =
require("../package.json").version

const VERSION_URL =
"https://raw.githubusercontent.com/emonbhaiwpbot/Wp-Control/main/version.json"

async function checkUpdate() {

try {

const { data } =
await axios.get(VERSION_URL)

const githubVersion =
data.version

if (
githubVersion !== LOCAL_VERSION
) {

console.log(`
╭──────────────────╮
│
│ UPDATE AVAILABLE
│
│ LOCAL : ${LOCAL_VERSION}
│ GITHUB : ${githubVersion}
│
╰──────────────────╯
`)

}

} catch (e) {

console.log("[ UPDATE CHECK ERROR ]")

}

}

cron.schedule(
"*/5 * * * *",
async() => {

await checkUpdate()

}
)

module.exports = {
checkUpdate
}
