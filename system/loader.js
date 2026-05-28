const fs = require("fs")
const path = require("path")

async function loadPlugins() {

global.plugins = {}

const base = path.join(__dirname, "../plugins")

const folders = fs.readdirSync(base)

for (const folder of folders) {

const folderPath = path.join(base, folder)

if (!fs.lstatSync(folderPath).isDirectory()) continue

const files = fs.readdirSync(folderPath)

for (const file of files) {

if (!file.endsWith(".js")) continue

const pluginPath = path.join(folderPath, file)

try {

delete require.cache[require.resolve(pluginPath)]

const plugin = require(pluginPath)

if (plugin.name) {
global.plugins[plugin.name] = plugin
}

} catch (e) {
module.exports = { loadPlugins }
