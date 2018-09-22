const Eris = require('eris');
const CatLoggr = require('cat-loggr');
const catprefix = "cat!";

var bot = new Eris(<place_your_token_there>);

const loggr = new CatLoggr({
    levels: [
        { name: 'info', color: CatLoggr._chalk.red.bgBlack },
        { name: 'debug', color: CatLoggr._chalk.black.bgRed },
        { name: 'error', color: CatLoggr._chalk.red.bgRed },
        { name: 'reload', color: CatLoggr._chalk.green.bgBlack }
    ]
}).setGlobal();

bot.on("ready", () => {
    console.info("HELLO?");
})

bot.on("messageCreate", (msg) => {
    if(msg.content === catprefix + "ping"){
        bot.createMessage(msg.channel.id, "I'm fine, " + "<@" + msg.author.id + ">, thanks for asking!");
        console.info("Someone pinged me! ID: " + msg.author.id);
    }
});

bot.on("messageCreate", (msg) => {
    if(msg.content === catprefix + "reload"){
        if(msg.author.id != "241612639560531968"){
            bot.createMessage(msg.channel.id, "You look pretty suspicious to reboot me... :thinking:");
            console.warn(msg.author.id + "... They think they can reboot me...");
        } else {
            console.reload("Got Donut rights! Unloading...");
            bot.disconnect();
        }
    }
});

bot.on("disconnect", () => {
    console.reload("Disconnected! Reconnecting...");
    bot.connect();
})

bot.connect();
