/*
========================================
€м𝐨Ⓝ HANDLER5.JS
COMMAND SYSTEM
========================================
*/

async function commandHandler(ctx){

const {

sock,
m,

from,

cmd,
isCmd,

isGroup,
isOwner,
isAdmin,

isGroupAdmin,
isBotAdmin

} = ctx

/*
========================================
NO COMMAND
========================================
*/

if(!isCmd)
return

if(!cmd)
return

/*
========================================
GROUP ONLY
========================================
*/

if(
cmd.config.group &&
!isGroup
){

return sock.sendMessage(
from,
{
text:
"❌ Group Only Command"
},
{
quoted:m
}
)

}

/*
========================================
BOT ADMIN
========================================
*/

if(
cmd.config.botAdmin &&
!isBotAdmin
){

return sock.sendMessage(
from,
{
text:
"❌ Bot Must Be Admin"
},
{
quoted:m
}
)

}

/*
========================================
GROUP ADMIN
========================================
*/

if(
cmd.config.admin &&
!isGroupAdmin
){

return sock.sendMessage(
from,
{
text:
"❌ Group Admin Only"
},
{
quoted:m
}
)

}

/*
========================================
OWNER ONLY
========================================
*/

if(
cmd.config.owner
){

if(
!isOwner &&
!isAdmin
){

return sock.sendMessage(
from,
{
text:
"❌ Owner/Admin Only"
},
{
quoted:m
}
)

}

}

/*
========================================
LOG
========================================
*/

console.log(`
╔════════════════════════════╗
║         €м𝐨Ⓝ LOG           ║
╠════════════════════════════╣
║ ⚡ CMD : ${ctx.command}
║ 👤 USER : ${ctx.senderNumber}
║ 💬 TYPE : ${isGroup ? "GROUP" : "PRIVATE"}
╚════════════════════════════╝
`)

/*
========================================
RUN COMMAND
========================================
*/

await cmd.run(ctx)

}

module.exports = {
commandHandler
}
