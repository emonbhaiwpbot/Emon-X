const {
deleteSession
} = require("../system/sessionManager")

module.exports = {

config:{

name:"deletebot",
aliases:["delsession"],
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

await deleteSession(
number
)

await sock.sendMessage(
m.key.remoteJid,
{
text:
`✅ Deleted : ${number}`
},
{
quoted:m
}
)

}

}
