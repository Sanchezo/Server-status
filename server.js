/* to do:
Discord bot that detects game server state
add configuration via commands
*/
const Gamedig = require('gamedig'); // Require packet that allows us to check game server's activity
var cron = require('node-cron'); // Require packet that allows us to schedule tasks every x sec/min/hour/day
const Discord = require("discord.js") // Require packet that allows us to communicate with discord api
const client = new Discord.Client()
var status // variable that stores server status
const prefix = "." // bot's prefix

client.on("ready", ready => {
    console.log(`Uruchomiono jako ${client.user.tag}`) // when bot is ready we print it in console
})


cron.schedule(`*/1 * * * *`, () => { // we schedule a task every minute
    console.log('running a task every minute'); // log it in console
    Gamedig.query({ // we scan game server specified below
        type: 'example', //game type
        host: 'serverip', // server ip
       
    }).then((state) => { //after scanning we check server state - if server is online


        console.log(state); // prints server state in console
        if (status == "offline") { // we check if server was previosly offline
            var guild = client.guilds.cache.get('guild id'); // We get a server by it's id
            if (guild && guild.channels.cache.get('channel id')) { // We check if specified server exist and we check if specified channel exists

                guild.channels.cache.get('channel id').send("example message!!") // if all conditions were satisfied send message 
                status = "online" // change status to online
            } else {
                console.log("nope");
                //if the bot doesn't have guild with the id guildid
                // or if the guild doesn't have the channel with id channelid
            }
        }
    }).catch((error) => { // if server is offline
        console.log(error)
        console.log("Server is offline");

        var guild = client.guilds.cache.get('guild id');// as above
        if (guild && guild.channels.cache.get('channel id')) { // as above

            guild.channels.cache.get('channel id').send("<@175353646521778176> server went offline!")// we send message that says that server went offline
            status = "offline" //we change status to offline
        } else {
            console.log("nope");
            //if the bot doesn't have guild with the id guildid
            // or if the guild doesn't have the channel with id channelid
        }


    });
});
client.login("token") // we log into discord api using token
