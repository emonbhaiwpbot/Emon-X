const chokidar = require("chokidar")

function watchPlugins(loadPlugins) {

chokidar.watch("./plugins").on("all", async () => {

console.log("[ PLUGINS UPDATED ]")

await loadPlugins()

})

}

module.exports = {
watchPlugins
}
