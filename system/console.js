const chalk = require("chalk")
const gradient = require("gradient-string")

function log(text) {
console.log(
gradient.instagram(`\n[ EMON-X ] ${text}\n`)
)
}

module.exports = { log }
