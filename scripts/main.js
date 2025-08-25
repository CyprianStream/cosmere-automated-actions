let socket;

Hooks.once("socketlib.ready", () => {
	socket = socketlib.registerModule("cosmere-automated-actions");
    socket.register("CAAloaded", CAALoadMessage)
})

Hooks.once("ready", async () => {
    socket.executeAsGM(CAALoadMessage)
})

function CAALoadMessage(){
    console.log("Cosmere Automated Actions loaded and connected to SocketLib")
}