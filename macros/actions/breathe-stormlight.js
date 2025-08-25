
import { spheresInfusedTotal, actorInv, actorInvMax } from "../utils"

//TODO: add sphere dunning, currently unsure of how could make this work without potentially deleting currency

export async function breatheStormlight(){
  if(spheresInfusedTotal > actorInvMax - actorInv){
    //todo dun spheres equal to actorInvMax - actorInv
    actor.update({ 'system.resources.inv.value': actorInvMax })
  } else if (spheresInfusedTotal >= 1){
    while (spheresInfusedTotal >= 1 && actorInv < actorInvMax){
      let newInv = actorInv++
      actor.update({ 'system.resources.inv.value': actorInvMax })
      //todo dun one sphere
    }
  }
}