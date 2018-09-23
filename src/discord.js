'use strict';

const eris = require('eris');
const CatLoggr = require('cat-loggr');
const config = require('./config.json');
const loggr = new CatLoggr({
    levels: [
        { name: 'info', color: CatLoggr._chalk.red.bgBlack },
        { name: 'debug', color: CatLoggr._chalk.black.bgRed },
        { name: 'error', color: CatLoggr._chalk.red.bgRed },
        { name: 'reload', color: CatLoggr._chalk.green.bgBlack },
        { name: 'warn', color: CatLoggr._chalk.yellow.bgBlack }
    ]
}).setGlobal();

var birb = require('birb');
var bot = new eris(config.bot.token);

bot.on("ready", () => {
    console.info("I'm ready, connecting...");
    bot.connect();
    console.info("Connected!");
});

bot.on("hello", (trace, id) => {
    console.debug("Got HELLO packet, data: " + trace + ", ShardID :" + id);
});

bot.on("connect", (id) => {
    console.info("Shard " + id + " connected.");
});

bot.on("disconnect", () => {
    console.crit("All shards just disconnected! OwO what's this? *nuzzles*");
    console.warn("Time to reload!");
    bot.disconnect();
    console.reload("Disconnected! Reconnecting in a moment!");
    bot.connect();
    console.reload("Connected!");
});

bot.on("error", (err, id) => {
    console.warn("Shard " + id + " encountered an error. Error message: " + err);
});

bot.on("warn", (message, id) => {
    console.warn("Something strange happens on shard " + id + "\nMessage: " + message);
});

bot.on("unknown", (packet, id) => {
    console.warn("Shard " + id + " just got something. Data: " + packet);
});

bot.on("messageCreate", (msg) => {
    if (msg.content == config.bot.prefix + "ping") {
        console.info("Someone pinged me! UserID: " + msg.author.id);
        console.warn("Pinging bot without any reason is not good. Check Discord status, please!");
        bot.createMessage(msg.channel.id, "Pong!");
    }
});

//Respawn and stuff...
bot.on("messageCreate", (msg) => {
    if (msg.content === config.bot.prefix + "reload") {
        if (msg.author.id != config.donut_id) {
            bot.createMessage(msg.channel.id, "You look pretty suspicious to reboot me... :thinking:");
            console.warn(msg.author.id + "... They think they can reboot me...");
        } else {
            bot.createMessage(msg.channel.id, "Reloading...");
            console.reload("Got Donut rights! Unloading...");
            bot.disconnect();
            console.reload("Unloaded, reconnecting...");
            bot.connect();
            bot.on("connect", (id) => {
                console.reload("Shard " + id + " reloaded successfully!");
            }); bot.createMessage(msg.channel.id, "Hello?");
        }
    }
});

bot.on("messageCreate", (msg) => {
    if (msg.content == config.bot.prefix + "help") {
        bot.createMessage(msg.channel.id, "Help is on the way!\n1.Current prefix is `cat!`, but it might be changed in future.\n2.**Commands**:\n2.1. Ping - `cat!ping`\n2.2. Birbs - `cat!birb` - get random birb!");
    }
});

bot.on("messageCreate", (msg) => {
    if (msg.content === "bird!") {
        bot.createMessage(msg.channel.id, birb.random().then(url => console.debug("Ignore it, I haven't created a workaround to make bot work without this...")));
        console.info("Birb request!\nLink: " + url + "\nRequesterID: " + msg.author.id);
    }
});

bot.on("messageCreate", (msg) => {
    if (msg.content == config.bot.prefix + "stop") {
        bot.createMessage(msg.channel.id, "Bye! Shutting down...");
        console.info("Disconnecting...");
        bot.disconnect();
        console.warn("Killing process...");
        process.exit(1);
    }
});

bot.on("messageCreate", (msg) => {
    if (msg.content == config.bot.prefix + "invite") {
        bot.createMessage(msg.channel.id, "Invite link: " + config.bot.invite);
    }
});

bot.connect();
