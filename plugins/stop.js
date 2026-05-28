const {
getSession
} = require("../system/sessionManager")

module.exports = {

config:{

name:"stop",
aliases:["stopbot"],
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

const bot =
getSession(number)

if(!bot){

return sock.sendMessage(
m.key.remoteJid,
{
text:
"❌ Session Not Found"
},
{
quoted:m
}
)

}

await bot.logout()

await sock.sendMessage(
m.key.remoteJid,
{
text:
`✅ Stopped : ${number}`
},
{
quoted:m
}
)

}

}
