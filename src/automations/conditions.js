

export function applyRollConditions(roll, actor){
    if(actor.effects.contents.length === 0){
        console.log("CAA | No effects found")
        return
    }
    let baseDie = roll.parts.substring(0, roll.parts.indexOf(' '));
    let modifiers = roll.parts.substring(roll.parts.indexOf(' ') + 1);
    actor.effects.forEach(effect => {
        switch(effect.id){
            case"condexhausted000":
                const newOperator = new foundry.dice.terms.OperatorTerm({operator: "-"})
                const newTerm = new foundry.dice.terms.NumericTerm({number: effect.system.stacks})
                modifiers = modifiers + " - " + effect.system.stacks
                roll.terms.push(newOperator, newTerm)
            break
            case"condafflicted000":
                //No need to automate as part of a roll
            break
            case"condempowered000":
                switch(true){
                    case(baseDie === "1d20"):
                        roll.terms[0].modifiers.push("kh")
                        roll.terms[0].number = 2
                        baseDie = "2d20kh"
                        roll.options.advantageMode = "advantage"
                    break
                    case(baseDie === "2d20kl"):
                        roll.terms[0].modifiers.push("kh")
                        roll.terms[0].number = 2
                        baseDie = "1d20"
                    break
                    case(baseDie === "2d20kh"):
                        //TODO Add double advantage?
                    break
                }
            break
            case"condfocused00000":
                //No need to automate as part of roll
            break
            case"condrestrained00":
                switch(true){
                    case(baseDie === "1d20"):
                        roll.terms[0].modifiers.push("kl")
                        roll.terms[0].number = 2
                        baseDie = "2d20kl"
                        roll.options.advantageMode = "none"
                    break
                    case(baseDie === "2d20kl"):
                        //TODO Add double disadvantage?
                    break
                    case(baseDie === "2d20kh"):
                        roll.terms[0].modifiers.pop()
                        roll.terms[0].number = 1
                        baseDie = "1d20"
                        roll.options.advantageMode = "none"
                    break
                }
            break
            case"condsurprised000":
                //No need to automate as part of roll
            break
            case"conddetermined00":
                //Not sure how to automate this one yet
            break
            case"condenhanced0000":
                //No need to automate as part of roll, system automates already
            break
            case"condimmobilized0":
                //No need to automate as part of roll
            break
            case"condslowed000000":
                //No need to automate as part of roll
            break
            case"condunconscious0":
                //No need to automate as part of roll
            break
            case"conddisoriented0":
                if(roll.options.title === "Perception Skill Test"){
                    switch(true){
                        case(baseDie === "1d20"):
                            roll.terms[0].modifiers.push("kl")
                            roll.terms[0].number = 2
                            baseDie = "2d20kl"
                            roll.options.advantageMode = "none"
                        break
                        case(baseDie === "2d20kl"):
                            //TODO Add double disadvantage?
                        break
                        case(baseDie === "2d20kh"):
                            roll.terms[0].modifiers.pop()
                            roll.terms[0].number = 1
                            baseDie = "1d20"
                            roll.options.advantageMode = "none"
                        break
                    }
                }
            break
            case"condprone0000000":
                //No need to automate as part of roll
            break
            case"condstunned00000":
                //No need to automate as part of roll
            break
            case"conddead00000000":
                //No need to automate as part of roll
            break
        }
    });
    roll.parts = baseDie + " " + modifiers
    roll.resetFormula()
}

export async function decrementExhausted(actor){
    const effect = actor.effects.get("condexhausted000")
    const currentStacks = effect.stacks
    const newStacks = effect.stacks - 1;
        if (newStacks > 0) {
            // Update the effect
            await effect.update({ 'system.stacks': newStacks });
        } else {
            await actor.toggleStatusEffect("exhausted");
        }
}