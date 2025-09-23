export function disquiet(item, actor){
    let dialogWindow = new Dialog({
 title: "Disquiet",
 content: "<p>Do you know one of the target's goals?</p>",
 buttons: {
  one: {
   icon: '<i class="fas fa-check"></i>',
   label: "Yes (1d4 focus)",
   callback: () => {
    /*let r = new Roll("1d4")
    target.actor.system.foc.value - r
    if(target.actor.system.foc.value < 0){
        target.actor.system.foc.value = 0
    }*/
   console.log("selected yes")
   }
  },
  two: {
   icon: '<i class="fas fa-times"></i>',
   label: "No (1 focus)",
   callback: () => {
    /*target.actor.system.foc.value--
    if(target.actor.system.foc.value < 0){
        target.actor.system.foc.value = 0
    }*/
   console.log("selected no")
   }
  }
 },
 default: "two",
 render: html => console.log("Register interactivity in the rendered dialog"),
 close: html => console.log("This always is logged no matter which option is chosen")
});
dialogWindow.render(true);
}