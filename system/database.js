const fs = require("fs")

function save(file, data) {

fs.writeFileSync(
file,
JSON.stringify(data, null, 2)
)

}

module.exports = {
save
}
