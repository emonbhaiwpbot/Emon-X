/*
========================================
€м𝐨Ⓝ HANDLER2.JS
PERMISSION SYSTEM
========================================
*/

async function permissionHandler(ctx){

const {
sock,
m,

from,
sender,

senderNumber,

isGroup,

config,

GLOBAL_ADMIN,
GLOBAL_BAN

} = ctx

/*
========================================
GROUP INFO
========================================
*/

ctx.isGroupAdmin = false
ctx.isBotAdmin = false

if(isGroup){

try{

const metadata =
await sock.groupMetadata(from)

const groupAdmins =
metadata.participants
.filter(v => v.admin)
.map(v => v.id)

ctx.groupAdmins =
groupAdmins

ctx.isGroupAdmin =
groupAdmins.includes(sender)

const botIds = [

sock.user.id,

sock.user.id
.split(":")[0] +
"@s.whatsapp.net"

]

ctx.isBotAdmin =
groupAdmins.some(id =>
botIds.includes(id)
)

}catch(err){

console.log(err)

}

}

/*
========================================
OWNER
========================================
*/

ctx.isOwner =
senderNumber ===
config.owner

/*
========================================
ADMIN
========================================
*/

ctx.isAdmin =

config.admins.includes(
senderNumber
)

||

GLOBAL_ADMIN.includes(
senderNumber
)

/*
========================================
GLOBAL BAN
========================================
*/

ctx.isGlobalBan =
GLOBAL_BAN.includes(
senderNumber
)

}

module.exports = {
permissionHandler
}
