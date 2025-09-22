
//TODO: add sphere dunning, currently unsure of how could make this work without potentially deleting currency
//let spheresDunned = 0
export async function breatheStormlight(){
  const spheresInfusedTotal = actor.system.currency.spheres.total.derived
  const actorInv = actor.system.resources.inv.value
  const actorInvMax = actor.system.resources.inv.max.derived
  if(spheresInfusedTotal > actorInvMax - actorInv){
    //todo dun spheres equal to actorInvMax - actorInv
    actor.update({ 'system.resources.inv.value': actorInvMax })
    //spheresDunned = actorInvMax - actorInv
  } else if (spheresInfusedTotal >= 1){
    while (spheresInfusedTotal >= 1 && actorInv < actorInvMax){
      let newInv = actorInv++
      actor.update({ 'system.resources.inv.value': actorInvMax })
      //spheresDunned++
    }
  }
}