import { surgeScalingSize, surgeScalingDie } from "../../../utils/constants";

export function progression(item, actor) {
    const target = game.user.targets.first();
    const actorProgressionRank = actor.system.skills.prg.rank
    if(plantGrowth){
        surgeScalingSize(actorProgressionRank)
    } else if(characterRegrowth){
        surgeScalingDie(actorProgressionRank)

    }
}
