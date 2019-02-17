const Discord = require('discord.js');
const fs = require('fs')
const queue = require('../db.json').queue
const bots = require('../db.json').bots
const responses = require('./responses.json')
const commands = require('./commands.json')
const prefix = '+'
const cqueue = require('../db.json').certifyQueue

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Bot up and running!');
  var guild = bot.guilds.get("518933890392522753")

  bot.user.setActivity(`${process.DB.get('bots').value().length} Bots`, {type: 'watching'});
}); 
bot.on('guildMemberAdd', (member) => {
  if(member.bot) { 
    let role = member.guild.roles.find('id', "531565643451858945")
    member.addRole(role)
  }
});
function updateJSON(data){
  fs.writeFile('../data/queue.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return console.log(err);
    require('child_process').exec('refresh', (err, out) => {});
  });
}

function clean(text) { // For the eval command
  if (typeof(text) === "string") // this place is for the auto restart.. look down
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
};


bot.on('guildMemberAdd', (member) => {
  if(process.DB.get('bots').find({id: member.user.id})){
    let joinedBot = process.DB.get('bots').find({id: member.user.id}).value()
    if(joinedBot){
      member.addRole('542115582326079490');
      member.guild.members.get(joinedBot.owner[0]).addRole('542114600464810005');
    }
  }
});

bot.on('message', async message => {
    
  if(message.content.substr(0, prefix.length) != prefix) return;
  let args = message.content.split(" ");
  const evalargs = message.content.split(" ").slice(1);

  let command = args[0];
  command = command.slice(prefix.length).toLowerCase();
  args = args.slice(1);
  
 if (command == 'queue'){
   if(message.channel.id !== "542115108726243328") return message.channel.send(`Oops! To execute any moderation command you must go to ${message.guild.channels.find(c=>c.id=="542115108726243328")}`)
    let queueLen = process.DB.get('queue').size().value()
    if(queueLen<=0) return message.channel.send({embed: new Discord.RichEmbed()
                                                 .setTitle(commands.queue.errors.empty)
                                                 .setColor(commands.queue.errors.color)
                                                })
    let limit = 10;
    let index = 0;
    
    let out = '```diff\n'; // I am fixing that it shows the owners
    let embed = new Discord.RichEmbed()
    .setTitle('Queue')
    .setColor(commands.stand)
    .setFooter(`👑 (Owner) | ✍ (Short Description) | ⭐ (Invite) | 🗒 (Prefix) | 📂 (Library)`)
    process.DB.get('queue').value().forEach(queuedBot => { 
      let git;
      if (queuedBot.git.startsWith('http')) {
        git = `[Click!](${queuedBot.git})`
      } else { git = 'Not a valid link'}

      if(index < limit){
         embed.addField(`${queuedBot.name}`, `
Owner: ${queuedBot.owner.join(', ')}
Library: **${queuedBot.library}**
Prefix: **${queuedBot.prefix}** 
[Invite ${queuedBot.name}](${`https://discordapp.com/oauth2/authorize/?permissions=0&scope=bot&client_id=${queuedBot.id}&guild_id=524681874732220418`})
Short Description: ${queuedBot.desc}
`)
  
        // out += '+ Bot name: ' + queuedBot.name + " (" + queuedBot.prefix + " | " + queuedBot.hc + ") – Owner: " + queuedBot.owner.join(", ") + `\n- Invite https://discordapp.com/oauth2/authorize?client_id=${queuedBot.id}&scope=bot&permissions=0\n`;
        index++;
      }
    });
    
    message.channel.send({embed})
  }

  if (command == 'approve') {
    
    if (!args[1] || isNaN(parseInt(args[1]))) {
    if(message.member.roles.find('name', 'Website Moderators')){
    if(!process.DB.get('queue').value()[0]){
        return message.channel.send({embed: new Discord.RichEmbed()
                                     .setTitle(commands.queue.errors.empty)
                                     .setColor(commands.queue.errors.color)
                                    })
      }
      
    bot.channels.get("542116164571103242").send(new Discord.RichEmbed() 
                                                .setTitle(`Bot Approved`)
                                                .setDescription(`**${process.DB.get('queue').value()[0].name}** by <@${process.DB.get('queue').value()[0].owner[0]}> was approved. https://discordrobots.tk/bots/${process.DB.get('queue').value()[0].id}`)
                                                .setColor("GREEN")
                                               .setFooter(`${process.DB.get('queue').value().length} bots in queue`))
    message.author.send({embed: new Discord.RichEmbed()
                          .setTitle('Bot ' + process.DB.get('queue').value()[0].name + ' was accepted.') 
                          .setColor(commands.stand)}) 
      
      bot.users.get(process.DB.get('queue').value()[0].owner[0]).send({embed: new Discord.RichEmbed()
                                                                       .setTitle('Bot accepted')
                                                                       .setDescription(':tada: your bot **' + process.DB.get('queue').value()[0].name + '** was accepted :tada: !')
                                                                       .setColor(commands.stand)
                                                                      // yo make the desc for the accepted one so mods know what to use to invite the bot
                                                                       //sure! thx <3 ;3 
                                                                      })
      process.DB.get('bots').push(process.DB.get('queue').value()[0]).write();
      
      process.DB.set('queue', process.DB.get('queue').value().slice(1)).write();      
    }else{
      return message.channel.send({embed: new Discord.RichEmbed()
                                   .setTitle(responses.noperms.title)
                                   .setColor(responses.noperms.color)
                                  })
    }
    } else {
      if (message.member.roles.find('name', 'Website Moderatorss')) {
      if(!process.DB.get('queue').value()[0]){
        return message.channel.send({embed: new Discord.RichEmbeds().setTitle(responses.nolist.title).setColor(responses.nolist.title)});
      }
        var ind = parseInt(args[1]);
      
        // this needs embed
        
      bot.channels.get("542116164571103242").send({embed: new Discord.RichEmbed()
                                                   .setTitle('Bot Approved')
                                                   .setDescription(`Bot <@${process.DB.get('queue').value()[ind-1].id}> by <@${process.DB.get('queue').value()[ind-1].owner[0]}> was approved by <@${message.author.id}>`)
                                                   .setColor(commands.stand)
                                                  })
      message.author.send({embed: new Discord.RichEmbed()
                           .setTitle('Approved Bot!')
                           .setColor(commands.stand)
                          })
      bot.users.get(process.DB.get('queue').value()[ind-1].owner[0]).send({embed: new Discord.RichEmbed()
                                                   .setTitle('Bot Approved')
                                                   .setDescription(`Bot <@${process.DB.get('queue').value()[ind-1].id}> by <@${process.DB.get('queue').value()[ind-1].owner[0]}> was approved by <@${message.author.id}>`)
                                                   .setColor(commands.stand)
                                                  })
      
      process.DB.get('bots').push(process.DB.get('queue').value()[ind-1]).write();
      
      process.DB.set('queue', process.DB.get('queue').value().splice(ind-1, 1)).write();      
    }else{
      return message.channel.send({embed: new Discord.RichEmbed()
                                   .setTitle(responses.noperms.title)
                                   .setColor(responses.noperms.color)
                                  })
    }
    }
  }
  
  if (command == 'decline') {
    if(message.member.roles.find('name', 'Website Moderators') || message.member.roles.find('name', 'Website Helper') || message.member.roles.find('name', 'Trial [Website Moderators]') || message.member.roles.find('name', 'Trial [Website Helper]')){
      if(!process.DB.get('queue').value()[0]){
        return message.channel.send({embed: new Discord.RichEmbed()
                                     .setTitle("There is no bot to decline in the queue")
                                     .setColor("RED")
                                    })
      }   
      bot.channels.get("542116164571103242").send(new Discord.RichEmbed() 
                                                .setTitle(`Bot Declined`)
                                                .setDescription(`**${process.DB.get('queue').value()[0].name}** by <@${process.DB.get('queue').value()[0].owner[0]}> was declined.

**Reason**: ${args.join(" ") != null ? args.join(" ") : "Not specified"}
***WebPage:*** https://discordrobots.tk/bots/${process.DB.get('queue').value()[0].id} Removed!`)
                                               .setFooter(`${process.DB.get('queue').value().length} bots in queue`)) // stop for a sec plz fix errors so i can test
      process.DB.get('queue').value()[0].owner.forEach(botOwner => {
      bot.users.get(botOwner).send({embed: new Discord.RichEmbed()
                                      .setTitle('Bot Declined')
                                     .setDescription(`${process.DB.get('queue').value()[0].name} by <@${process.DB.get('queue').value()[0].owner}> was denied by: <@${message.author.id}> for: ${args.join(' ')}`)
                                    .setColor(commands.stand)
                                     })
      }).catch(() => { return; })
      process.DB.set('queue', process.DB.get('queue').value().slice(1)).write();
    }else{
      return message.channel.send({embed: new Discord.RichEmbed()
                                   .setTitle(responses.noperms.title)
                                   .setColor(responses.noperms.color)
                                  })
    }
    }
  
  if (command == 'bots') {
    if(message.member.roles.find('name', 'Website Moderators')) {
    var myBots = '';
    var n = 0
    var user = message.mentions.users.first() || bot.users.get(args[0]) || message.author; // LOL;
      
      if (user.bot) {
        let embed = new Discord.RichEmbed()
        .setTitle('This user is a bot.')
        .setColor('RED');
        return message.channel.send({embed})
      }
      process.DB.get('bots').value().forEach(b => {
      b.owner.forEach(o => {
        if (o === user.id) {
          n++
          myBots = myBots + '\n' + n + '. '  + b.name
        }
      })
    })
      var b 
      if (n === 1) b = 'bot'
      if (n !== 1) b = 'bots'
      message.channel.send({embed: new Discord.RichEmbed() 
                            .setDescription(myBots)
                            .setAuthor(`${user.tag}'s ${b}`, user.displayAvatarURL)
                            .setColor('RANDOM') 
                           })
    /*
    let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle('The bot is not in the list!')
                                                  .setColor('RED')
                                                 })
        botInfo = botInfo.value();
        let owners = [];
        botInfo.owner.forEach(owner => {
          if(bot.users.get(owner)){
            owners[owners.length] = '<@' + owner + '> (' + bot.users.get(owner).tag + ')'
          }
        });*/
    }
  }
  
  if (command == 'owner') {
      if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
      let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
      if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
      botInfo = botInfo.value();
      let owners = [];
      botInfo.owner.forEach(owner => {
      if(bot.users.get(owner)){
        owners[owners.length] = '<@' + owner + '> (' + bot.users.get(owner).tag + ')'
      }
      });
        let ownEmbed = new Discord.RichEmbed()
        .setColor(commands.stand)
        .setTitle('Owner(s) | ' + message.mentions.members.first().user.tag)
        .addField('Owner(s):', owners.join(', '));
        message.channel.send(ownEmbed);
      } else {
        message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nobot.title).setColor(responses.nobot.color)})
      }
    } else {
      message.channel.send({embed: new Discord.RichEmbed()
                            .setTitle("Usage")
                            .setDescription(prefix + commands.owner.desc)
                            .setColor(responses.usage.color)
                           })
    }
  }
 
  
  if(command == 'prefix') {
    
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo.value() || (botInfo === undefined)) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        
        botInfo = botInfo.value();
        
        let preEmbed = new Discord.RichEmbed()
        .setColor(commands.stand)
        .setTitle('Prefix | ' + message.mentions.members.first().user.tag)
        .addField('Prefix:', `${botInfo.prefix}`);
        message.channel.send(preEmbed);
      }else{
        message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nobot.title).setColor(responses.nobot.color)})
      }
    }else{
      message.channel.send({embed: new Discord.RichEmbed()
                            .setTitle(responses.usage.title)
                            .setDescription(prefix + commands.prefix.desc)
                            .setColor(responses.usage.color)
                           })
    }
    }
  
  if(command == 'invite'){
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        botInfo = botInfo.value();
        
        let preEmbed = new Discord.RichEmbed()
        .setColor(commands.stand)
        .setTitle('Invite | ' + message.mentions.members.first().user.tag)
        .addField('Invite', `https://discordapp.com/oauth2/authorize?&client_id=${botInfo.id}&scope=bot&permissions=8`);
        message.channel.send(preEmbed);
      }else{
        message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nobot.title).setColor(responses.nobot.color)})
      }
    }else{
      message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.usage.title).setColor(responses.usage.color)})
    }
  }

  
  if(command == 'delete'){
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        botInfo = botInfo.value();
        
        if(message.member.roles.find('name', 'Website Administrator')){
          
          process.DB.get('bots').remove({id: message.mentions.members.first().user.id});
          
          message.mentions.members.first().kick().then(() => {
            message.channel.send({embed: new Discord.RichEmbed()
                                  .setTitle("Deleted")
                                  .setColor(commands.delete.delete.color)
                                 })
          bot.channels.get("542116164571103242").send(`${message.author.tag} forcefully deleted ${message.mentions.members.first().user.tag} for: ${args.join(' ')}`)
            
          });
          
        } else {
          return message.channel.send({embed: new Discord.RichEmbed()
                                       .setTitle(responses.noperms.title)
                                       .setColor(responses.noperms.color)
                                      })
        }
      }else{
        message.channel.send({embed: new Discord.RichEmbed()
                              .setTitle(responses.nobot.title)
                              .setColor(responses.nobot.color)
                             })
      }
    }else{
      message.channel.send({embed: new Discord.RichEmbed()
                            .setTitle(responses.usage.title)
                            .setDescription(prefix + commands.delete.desc)
                            .setColor(responses.usage.color)
                           })
    }
  } 
  
  if(command == 'api'){
     //It just DMs the user always
      if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){

          let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
          if(!botInfo.value()) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.title)
                                                 })
          let botInfoValue = botInfo.value();

          if(botInfoValue.owner.includes(message.author.id) || message.member.roles.find('name', 'Website Moderators')){
            var generator = require('generate-password');
            let newPass = generator.generate({
              length: 100,
              numbers: true,
              uppercase: false
            });
            
            
            botInfo.set('apiKey', newPass).write();
            message.author.send({embed: new Discord.RichEmbed()
                                 .setAuthor(message.author.tag, message.author.displayAvatarURL)
                                 .setTitle(`dbtoken for ${botInfoValue.name}`)
                                 .setDescription(`\`${newPass}\``)
                                 .setFooter('Don\'t not share your bot DBC token with anyone!')
                                })
            message.channel.send('Please check your DMS for the DBC token');
            console.log(botInfo.value());
            
          } else { 
            return message.channel.send({embed: new Discord.RichEmbed()
                                         .setTitle(responses.noperms.title)
                                         .setColor(responses.noperms.color)})
          }
        }else{
          message.channel.send({embed: new Discord.RichEmbed()
                         .setTitle(responses.nobot.title)
                         .setColor(responses.nobot.color)
                        })
        }
      }else{
        message.channel.send({embed: new Discord.RichEmbed()
                              .setTitle(responses.usage.title)
                              .setDescription(commands.token.desc)
                              .setColor(responses.usage.color)
                             })
      }
    }
    if (command == 'mute') {
    bot.channels.get("542116164571103242").send(`***MuteCase,*** @${message.author.tag} Has muted the bot @${message.mentions.members.first().user.tag} for the reason ${args.join(' ')}`)
    }

   if (command == 'bot') {
    if (message.mentions.members.first()) {
      if (message.mentions.members.first().user.bot) {
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        botInfo = botInfo.value();        
        if(botInfo == null) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        var b = message.mentions.members.first().user
        var certifyCheck = {
          false: "Not really.",
          true: "Yes, indeed it is."
        };
        message.channel.send(new Discord.RichEmbed()
                            .setTitle(`${botInfo.name}`)
                            .setDescription(`[${botInfo.desc}](https://discordrobots.tk/bot/${botInfo.id})`)
                             .setThumbnail(b.avatarURL)
                            .addField(`Information`, `**BOT NAME:** ${botInfo.name} (${botInfo.id})
**LIBRARY:** ${botInfo.library} 
**PREFIX:** ${botInfo.prefix}
**OWNER:** ${botInfo.owner.map(owner => `<@${owner}>`)}
**CERTIFIED:** ${certifyCheck[botInfo.certified]}`)
                            .addField(`Other Information`, `**GITHUB REPO:** ${botInfo.git ? botInfo.git : `Cannot be located`}
**WEBSITE:** ${botInfo.website ? botInfo.website : `Cannot be located`}`))
      }
    }
  }
  
});

bot.login(process.env.TOKENE);

module.exports = bot;