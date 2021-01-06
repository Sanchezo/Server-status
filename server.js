/* to do:
Discord bot that detects game server state
add configuration via commands
*/
const Gamedig = require('gamedig'); // Require packet that allows us to check game server's activity
var cron = require('node-cron'); // Require packet that allows us to schedule tasks every x sec/min/hour/day
const Discord = require("discord.js"); // Require packet that allows us to communicate with discord api
const client = new Discord.Client();
var servers = [
    { 
        name: 'Omega EU', 
        host: 's1.rebels-games.com', 
        proxy: '27016', 
        status: 'offline', 
        msgSent: false 
    }
    // ,{ 
        // name: 'Test Server', 
        // host: '176.9.54.124', 
        // proxy: '27015', 
        // status: 'offline',
        // msgSent: false  
    // }
];

const prefix = "."; // bot's prefix

client.on("ready", () => {
    console.log(`Uruchomiono jako ${client.user.tag}`);
    console.log('');
});


cron.schedule(`*/5 * * * *`, () => {
    console.log('[========================================================]');

    servers.forEach(function (s, i) {
        Gamedig.query({
            type: 'spaceengineers',
            host: s.host,
            port: s.proxy
        }).then((state) => {

            let now = new Date();
            console.log(`${now.getDate()}-${now.getMonth()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()} | ${s.name} | STATUS: ONLINE`);

            if(s.status == 'offline'){
                s.status = 'online';
                s.msgSent = false;
            }

            if(s.status == 'online' && s.msgSent == false){
                var guild = client.guilds.cache.get('306529139479937025');
                if (guild && guild.channels.cache.get('306529139479937025')) {
                    const exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#00ff00')
                        .setTitle('Server Status: Online')        
                        .setAuthor('Rebels Games Bot 🛰️', 'https://cdn.discordapp.com/attachments/712677998343487490/730446281884958751/LogoRebels4.png')
                        .setDescription('• Service available for use.')
                        .addField('State:', `• ${s.name} is Online!
• Connect: steam://connect/s1.rebels-games.com:27016`, true)        
                        .setTimestamp();                    
                    guild.channels.cache.get('306529139479937025').send(exampleEmbed);
                    s.msgSent = true;
                }
            }

        }).catch((error) => {

            let now = new Date();
            console.log(`${now.getDate()}-${now.getMonth()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()} | ${s.name} | STATUS: OFFLINE`);

            if(s.status == 'online'){
                s.status = 'offline';
                s.msgSent = false;
            }

            if(s.status == 'offline' && s.msgSent !== true){
                var guild = client.guilds.cache.get('306529139479937025');
                if (guild && guild.channels.cache.get('306529139479937025')) {
                    const exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#ff3300')
                        .setTitle('Server Status: Offline')        
                        .setAuthor('Rebels Games Bot 🛰️', 'https://cdn.discordapp.com/attachments/712677998343487490/730446281884958751/LogoRebels4.png')
                        .setDescription('• Service interruption detected: Administration has been notified, please be patient.')
                        .addField('State:', `• ${s.name} is Offline!
• <@&633735638469967904> fix it!`, true)        
                        .setTimestamp();                    
                    guild.channels.cache.get('306529139479937025').send(exampleEmbed);
                    s.msgSent = true;
                }
            }

        });

    });
    console.log('[========================================================]');

});
client.login("") // we log into discord api using token
