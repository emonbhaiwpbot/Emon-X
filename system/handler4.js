/*
========================================
€м𝐨Ⓝ HANDLER4.JS
EVENT SYSTEM
========================================
*/

async function eventHandler(ctx){

const {

sock,

from,

config,

body,

m

} = ctx

/*
========================================
FAKE TYPING
========================================
*/

if(config.fakeTyping){

try{

await sock.sendPresenceUpdate(
"composing",
from
)

}catch{}

}

/*
========================================
PLUGIN EVENTS
========================================
*/

for(let name in global.plugins){

const plugin =
global.plugins[name]

if(plugin.event){

try{

await plugin.event(ctx)

}catch(err){

console.log(err)

}

}

}

}

module.exports = {
eventHandler
}
