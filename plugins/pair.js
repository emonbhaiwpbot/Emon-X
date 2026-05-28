const {
createPairSession
} = require("../system/pairSystem")

module.exports = {

config:{

name:"pair",
aliases:["connect"],
owner:true

},

run: async({
sock,
m,
args
}) => {

const number =
args[0]

if(!number){

return sock.sendMessage(
m.key.remoteJid,
{
text:
"❌ Give Number"
},
{
quoted:m
}
)

}

try{

const {
code
} =
await createPairSession(
number
)

await sock.sendMessage(
m.key.remoteJid,
{
text:
`
╔════════════════════╗
║    PAIR CODE       ║
╠════════════════════╣
║ ${code}
╚════════════════════╝
`
},
{
quoted:m
}
)

}catch(err){

console.log(err)

}

}

}
