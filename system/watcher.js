const chokidar = require("chokidar")

let timeout = null

function watchPlugins(loadPlugins) {

const watcher = chokidar.watch(
"./plugins",
{
ignored: /(^|[\\/])\\../,
persistent: true,
ignoreInitial: true
}
)

watcher.on("change", async() => {

clearTimeout(timeout)

timeout = setTimeout(async() => {

console.log("[ PLUGINS UPDATED ]")

await loadPlugins()

}, 1000)

})

}

module.exports = {
watchPlugins
}
