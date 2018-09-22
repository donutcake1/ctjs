const Eris = require('eris');
const CatLoggr = require('cat-loggr');
const catprefix = "cat!";
const config = require('./config.json');

var bot = new Eris(config.config.bot.token);
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
        if(msg.author.id != config.config.donut_id){
            bot.createMessage(msg.channel.id, "You look pretty suspicious to reboot me... :thinking:");
            console.warn(msg.author.id + "... They think they can reboot me...");
        } else {
            console.reload("Got Donut rights! Unloading...");
            bot.disconnect();
            console.reload("Unloaded, reconnecting...");
            bot.connect();
            bot.on("connect", (id) => {
                console.reload("Shard " + id + " reloaded successfully!");
            });
        }
    }
});

bot.on("warn", (message, id) => {
    console.warn("On shard " + id + "is happening something: " + message);
})

bot.connect();
