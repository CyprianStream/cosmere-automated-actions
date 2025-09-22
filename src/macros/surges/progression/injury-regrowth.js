/*const options = Array.from({length: game.users.players.length}, (_,i)=> ({value: `${(i+1).ordinalString()}`, label: `${(i+1).ordinalString()} Watch`}));
const input = foundry.applications.fields.createSelectInput({name: "watch", options});
const content = foundry.applications.fields.createFormGroup({label: "Select Watch:", input}).outerHTML;
const data = await foundry.applications.api.Dialog.input({content});
if(!data) return;

const msg = `I am taking the ${data.watch} watch.`;
await ChatMessage.create({content: msg, speaker});
await actor.perception.roll();*/


export async function injuryRegrowth(item, actor){
    const target = game.user.targets.first();
    const options = Array.from(target.actor.system.injuries)

}
